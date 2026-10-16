"use client";

import { useState, useEffect } from "react";
import { Search, LayoutGrid, Table as TableIcon, X } from "lucide-react";
import { subjectsData, PLAN_METADATA } from "@/data/subjects";
import {
  formatPadId,
  getSubjectById,
  getSubjectRelation,
  evaluateStudentAvailability,
  getCfBadgeStyle,
} from "@/utils/correlativas";
import Header from "@/components/Header";
import SubjectInspector from "@/components/SubjectInspector";

const STORAGE_KEY = "ies9_ciencia_datos_progress_v2";

export default function HomePage() {
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("board"); // "board" (Kanban) | "table"
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [cfFilter, setCfFilter] = useState("all");
  const [simulatorMode, setSimulatorMode] = useState(false);
  const [studentProgress, setStudentProgress] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStudentProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Error leyendo localStorage", e);
      }
    }
  }, []);

  const handleStatusChange = (subjectId, newStatus) => {
    const updated = { ...studentProgress, [subjectId]: newStatus };
    setStudentProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleResetProgress = () => {
    if (window.confirm("¿Querés reiniciar todas las materias cargadas en tu simulador?")) {
      setStudentProgress({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const selectedSubject = getSubjectById(selectedId);

  const toggleSelectSubject = (id, force = false) => {
    if (!force && selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(Number(id));
    }
  };

  // Filtrado de materias
  const filteredSubjects = subjectsData.filter((s) => {
    const matchYear = yearFilter === "all" || s.year === Number(yearFilter);
    const matchCf = cfFilter === "all" || s.cf === cfFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q || s.name.toLowerCase().includes(q) || formatPadId(s.id).includes(q);
    return matchYear && matchCf && matchSearch;
  });

  const getRelationCardClasses = (rel) => {
    if (rel.type === "selected")
      return "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/60";
    if (rel.reqApr)
      return "border-red-500 bg-red-500/15 ring-1 ring-red-500/40";
    if (rel.reqReg)
      return "border-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40";
    if (rel.unlocks)
      return "border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/40";
    return "border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-800/70";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header
        simulatorMode={simulatorMode}
        setSimulatorMode={setSimulatorMode}
        studentProgress={studentProgress}
        resetProgress={handleResetProgress}
      />

      {/* Barra Sticky de Leyenda + Selector de Vista */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-4 py-2.5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-blue-500" /> Seleccionada
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-500" /> 📌 Req. Regular
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-red-500" /> 🔒 Req. Aprobada
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-500" /> 🚀 Habilita a futuro
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => setViewMode("board")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                viewMode === "board"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Mapa por Años
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              Tabla Detallada
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          {/* Panel de Buscador y Filtros */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className=" absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar espacio curricular por nombre o número..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "Todos" },
                  { id: "1", label: "1° Año" },
                  { id: "2", label: "2° Año" },
                  { id: "3", label: "3° Año" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setYearFilter(tab.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                      yearFilter === tab.id
                        ? "bg-blue-600 text-white"
                        : "border border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Campo Formativo:</span>
                {["all", "Fundamento", "Específica", "Práctica Profesionalizante", "General"].map(
                  (cf) => (
                    <button
                      key={cf}
                      onClick={() => setCfFilter(cf)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition cursor-pointer ${
                        cfFilter === cf
                          ? "bg-cyan-600 text-white"
                          : "border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {cf === "all" ? "Todos" : cf}
                    </button>
                  )
                )}
              </div>

              {selectedId && (
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
                >
                  Limpiar selección activa
                </button>
              )}
            </div>
          </div>

          {/* VISTA 1: TABLERO ROADMAP KANBAN POR AÑOS */}
          {viewMode === "board" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((year) => {
                if (yearFilter !== "all" && Number(yearFilter) !== year) return null;
                const yearItems = filteredSubjects.filter((s) => s.year === year);
                const yearHs = yearItems.reduce((acc, s) => acc + s.hs, 0);

                return (
                  <div
                    key={year}
                    className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2 px-1">
                      <h2 className="text-sm font-extrabold tracking-wide text-cyan-400">
                        {year}° AÑO
                      </h2>
                      <span className="text-[11px] text-slate-400">
                        {yearItems.length} mat. • {yearHs} hs
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {yearItems.map((s) => {
                        const rel = getSubjectRelation(selectedSubject, s);
                        const currentStatus = studentProgress[s.id] || "pendiente";
                        const avail = evaluateStudentAvailability(s, studentProgress);

                        return (
                          <div
                            key={s.id}
                            onClick={() => toggleSelectSubject(s.id)}
                            className={`group relative rounded-lg border p-3 transition-all cursor-pointer ${getRelationCardClasses(
                              rel
                            )}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-mono text-xs font-bold text-slate-400">
                                #{formatPadId(s.id)}
                              </span>
                              <span
                                className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${getCfBadgeStyle(
                                  s.cf
                                )}`}
                              >
                                {s.cf}
                              </span>
                            </div>

                            <h3 className="mt-1.5 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {s.name}
                            </h3>

                            {/* Etiquetas de relación correlativa */}
                            {(rel.reqApr || rel.reqReg || rel.unlocks || rel.type === "selected") && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {rel.type === "selected" && (
                                  <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                                    Seleccionada
                                  </span>
                                )}
                                {rel.reqApr && (
                                  <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                                    🔒 Req. Aprobada
                                  </span>
                                )}
                                {rel.reqReg && (
                                  <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-950">
                                    📌 Req. Regular
                                  </span>
                                )}
                                {rel.unlocks && (
                                  <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-950">
                                    🚀 Habilita
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                              <span className="font-mono">{s.hs} hs cátedra</span>
                              <span>{s.accred}</span>
                            </div>

                            {/* Controles del Modo Simulador dentro de cada tarjeta */}
                            {simulatorMode && (
                              <div
                                className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {currentStatus === "pendiente" ? (
                                  <span
                                    className={`text-[10px] font-semibold ${
                                      avail.canPass
                                        ? "text-emerald-400"
                                        : avail.canTake
                                        ? "text-amber-400"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {avail.canPass
                                      ? "✓ Habilitada Cursar/Rendir"
                                      : avail.canTake
                                      ? "✓ Habilitada Cursar"
                                      : "🔒 Faltan correlativas"}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold text-cyan-300">
                                    Estado cargado:
                                  </span>
                                )}

                                <select
                                  value={currentStatus}
                                  onChange={(e) => handleStatusChange(s.id, e.target.value)}
                                  className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] font-semibold text-white"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="regular">Regular</option>
                                  <option value="aprobada">Aprobada</option>
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VISTA 2: TABLA TÉCNICA DETALLADA */
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-3">N°</th>
                    <th className="py-3 px-3">Espacio Curricular</th>
                    <th className="py-3 px-3">Campo</th>
                    <th className="py-3 px-3">Hs.</th>
                    <th className="py-3 px-3">Reg. p/ Cursar</th>
                    <th className="py-3 px-3">Aprob. p/ Rendir</th>
                    {simulatorMode && <th className="py-3 px-3">Mi Estado</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSubjects.map((s) => {
                    const rel = getSubjectRelation(selectedSubject, s);
                    const currentStatus = studentProgress[s.id] || "pendiente";

                    return (
                      <tr
                        key={s.id}
                        onClick={() => toggleSelectSubject(s.id)}
                        className={`transition cursor-pointer ${getRelationCardClasses(rel)}`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-400">
                          {formatPadId(s.id)}
                        </td>
                        <td className="py-3 px-3 font-semibold text-white">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span>{s.name}</span>
                            <span className="text-[11px] font-normal text-slate-400">
                              ({s.year}° Año)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${getCfBadgeStyle(
                              s.cf
                            )}`}
                          >
                            {s.cf}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs">{s.hs} hs</td>
                        <td className="py-3 px-3">
                          {Array.isArray(s.regReq) && s.regReq.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {s.regReq.map((id) => (
                                <button
                                  key={id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelectSubject(id, true);
                                  }}
                                  title={getSubjectById(id)?.name}
                                  className="rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 font-mono text-[11px] text-amber-300 hover:border-amber-400"
                                >
                                  {formatPadId(id)}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {Array.isArray(s.aprReq) && s.aprReq.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {s.aprReq.map((id) => (
                                <button
                                  key={id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelectSubject(id, true);
                                  }}
                                  title={getSubjectById(id)?.name}
                                  className="rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 font-mono text-[11px] text-red-300 hover:border-red-400"
                                >
                                  {formatPadId(id)}
                                </button>
                              ))}
                            </div>
                          ) : typeof s.aprReq === "string" ? (
                            <span className="rounded bg-red-500/20 px-2 py-0.5 text-[11px] font-semibold text-red-300">
                              {s.aprReq}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        {simulatorMode && (
                          <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(s.id, e.target.value)}
                              className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-semibold text-white"
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="regular">Regular</option>
                              <option value="aprobada">Aprobada</option>
                            </select>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Inspector Lateral / Drawer Móvil */}
        <SubjectInspector
          selectedSubject={selectedSubject}
          onSelectSubject={(id) => toggleSelectSubject(id, true)}
          onClose={() => setSelectedId(null)}
        />
      </main>
    </div>
  );
}