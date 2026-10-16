"use client";

import { Pin, Lock, Rocket, X, ArrowRight, Info } from "lucide-react";
import { subjectsData } from "@/data/subjects";
import { formatPadId, getSubjectById, doesSubjectUnlock, getCfBadgeStyle } from "@/utils/correlativas";

export default function SubjectInspector({ selectedSubject, onSelectSubject, onClose }) {
  if (!selectedSubject) {
    return (
      <aside className="hidden lg:block sticky top-20 h-fit rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 rounded-full bg-slate-800 p-3 text-cyan-400">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Inspector de Correlatividades</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            Hacé clic sobre cualquier materia en el tablero o en la tabla para inspeccionar qué requisitos pide y qué materias desbloquea a futuro.
          </p>
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

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-slate-700 bg-slate-900 p-5 shadow-2xl lg:sticky lg:top-20 lg:z-10 lg:max-h-[calc(100vh-6rem)] lg:rounded-xl lg:border lg:border-slate-800">
      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400">
              #{formatPadId(selectedSubject.id)}
            </span>
            <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${getCfBadgeStyle(selectedSubject.cf)}`}>
              {selectedSubject.cf}
            </span>
          </div>
          <h3 className="mt-1 text-base font-bold text-white">{selectedSubject.name}</h3>
          <p className="text-xs text-slate-400">
            {selectedSubject.year}° Año • {selectedSubject.hs} hs cátedra • {selectedSubject.accred}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:text-white cursor-pointer"
          title="Cerrar selección"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3.5">
        {/* Regular para Cursar */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <h4 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400">
            <span className="flex items-center gap-1.5">
              <Pin className="h-3.5 w-3.5" /> Regular para Cursar
            </span>
            <span>({regList.length})</span>
          </h4>
          {regList.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {regList.map((req) => (
                <li
                  key={req.id}
                  onClick={() => onSelectSubject(req.id)}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-slate-200 hover:bg-slate-800/80 cursor-pointer"
                >
                  <span>
                    <strong className="font-mono text-amber-300">[{formatPadId(req.id)}]</strong> {req.name}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-xs italic text-slate-400">Sin requisitos previos de regularidad</p>
          )}
        </div>

        {/* Aprobada para Rendir */}
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
          <h4 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-red-400">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Aprobada para Rendir
            </span>
            <span>
              {typeof selectedSubject.aprReq === "string" ? "(Global)" : `(${aprList.length})`}
            </span>
          </h4>
          {aprList.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {aprList.map((req) => (
                <li
                  key={req.id}
                  onClick={() => onSelectSubject(req.id)}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-slate-200 hover:bg-slate-800/80 cursor-pointer"
                >
                  <span>
                    <strong className="font-mono text-red-300">[{formatPadId(req.id)}]</strong> {req.name}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </li>
              ))}
            </ul>
          ) : typeof selectedSubject.aprReq === "string" ? (
            <p className="mt-2 rounded bg-red-500/15 p-2 text-xs font-semibold text-red-300">
              Requisito global: Tener aprobado todo {selectedSubject.aprReq} completo.
            </p>
          ) : (
            <p className="mt-1.5 text-xs italic text-slate-400">Sin requisitos previos para rendir</p>
          )}
        </div>

        {/* Desbloquea a futuro */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
          <h4 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5" /> Habilita a Futuro
            </span>
            <span>({unlockedList.length})</span>
          </h4>
          {unlockedList.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {unlockedList.map((u) => (
                <li
                  key={u.id}
                  onClick={() => onSelectSubject(u.id)}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-slate-200 hover:bg-slate-800/80 cursor-pointer"
                >
                  <span>
                    <strong className="font-mono text-emerald-300">[{formatPadId(u.id)}]</strong> {u.name}{" "}
                    <span className="text-[11px] text-slate-400">({u.year}° Año)</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-xs italic text-slate-400">No es correlativa previa de materias posteriores</p>
          )}
        </div>
      </div>
    </aside>
  );
}