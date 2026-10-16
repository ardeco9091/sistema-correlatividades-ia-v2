import { subjectsData } from "@/data/subjects";

export function formatPadId(id) {
  return String(id).padStart(2, "0");
}

export function getSubjectById(id) {
  return subjectsData.find((s) => s.id === Number(id));
}

export function isRequiredAsAprobada(targetSubject, candidateId) {
  if (!targetSubject) return false;
  const candidate = getSubjectById(candidateId);
  if (!candidate) return false;

  if (Array.isArray(targetSubject.aprReq)) {
    return targetSubject.aprReq.includes(candidateId);
  }
  if (targetSubject.aprReq === "1er. Año") return candidate.year === 1;
  if (targetSubject.aprReq === "2do. Año") return candidate.year <= 2;
  return false;
}

export function isRequiredAsRegular(targetSubject, candidateId) {
  if (!targetSubject) return false;
  return Array.isArray(targetSubject.regReq) && targetSubject.regReq.includes(candidateId);
}

export function doesSubjectUnlock(sourceSubject, futureSubject) {
  if (!sourceSubject || !futureSubject) return false;
  return (
    isRequiredAsRegular(futureSubject, sourceSubject.id) ||
    isRequiredAsAprobada(futureSubject, sourceSubject.id)
  );
}

export function getUnlockedCount(subject) {
  return subjectsData.filter((s) => s.id !== subject.id && doesSubjectUnlock(subject, s)).length;
}

export function getSubjectRelation(activeSubject, currentSubject) {
  if (!activeSubject) return { type: "none", reqApr: false, reqReg: false, unlocks: false };
  if (activeSubject.id === currentSubject.id) {
    return { type: "selected", reqApr: false, reqReg: false, unlocks: false };
  }

  const reqApr = isRequiredAsAprobada(activeSubject, currentSubject.id);
  const reqReg = isRequiredAsRegular(activeSubject, currentSubject.id);
  const unlocks = doesSubjectUnlock(activeSubject, currentSubject);

  let primaryType = "none";
  if (reqApr) primaryType = "req-aprobada";
  else if (reqReg) primaryType = "req-regular";
  else if (unlocks) primaryType = "unlocked";

  return { type: primaryType, reqApr, reqReg, unlocks };
}

export function evaluateStudentAvailability(subject, studentProgress) {
  const regOk = Array.isArray(subject.regReq)
    ? subject.regReq.every((id) => ["regular", "aprobada"].includes(studentProgress[id]))
    : true;

  let aprOk = false;
  if (Array.isArray(subject.aprReq)) {
    aprOk = subject.aprReq.every((id) => studentProgress[id] === "aprobada");
  } else if (subject.aprReq === "1er. Año") {
    aprOk = subjectsData.filter((s) => s.year === 1).every((s) => studentProgress[s.id] === "aprobada");
  } else if (subject.aprReq === "2do. Año") {
    aprOk = subjectsData.filter((s) => s.year <= 2).every((s) => studentProgress[s.id] === "aprobada");
  }

  return { canTake: regOk, canPass: regOk && aprOk };
}

export function getCfBadgeStyle(cf, isLight = false) {
  if (isLight) {
    switch (cf) {
      case "General":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Fundamento":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "Específica":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Práctica Profesionalizante":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  }

  switch (cf) {
    case "General":
      return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    case "Fundamento":
      return "bg-sky-500/15 text-sky-300 border-sky-500/30";
    case "Específica":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "Práctica Profesionalizante":
      return "bg-orange-500/15 text-orange-300 border-orange-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  }
}
// Devuelve qué materias futuras exigen tener esta materia APROBADA para poder rendirse
export function getAprobadaDependents(sourceSubject) {
  return subjectsData.filter(
    (future) => future.id !== sourceSubject.id && isRequiredAsAprobada(future, sourceSubject.id)
  );
}

// Calcula el orden ideal para rendir exámenes finales según las materias Regulares del alumno
export function getFinalExamRecommendations(studentProgress) {
  const regularSubjects = subjectsData.filter(
    (s) => studentProgress[s.id] === "regular"
  );

  const analyzed = regularSubjects.map((subject) => {
    // 1. Verificar qué requisitos de aprobación le faltan para poder rendir esta materia
    let missingToPass = [];
    if (Array.isArray(subject.aprReq)) {
      missingToPass = subject.aprReq
        .filter((reqId) => studentProgress[reqId] !== "aprobada")
        .map((reqId) => getSubjectById(reqId))
        .filter(Boolean);
    } else if (subject.aprReq === "1er. Año") {
      missingToPass = subjectsData.filter(
        (s) => s.year === 1 && studentProgress[s.id] !== "aprobada"
      );
    } else if (subject.aprReq === "2do. Año") {
      missingToPass = subjectsData.filter(
        (s) => s.year <= 2 && studentProgress[s.id] !== "aprobada"
      );
    }

    const canRenderNow = missingToPass.length === 0;

    // 2. Calcular cuántas materias futuras exigen esta materia aprobada
    const aprDependents = getAprobadaDependents(subject);

    // 3. Calcular cuántas de las otras materias que el alumno YA tiene regulares se destrabarían para rendir si aprueba esta
    const unlocksOtherRegulares = regularSubjects.filter(
      (otherReg) =>
        otherReg.id !== subject.id && isRequiredAsAprobada(otherReg, subject.id)
    );

    // Puntaje de prioridad estratégica
    const priorityScore =
      (canRenderNow ? 1000 : 0) +
      unlocksOtherRegulares.length * 150 +
      aprDependents.length * 30 +
      (4 - subject.year) * 20;

    return {
      ...subject,
      canRenderNow,
      missingToPass,
      aprDependents,
      unlocksOtherRegulares,
      priorityScore,
    };
  });

  return analyzed.sort((a, b) => b.priorityScore - a.priorityScore);
}