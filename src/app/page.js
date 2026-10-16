"use client";

import { useState, useEffect } from "react";
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  BarChart3,
  X,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { subjectsData, PLAN_METADATA } from "@/data/subjects";
import {
  formatPadId,
  getSubjectById,
  getSubjectRelation,
  evaluateStudentAvailability,
  getCfBadgeStyle,
  getUnlockedCount,
} from "@/utils/correlativas";
import Header from "@/components/Header";
import SubjectInspector from "@/components/SubjectInspector";

const STORAGE_KEY = "ies9_ciencia_datos_progress_v2";
const THEME_KEY = "ies9_ciencia_datos_theme";

export default function HomePage() {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [viewMode, setViewMode] = useState("board"); // "board" | "table" | "analytics"
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [cfFilter, setCfFilter] = useState("all");
  const [simulatorMode, setSimulatorMode] = useState(false);
  const [studentProgress, setStudentProgress] = useState({});
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        setStudentProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Error leyendo progreso local", e);
      }
    }
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  const isLight = theme === "light";

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

  // Materia activa para resaltar (prioriza la fijada con clic, o muestra preview al pasar el mouse)
  const activeSubjectId = selectedId ?? hoveredId;
  const activeSubject = getSubjectById(activeSubjectId);

  const toggleSelectSubject = (id, force = false) => {
    if (!force && selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(Number(id));
    }
  };

  const filteredSubjects = subjectsData.filter((s) => {
    const matchYear = yearFilter === "all" || s.year === Number(yearFilter);
    const matchCf = cfFilter === "all" || s.cf === cfFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q || s.name.toLowerCase().includes(q) || formatPadId(s.id).includes(q);
    return matchYear && matchCf && matchSearch;
  });

  // Clases con bordes neón / glow como en la primera versión pero potenciadas
  const getRelationStyles = (rel) => {
    if (rel.type === "selected") {
      return isLight
        ? "border-l-4 border-l-blue-600 border-blue-400 bg-blue-50/90 shadow-md ring-2 ring-blue-500/30"
        : "border-l-4 border-l-blue-500 border-blue-500/60 bg-blue-500/15 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/50";
    }
    if (rel.reqApr) {
      return isLight
        ? "border-l-4 border-l-red-600 border-red-300 bg-red-50/80"
        : "border-l-4 border-l-red-500 border-red-500/50 bg-red-500/15 shadow-md shadow-red-500/5";
    }
    if (rel.reqReg) {
      return isLight
        ? "border-l-4 border-l-amber-500 border-amber-300 bg-amber-50/80"
        : "border-l-4 border-l-amber-500 border-amber-500/50 bg-amber-500/15 shadow-md shadow-amber-500/5";
    }
    if (rel.unlocks) {
      return isLight
        ? "border-l-4 border-l-emerald-600 border-emerald-300 bg-emerald-50/80"
        : "border-l-4 border-l-emerald-500 border-emerald-500/50 bg-emerald-500/15 shadow-md shadow-emerald-500/5";
    }
    return isLight
      ? "border-l-4 border-l-transparent border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      : "border-l-4 border-l-transparent border-slate-800/90 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/70";
  };

  // Datos para la Vista 3: Analítica y Ruta Crítica
  const camposFormativos = [
    "Específica",
    "Fundamento",
    "Práctica Profesionalizante",
    "General",
  ].map((cf) => {
    const items = subjectsData.filter((s) => s.cf === cf);
    const totalHs = items.reduce((acc, s) => acc + s.hs, 0);
    const pct = Math.round((totalHs / PLAN_METADATA.totalHoursCatedra) * 100);
    return { cf, count: items.length, totalHs, pct };
  });

  const topKeystoneSubjects = [...subjectsData]
    .map((s) => ({ ...s, unlocksCount: getUnlockedCount(s) }))
    .sort((a, b) => b.unlocksCount - a.unlocksCount)
    .slice(0, 6);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isLight ? "bg-slate-100 text-slate-900" : "bg-[#070b14] text-slate-100"
      }`}
    >
      <Header
        resetProgress={handleResetProgress}
        setSimulatorMode={setSimulatorMode}
        simulatorMode={simulatorMode}
        studentProgress={studentProgress}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Barra Sticky de Referencias y Selector de las 3 Vistas */}
      <div
        className={`sticky top-0 z-30 border-b backdrop-blur-md px-4 py-3 sm:px-8 transition-colors ${
          isLight
            ? "border-slate-200 bg-white/90 shadow-sm"
            : "border-slate-800/80 bg-[#0b1120]/90 shadow-lg"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-blue-500 shadow-sm shadow-blue-500/50" />
              Seleccionada
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-amber-500 shadow-sm shadow-amber-500/50" />
              📌 Req. Regular
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-red-500 shadow-sm shadow-red-500/50" />
              🔒 Req. Aprobada
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              🚀 Habilita a futuro
            </span>
          </div>

          {/* Conmutador de 3 Vistas */}
          <div
            className={`flex items-center gap-1 rounded-xl border p-1 ${
              isLight ? "border-slate-200 bg-slate-100" : "border-slate-800 bg-slate-950"
            }`}
          >
            <button
              onClick={() => setViewMode("board")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                viewMode === "board"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow"
                  : "text-slate-400 hover:text-cyan-400"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5"/>
              Mapa Pro
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow"
                  : "text-slate-400 hover:text-cyan-400"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5"/>
              Tabla Ejecutiva
            </button>
            <button
              onClick={() => setViewMode("analytics")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                viewMode === "analytics"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow"
                  : "text-slate-400 hover:text-cyan-400"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5"/>
              Ruta Crítica & KPIs
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[1fr_350px]">
        <section className="space-y-5">
          {/* Barra de Búsqueda y Filtros Combinados */}
          <div
            className={`rounded-2xl border p-4 space-y-3.5 transition-colors ${
              isLight
                ? "border-slate-200 bg-white shadow-sm"
                : "border-slate-800/90 bg-slate-900/70 backdrop-blur"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar materia por nombre o código (ej: 03, Machine Learning)..."
                  className={`w-full rounded-xl border pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium focus:border-cyan-500 focus:outline-none ${
                    isLight
                      ? "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400"
                      : "border-slate-700/80 bg-slate-950/90 text-white placeholder-slate-500"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 cursor-pointer"
                  >
                    <X className="h-4 w-4"/>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "Todos los Años" },
                  { id: "1", label: "1° Año" },
                  { id: "2", label: "2° Año" },
                  { id: "3", label: "3° Año" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setYearFilter(tab.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                      yearFilter === tab.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : isLight
                        ? "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        : "border border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/40">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 mr-1">Campo:</span>
                {["all", "Fundamento", "Específica", "Práctica Profesionalizante", "General"].map(
                  (cf) => (
                    <button
                      key={cf}
                      onClick={() => setCfFilter(cf)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                        cfFilter === cf
                          ? "bg-cyan-600 text-white"
                          : isLight
                          ? "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                          : "border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200"
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
                  className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  ✕ Limpiar materia fijada
                </button>
              )}
            </div>
          </div>

          {/* ==========================================
              VISTA 1: MAPA CURRICULAR PRO (KANBAN RICA)
             ========================================== */}
          {viewMode === "board" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[1, 2, 3].map((year) => {
                if (yearFilter !== "all" && Number(yearFilter) !== year) return null;
                const yearItems = filteredSubjects.filter((s) => s.year === year);
                const yearHs = yearItems.reduce((acc, s) => acc + s.hs, 0);

                return (
                  <div
                    key={year}
                    className={`flex flex-col rounded-2xl border p-3.5 ${
                      isLight
                        ? "border-slate-200 bg-slate-50/80"
                        : "border-slate-800/80 bg-slate-900/30"
                    }`}
                  >
                    <div className="mb-3.5 flex items-center justify-between border-b border-slate-800/60 pb-2.5 px-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 font-mono text-xs font-extrabold text-cyan-400">
                          {year}°
                        </span>
                        <h2 className="text-sm font-extrabold tracking-wide uppercase">
                          {year}° Año de Cursada
                        </h2>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        {yearItems.length} mat. • {yearHs} hs
                      </span>
                    </div>

                    <div className="space-y-3">
                      {yearItems.map((s) => {
                        const rel = getSubjectRelation(activeSubject, s);
                        const currentStatus = studentProgress[s.id] || "pendiente";
                        const avail = evaluateStudentAvailability(s, studentProgress);
                        const unlocksCount = getUnlockedCount(s);

                        return (
                          <div
                            key={s.id}
                            onMouseEnter={() => setHoveredId(s.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => toggleSelectSubject(s.id)}
                            className={`group relative rounded-xl border p-3.5 transition-all duration-150 cursor-pointer ${getRelationStyles(
                              rel
                            )}`}
                          >
                            {/* Top Row: ID + Impacto + Campo */}
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-xs font-extrabold text-cyan-400">
                                  #{formatPadId(s.id)}
                                </span>
                                {unlocksCount > 0 && (
                                  <span
                                    title={`Esta materia habilita ${unlocksCount} materias posteriores`}
                                    className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                      unlocksCount >= 4
                                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                        : "bg-slate-800/60 text-slate-400"
                                    }`}
                                  >
                                    {unlocksCount >= 4 && <Flame className="h-3 w-3"/>}
                                    Destraba {unlocksCount}
                                  </span>
                                )}
                              </div>

                              <span
                                className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${getCfBadgeStyle(
                                  s.cf,
                                  isLight
                                )}`}
                              >
                                {s.cf === "Práctica Profesionalizante" ? "Práctica Prof." : s.cf}
                              </span>
                            </div>

                            {/* Nombre de la Materia */}
                            <h3 className="mt-2 text-sm font-extrabold leading-snug group-hover:text-cyan-400 transition-colors">
                              {s.name}
                            </h3>

                            {/* Píldoras de Correlativas Visibles de un Vistazo */}
                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="font-semibold text-slate-400">📌 Reg:</span>
                                {Array.isArray(s.regReq) && s.regReq.length > 0 ? (
                                  s.regReq.map((reqId) => (
                                    <button
                                      key={reqId}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelectSubject(reqId, true);
                                      }}
                                      title={`Requisito Regular: ${getSubjectById(reqId)?.name}`}
                                      className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
                                    >
                                      {formatPadId(reqId)}
                                    </button>
                                  ))
                                ) : (
                                  <span className="text-slate-500 italic">Libre</span>
                                )}
                              </div>

                              <span className="text-slate-700">•</span>

                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="font-semibold text-slate-400">🔒 Apr:</span>
                                {Array.isArray(s.aprReq) && s.aprReq.length > 0 ? (
                                  s.aprReq.map((reqId) => (
                                    <button
                                      key={reqId}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelectSubject(reqId, true);
                                      }}
                                      title={`Requisito Aprobada: ${getSubjectById(reqId)?.name}`}
                                      className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
                                    >
                                      {formatPadId(reqId)}
                                    </button>
                                  ))
                                ) : typeof s.aprReq === "string" ? (
                                  <span className="rounded bg-red-500/20 px-1.5 py-0.2 font-bold text-[10px] text-red-400">
                                    {s.aprReq}
                                  </span>
                                ) : (
                                  <span className="text-slate-500 italic">Libre</span>
                                )}
                              </div>
                            </div>

                            {/* Badges de Relación Activa */}
                            {(rel.reqApr || rel.reqReg || rel.unlocks || rel.type === "selected") && (
                              <div className="mt-2.5 flex flex-wrap gap-1">
                                {rel.type === "selected" && (
                                  <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                                    Materia Activa
                                  </span>
                                )}
                                {rel.reqApr && (
                                  <span className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                                    🔒 Pide Aprobada
                                  </span>
                                )}
                                {rel.reqReg && (
                                  <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-950">
                                    📌 Pide Regular
                                  </span>
                                )}
                                {rel.unlocks && (
                                  <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-950">
                                    🚀 Se Destraba
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Footer de Tarjeta: Horas + Botones de Estado Rápido */}
                            <div className="mt-3 flex items-center justify-between border-t border-slate-800/50 pt-2.5 text-[11px]">
                              <span className="font-mono font-semibold text-slate-400">
                                {s.hs} hs • {s.accred === "Promocional" ? "Promocional" : "Prom./Final"}
                              </span>

                              {/* Píldoras de Estado Académico en 1 Clic */}
                              <div
                                className="flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {[
                                  { id: "pendiente", label: "P", title: "Marcar Pendiente", cls: "bg-slate-800 text-slate-400" },
                                  { id: "regular", label: "R", title: "Marcar Regular", cls: "bg-amber-500 text-slate-950 font-extrabold" },
                                  { id: "aprobada", label: "A", title: "Marcar Aprobada", cls: "bg-emerald-500 text-slate-950 font-extrabold" },
                                ].map((btn) => (
                                  <button
                                    key={btn.id}
                                    title={btn.title}
                                    onClick={() => handleStatusChange(s.id, btn.id)}
                                    className={`h-5 w-5 rounded text-[10px] font-mono transition cursor-pointer ${
                                      currentStatus === btn.id
                                        ? btn.cls
                                        : "border border-slate-700/60 text-slate-500 hover:border-slate-500"
                                    }`}
                                  >
                                    {btn.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {simulatorMode && currentStatus === "pendiente" && (
                              <div className="mt-2 text-[10px] font-bold">
                                {avail.canPass ? (
                                  <span className="text-emerald-400">✓ Habilitada para Cursar y Rendir</span>
                                ) : avail.canTake ? (
                                  <span className="text-amber-400">✓ Habilitada para Cursar</span>
                                ) : (
                                  <span className="text-slate-500">🔒 Requiere correlativas previas</span>
                                )}
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
          )}

          {/* ==========================================
              VISTA 2: TABLA EJECUTIVA INTERACTIVA
             ========================================== */}
          {viewMode === "table" && (
            <div
              className={`overflow-x-auto rounded-2xl border shadow-2xl ${
                isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900/90"
              }`}
            >
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead
                  className={`border-b text-[11px] uppercase tracking-wider ${
                    isLight
                      ? "border-slate-200 bg-slate-100 text-slate-600"
                      : "border-slate-800 bg-slate-950 text-slate-400"
                  }`}
                >
                  <tr>
                    <th className="py-3.5 px-3">N°</th>
                    <th className="py-3.5 px-3">Espacio Curricular</th>
                    <th className="py-3.5 px-3">Campo Formativo</th>
                    <th className="py-3.5 px-3">Hs. Cát.</th>
                    <th className="py-3.5 px-3">📌 Reg. para Cursar</th>
                    <th className="py-3.5 px-3">🔒 Aprob. para Rendir</th>
                    <th className="py-3.5 px-3">Mi Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((year) => {
                    if (yearFilter !== "all" && Number(yearFilter) !== year) return null;
                    const yearSubjects = filteredSubjects.filter((s) => s.year === year);
                    if (yearSubjects.length === 0) return null;
                    const totalYearHs = yearSubjects.reduce((acc, s) => acc + s.hs, 0);

                    return (
                      <React.Fragment key="{year}">
                        <tr
                          className={
                            isLight
                              ? "bg-slate-200/70 text-cyan-800"
                              : "bg-slate-950/90 text-cyan-400"
                          }
                        >
                          <td colSpan={7} className="py-2.5 px-4 font-extrabold text-xs tracking-wider uppercase">
                            <div className="flex items-center justify-between">
                              <span>{year}° AÑO DE CURSADA</span>
                              <span className="font-mono text-[11px] text-slate-400">
                                {yearSubjects.length} materias • {totalYearHs} hs cátedra
                              </span>
                            </div>
                          </td>
                        </tr>
                        {yearSubjects.map((s) => {
                          const rel = getSubjectRelation(activeSubject, s);
                          const currentStatus = studentProgress[s.id] || "pendiente";
                          const unlocksCount = getUnlockedCount(s);

                          return (
                            <tr
                              key={s.id}
                              onMouseEnter={() => setHoveredId(s.id)}
                              onMouseLeave={() => setHoveredId(null)}
                              onClick={() => toggleSelectSubject(s.id)}
                              className={`border-b border-slate-800/40 transition cursor-pointer ${getRelationStyles(
                                rel
                              )}`}
                            >
                              <td className="py-3.5 px-3 font-mono font-extrabold text-cyan-500">
                                {formatPadId(s.id)}
                              </td>
                              <td className="py-3.5 px-3 font-bold">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span>{s.name}</span>
                                  {unlocksCount >= 4 && (
                                    <span
                                      title={`Materia Troncal: destraba ${unlocksCount} materias`}
                                      className="inline-flex items-center gap-0.5 rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-400"
                                    >
                                      <Flame className="h-3 w-3"/> Llave ({unlocksCount})
                                    </span>
                                  )}
                                  {rel.reqApr && (
                                    <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-white">
                                      🔒 Req. Aprobada
                                    </span>
                                  )}
                                  {rel.reqReg && (
                                    <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-slate-950">
                                      📌 Req. Regular
                                    </span>
                                  )}
                                  {rel.unlocks && (
                                    <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-slate-950">
                                      🚀 Habilita
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-3">
                                <span
                                  className={`rounded border px-2 py-0.5 text-[10px] font-bold ${getCfBadgeStyle(
                                    s.cf,
                                    isLight
                                  )}`}
                                >
                                  {s.cf}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 font-mono text-xs font-semibold">
                                {s.hs} hs
                              </td>
                              <td className="py-3.5 px-3">
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
                                        className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 cursor-pointer"
                                      >
                                        {formatPadId(id)}
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-500">—</span>
                                )}
                              </td>
                              <td className="py-3.5 px-3">
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
                                        className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-red-400 hover:bg-red-500 hover:text-white cursor-pointer"
                                      >
                                        {formatPadId(id)}
                                      </button>
                                    ))}
                                  </div>
                                ) : typeof s.aprReq === "string" ? (
                                  <span className="rounded bg-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-400">
                                    {s.aprReq}
                                  </span>
                                ) : (
                                  <span className="text-slate-500">—</span>
                                )}
                              </td>
                              <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={currentStatus}
                                  onChange={(e) => handleStatusChange(s.id, e.target.value)}
                                  className={`rounded-lg border px-2 py-1 text-xs font-bold cursor-pointer ${
                                    currentStatus === "aprobada"
                                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                                      : currentStatus === "regular"
                                      ? "border-amber-500 bg-amber-500/20 text-amber-400"
                                      : isLight
                                      ? "border-slate-300 bg-slate-50 text-slate-700"
                                      : "border-slate-700 bg-slate-950 text-slate-300"
                                  }`}
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="regular">Regular</option>
                                  <option value="aprobada">Aprobada</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ==========================================
              VISTA 3: ANALÍTICA Y RUTA CRÍTICA
             ========================================== */}
          {viewMode === "analytics" && (
            <div className="space-y-6">
              {/* Top 6 Materias Llave / Cuellos de Botella */}
              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900/80"
                }`}
              >
                <div className="flex items-center gap-2 text-orange-400 font-extrabold text-sm uppercase tracking-wider">
                  <Flame className="h-5 w-5"/>
                  Ranking de Materias Llave (Ruta Crítica del Plan)
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Priorizá estas asignaturas: son las que más espacios curriculares postergan si no se regularizan o aprueban a tiempo.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {topKeystoneSubjects.map((s, idx) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        toggleSelectSubject(s.id, true);
                      }}
                      className={`rounded-xl border p-3.5 transition cursor-pointer ${
                        isLight
                          ? "border-slate-200 bg-slate-50 hover:border-orange-400"
                          : "border-slate-800 bg-slate-950/80 hover:border-orange-500/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-orange-400">
                          TOP #{idx + 1} • Mat. {formatPadId(s.id)}
                        </span>
                        <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[11px] font-extrabold text-orange-400">
                          Destraba {s.unlocksCount} mat.
                        </span>
                      </div>
                      <h4 className="mt-2 font-extrabold text-sm">{s.name}</h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {s.year}° Año • {s.hs} hs cátedra
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribución Horaria por Campo Formativo */}
              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900/80"
                }`}
              >
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400">
                  Distribución de Carga Horaria por Campo Formativo (2912 Hs. Cátedra)
                </h3>
                <div className="mt-4 space-y-4">
                  {camposFormativos.map((item) => (
                    <div key={item.cf} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>
                          {item.cf} ({item.count} materias)
                        </span>
                        <span className="font-mono text-cyan-400">
                          {item.totalHs} hs ({item.pct}%)
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Inspe         ctor Lateral Interactivo */}
        <SubjectInspector
           selectedSubject={activeSubject}
           onSelectSubject={(id) => toggleSelectSubject(id, true)}
           onClose={() => setSelectedId(null)}
           studentProgress={studentProgress}
           onStatusChange={handleStatusChange}
           theme={theme}
          />          
      </main>
    </div>
  );
}