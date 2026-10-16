"use client";

import { GraduationCap, RotateCcw, Sparkles, CheckCircle2, Clock, BookOpen, Unlock } from "lucide-react";
import { PLAN_METADATA, subjectsData } from "@/data/subjects";
import { evaluateStudentAvailability } from "@/utils/correlativas";

export default function Header({
  simulatorMode,
  setSimulatorMode,
  studentProgress,
  resetProgress,
}) {
  // Cálculos de KPIs en vivo
  let aprobadas = 0;
  let regulares = 0;
  let horasAprobadas = 0;
  let habilitadasParaCursar = 0;

  subjectsData.forEach((s) => {
    const status = studentProgress[s.id] || "pendiente";
    if (status === "aprobada") {
      aprobadas++;
      horasAprobadas += s.hs;
    } else if (status === "regular") {
      regulares++;
    } else {
      const avail = evaluateStudentAvailability(s, studentProgress);
      if (avail.canTake) habilitadasParaCursar++;
    }
  });

  const pctAprobadas = Math.round((aprobadas / subjectsData.length) * 100);
  const pctRegulares = Math.round((regulares / subjectsData.length) * 100);

  return (
    <header className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 px-4 py-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            {PLAN_METADATA.resolution}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulatorMode(!simulatorMode)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                simulatorMode
                  ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "border-slate-700 bg-slate-800/80 text-slate-200 hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              {simulatorMode ? "Simulador Activo: Mi Cursada" : "Activar Simulador Mi Cursada"}
            </button>
          </div>
        </div>

        {/* Logos + Títulos Centrales */}
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-4">
            <img
              src="/img/ies9.png"
              alt="Escudo I.E.S. N° 9 Juana Azurduy"
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white p-1 object-contain shadow-xl ring-2 ring-white/20"
            />
            <img
              src="/img/carrera.jpeg"
              alt="Logo Carrera Ciencia de Datos e IA"
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white p-1 object-contain shadow-xl ring-2 ring-white/20 md:hidden"
            />
          </div>

          <div className="text-center flex-1">
            <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-3xl">
              {PLAN_METADATA.career}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {PLAN_METADATA.subtitle}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-blue-300/90">
              {PLAN_METADATA.institution}
            </p>
          </div>

          <div className="hidden md:flex items-center">
            <img
              src="/img/carrera.jpeg"
              alt="Logo Carrera Ciencia de Datos e IA"
              className="h-20 w-20 rounded-full bg-white p-1 object-contain shadow-xl ring-2 ring-white/20"
            />
          </div>
        </div>

        {/* Dashboard KPIs en Modo Simulador */}
        {simulatorMode && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-inner">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <GraduationCap className="h-4 w-4" />
                Panel de Simulación Académica (Guardado automático en tu navegador)
              </div>
              <button
                onClick={resetProgress}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-red-500/50 hover:text-red-300 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reiniciar Todo
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Aprobadas</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="mt-1 text-lg font-bold text-white">
                  {aprobadas} <span className="text-xs font-normal text-slate-400">/ 25 ({pctAprobadas}%)</span>
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Regulares</span>
                  <BookOpen className="h-4 w-4 text-amber-400" />
                </div>
                <p className="mt-1 text-lg font-bold text-white">
                  {regulares} <span className="text-xs font-normal text-slate-400">en curso/reg.</span>
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Horas Aprobadas</span>
                  <Clock className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="mt-1 text-lg font-bold text-white">
                  {horasAprobadas} <span className="text-xs font-normal text-slate-400">/ {PLAN_METADATA.totalHoursCatedra} hs</span>
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Podés Cursar</span>
                  <Unlock className="h-4 w-4 text-blue-400" />
                </div>
                <p className="mt-1 text-lg font-bold text-white">
                  {habilitadasParaCursar} <span className="text-xs font-normal text-slate-400">materias disp.</span>
                </p>
              </div>
            </div>

            {/* Barra de progreso combinada */}
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800 flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${pctAprobadas}%` }}
                title={`Aprobadas: ${pctAprobadas}%`}
              />
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${pctRegulares}%` }}
                title={`Regulares: ${pctRegulares}%`}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}