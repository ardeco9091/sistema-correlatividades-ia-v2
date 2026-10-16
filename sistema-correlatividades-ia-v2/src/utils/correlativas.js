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

export function getSubjectRelation(selectedSubject, currentSubject) {
  if (!selectedSubject) return { type: "none", reqApr: false, reqReg: false, unlocks: false };
  if (selectedSubject.id === currentSubject.id) {
    return { type: "selected", reqApr: false, reqReg: false, unlocks: false };
  }

  const reqApr = isRequiredAsAprobada(selectedSubject, currentSubject.id);
  const reqReg = isRequiredAsRegular(selectedSubject, currentSubject.id);
  const unlocks = doesSubjectUnlock(selectedSubject, currentSubject);

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

export function getCfBadgeStyle(cf) {
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