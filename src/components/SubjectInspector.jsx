"use client";

import { Pin, Lock, Rocket, X, ArrowRight, Compass, Flame, CheckCircle2 } from "lucide-react";
import { subjectsData } from "@/data/subjects";
import {
  formatPadId,
  getSubjectById,
  doesSubjectUnlock,
  getCfBadgeStyle,
} from "@/utils/correlativas";

export default function SubjectInspector({
  selectedSubject,
  onSelectSubject,
  onClose,
  studentProgress,
  onStatusChange,
  theme,
}) {
  const isLight = theme === "light";

  if (!selectedSubject) {
    return (
      <aside
        className={`hidden lg:block sticky top-20 h-fit rounded-2xl border p-6 shadow-xl transition-colors ${
          isLight
            ? "border-slate-200 bg-white"
            : "border-slate-800 bg-slate-900/90 backdrop-blur-md"
        }`}
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="mb-3 rounded-2xl bg-cyan-500/10 p-3.5 text-cyan-400 ring-1 ring-cyan-500/30">
            <Compass className="h-7 w-7 animate-pulse"/>
          </div>
          <h3 className={`text-base font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Inspector Interactivo
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Pasá el cursor o hacé clic sobre cualquier materia para iluminar su cadena de correlatividades hacia atrás y hacia adelante.
          </p>

          <div
            className={`mt-5 w-full rounded-xl border p-3.5 text-left text-xs space-y-2 ${
              isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/70"
            }`}
          >
            <p className="font-bold uppercase tracking-wider text-cyan-500 text-[11px]">
              💡 Tip de Uso Rápido:
            </p>
            <p className="text-slate-400">
              • Las materias con el ícono <strong className="text-orange-400">🔥 Llave</strong> son cuellos de botella: aprobarlas destraba la mayor cantidad de materias del plan.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const regList = Array.isArray(selectedSubject.regReq)
    ? selectedSubject.regReq.map((id) => getSubjectById(id)).filter(Boolean)
    : [];

  const aprList = Array.isArray(selectedSubject.aprReq)
    ? selectedSubject.aprReq.map((id) => getSubjectById(id)).filter(Boolean)
    : [];

  const unlockedList = subjectsData.filter(
    (s) => s.id !== selectedSubject.id && doesSubjectUnlock(selectedSubject, s)
  );

  const currentStatus = studentProgress[selectedSubject.id] || "pendiente";

  return (
    <aside
      className={`fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-y-auto rounded-t-3xl border-t p-5 shadow-2xl transition-all lg:sticky lg:top-20 lg:z-10 lg:max-h-[calc(100vh-6rem)] lg:rounded-2xl lg:border ${
        isLight
          ? "border-slate-300 bg-white text-slate-900"
          : "border-slate-700 bg-slate-900/95 text-slate-100 backdrop-blur-xl"
      }`}
    >
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/60 pb-3.5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 font-mono text-xs font-extrabold text-blue-400">
              #{formatPadId(selectedSubject.id)}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getCfBadgeStyle(
                selectedSubject.cf,
                isLight
              )}`}
            >
              {selectedSubject.cf}
            </span>
            {unlockedList.length >= 4 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                <Flame className="h-3 w-3"/> Materia Troncal
              </span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-extrabold leading-snug">{selectedSubject.name}</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {selectedSubject.year}° Año • {selectedSubject.hs} hs cátedra • {selectedSubject.accred}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-1.5 text-slate-400 hover:text-white cursor-pointer"
          title="Cerrar inspector"
        >
          <X className="h-4 w-4"/>
        </button>
      </div>

      {/* Selector rápido de Estado Académico directo en el Inspector */}
      <div
        className={`mt-3.5 rounded-xl border p-3 ${
          isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/80"
        }`}
      >
        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Mi Estado en esta Materia:
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "pendiente", label: "Pendiente", activeClass: "bg-slate-700 text-white" },
            { id: "regular", label: "Regular", activeClass: "bg-amber-500 text-slate-950 font-bold" },
            { id: "aprobada", label: "Aprobada", activeClass: "bg-emerald-500 text-slate-950 font-bold" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => onStatusChange(selectedSubject.id, st.id)}
              className={`rounded-lg py-1.5 text-xs font-semibold transition cursor-pointer ${
                currentStatus === st.id
                  ? st.activeClass
                  : isLight
                  ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3.5">
        {/* Regular para Cursar */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
          <h4 className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-amber-400">
            <span className="flex items-center gap-1.5">
              <Pin className="h-3.5 w-3.5"/> Regular para Cursar
            </span>
            <span>({regList.length})</span>
          </h4>
          {regList.length > 0 ? (
            <ul className="mt-2.5 space-y-1.5 text-xs">
              {regList.map((req) => {
                const isDone = ["regular", "aprobada"].includes(studentProgress[req.id]);
                return (
                  <li
                    key={req.id}
                    onClick={() => onSelectSubject(req.id)}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                      isLight ? "hover:bg-amber-200/50 text-slate-800" : "hover:bg-slate-800/80 text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0"/>}
                      <strong className="font-mono text-amber-400">[{formatPadId(req.id)}]</strong>{" "}
                      {req.name}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0"/>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-1.5 text-xs italic text-slate-400">
              Cursada directa (sin requisitos previos)
            </p>
          )}
        </div>

        {/* Aprobada para Rendir */}
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5">
          <h4 className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-red-400">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5"/> Aprobada para Rendir
            </span>
            <span>
              {typeof selectedSubject.aprReq === "string" ? "(Global)" : `(${aprList.length})`}
            </span>
          </h4>
          {aprList.length > 0 ? (
            <ul className="mt-2.5 space-y-1.5 text-xs">
              {aprList.map((req) => {
                const isDone = studentProgress[req.id] === "aprobada";
                return (
                  <li
                    key={req.id}
                    onClick={() => onSelectSubject(req.id)}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                      isLight ? "hover:bg-red-200/50 text-slate-800" : "hover:bg-slate-800/80 text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0"/>}
                      <strong className="font-mono text-red-400">[{formatPadId(req.id)}]</strong>{" "}
                      {req.name}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0"/>
                  </li>
                );
              })}
            </ul>
          ) : typeof selectedSubject.aprReq === "string" ? (
            <p className="mt-2 rounded-lg bg-red-500/20 p-2.5 text-xs font-bold text-red-300">
              Requisito global: Tener aprobado todo {selectedSubject.aprReq} completo.
            </p>
          ) : (
            <p className="mt-1.5 text-xs italic text-slate-400">
              Sin requisitos previos para rendir
            </p>
          )}
        </div>

        {/* Desbloquea a futuro */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
          <h4 className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5"/> Habilita a Futuro
            </span>
            <span>({unlockedList.length})</span>
          </h4>
          {unlockedList.length > 0 ? (
            <ul className="mt-2.5 space-y-1.5 text-xs">
              {unlockedList.map((u) => (
                <li
                  key={u.id}
                  onClick={() => onSelectSubject(u.id)}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition cursor-pointer ${
                    isLight
                      ? "hover:bg-emerald-200/50 text-slate-800"
                      : "hover:bg-slate-800/80 text-slate-200"
                  }`}
                >
                  <span>
                    <strong className="font-mono text-emerald-400">[{formatPadId(u.id)}]</strong>{" "}
                    {u.name}{" "}
                    <span className="text-[11px] text-slate-400">({u.year}° Año)</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0"/>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-xs italic text-slate-400">
              No es correlativa previa de materias posteriores
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}