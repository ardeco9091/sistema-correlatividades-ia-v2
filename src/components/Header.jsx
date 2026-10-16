"use client";

import { useState } from "react";
import {
  GraduationCap,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Unlock,
  Sun,
  Moon,
  Share2,
  Printer,
  Copy,
  Check,
} from "lucide-react";
import { PLAN_METADATA, subjectsData } from "@/data/subjects";
import { evaluateStudentAvailability, formatPadId } from "@/utils/correlativas";

export default function Header({
  simulatorMode,
  setSimulatorMode,
  studentProgress,
  resetProgress,
  theme,
  toggleTheme,
}) {
  const [copied, setCopied] = useState(false);
  const isLight = theme === "light";

  let aprobadas = 0;
  let regulares = 0;
  let horasAprobadas = 0;
  const materiasHabilitadasCursar = [];
  const materiasHabilitadasRendir = [];

  subjectsData.forEach((s) => {
    const status = studentProgress[s.id] || "pendiente";
    if (status === "aprobada") {
      aprobadas++;
      horasAprobadas += s.hs;
    } else if (status === "regular") {
      regulares++;
      const avail = evaluateStudentAvailability(s, studentProgress);
      if (avail.canPass) {
        materiasHabilitadasRendir.push(`[${formatPadId(s.id)}]${s.name}`);
      }
    } else {
      const avail = evaluateStudentAvailability(s, studentProgress);
      if (avail.canTake) {
        materiasHabilitadasCursar.push(`[${formatPadId(s.id)}] ${s.name} (${s.year}° Año)`);
      }
    }
  });

  const pctAprobadas = Math.round((aprobadas / subjectsData.length) * 100);
  const pctRegulares = Math.round((regulares / subjectsData.length) * 100);

  // Ojapo marandu oñemosarambi hag̃ua
  const buildShareText = () => {
    const lines = [
      `📊 *Mi Avance Académico — ${PLAN_METADATA.career}*`,
      `🏛️ ${PLAN_METADATA.institution} (${PLAN_METADATA.resolution})`,
      ``,
      `✅ *Aprobadas:* ${aprobadas}/${subjectsData.length} (${pctAprobadas}%)`,
      `📌 *Regulares:* ${regulares}`,
      `⏱️ *Horas Cátedra:* ${horasAprobadas} /${PLAN_METADATA.totalHoursCatedra} hs`,
      ``,
      `🚀 *Materias que tengo habilitadas para cursar (${materiasHabilitadasCursar.length}):*`,
      materiasHabilitadasCursar.length > 0
        ? materiasHabilitadasCursar.map((m) => `• ${m}`).join("\n")
        : "• Ninguna pendiente disponible por el momento",
    ];

    if (materiasHabilitadasRendir.length > 0) {
      lines.push(
        ``,
        `🎯 *Regulares listas para rendir examen final (${materiasHabilitadasRendir.length}):*`,
        materiasHabilitadasRendir.map((m) => `• ${m}`).join("\n")
      );
    }

    return lines.join("\n");
  };

  const handleShareWhatsApp = () => {
    const text = buildShareText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <header
      className={`relative overflow-hidden border-b transition-colors duration-300 px-4 py-6 sm:px-8 ${
        isLight
          ? "border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100"
          : "border-slate-800/80 bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14]"
      }`}
    >
      {!isLight && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
              isLight
                ? "border-cyan-600/30 bg-cyan-50 text-cyan-800"
                : "border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-cyan-500/10"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {PLAN_METADATA.resolution}
          </span>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={() => setSimulatorMode(!simulatorMode)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                simulatorMode
                  ? "border-cyan-400 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                  : isLight
                  ? "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 shadow-sm"
                  : "border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-500/60 hover:text-cyan-300"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              {simulatorMode ? "Simulador Mi Cursada: ACTIVO" : "🎓 Simular Mi Cursada"}
            </button>

            <button
              onClick={handlePrintPdf}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isLight
                  ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
                  : "border-slate-700 bg-slate-900/90 text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
              title="Exportar o imprimir resumen en PDF"
            >
              <Printer className="h-4 w-4 text-cyan-400" />
              <span>Exportar PDF</span>
            </button>

            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isLight
                  ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
                  : "border-slate-700 bg-slate-900/90 text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="h-4 w-4 text-indigo-600" />
                  <span>Modo Oscuro</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>Modo Claro</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ta'anga ha Réra */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <img
              src="/img/ies9.png"
              alt="Escudo I.E.S. N° 9 Juana Azurduy"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white p-1.5 object-contain shadow-xl ring-2 ring-white/30"
            />
            <img
              src="/img/carrera.jpeg"
              alt="Logo Carrera Ciencia de Datos e IA"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white p-1.5 object-contain shadow-xl ring-2 ring-white/30 md:hidden"
            />
          </div>

          <div className="text-center flex-1 max-w-3xl">
            <h1
              className={`text-2xl font-extrabold tracking-tight sm:text-4xl ${
                isLight
                  ? "bg-gradient-to-r from-blue-800 via-cyan-700 to-emerald-700 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-blue-400 via-cyan-200 to-emerald-300 bg-clip-text text-transparent"
              }`}
            >
              {PLAN_METADATA.career}
            </h1>
            <p className={`mt-1.5 text-sm sm:text-base font-medium ${isLight ? "text-slate-600" : "text-slate-300/90"}`}>
              {PLAN_METADATA.subtitle}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-500">
              {PLAN_METADATA.institution}
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <img
              src="/img/carrera.jpeg"
              alt="Logo Carrera Ciencia de Datos e IA"
              className="h-24 w-24 rounded-full bg-white p-1.5 object-contain shadow-xl ring-2 ring-white/30"
            />
          </div>
        </div>

        {/* Panel de Progreso + Votón Ñemosarambi */}
        {(simulatorMode || aprobadas > 0 || regulares > 0) && (
          <div
            className={`mt-6 rounded-2xl border p-4 sm:p-5 transition-all ${
              isLight
                ? "border-slate-200 bg-white shadow-md"
                : "border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md"
            }`}
          >
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-500">
                <GraduationCap className="h-4 w-4" />
                Tablero de Progreso Académico ({pctAprobadas}% completado)
              </div>

              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Compartir por WhatsApp
                </button>

                <button
                  onClick={handleCopySummary}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isLight
                      ? "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "border-slate-700 bg-slate-800 text-slate-200 hover:border-cyan-500/50"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Copiar Resumen</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetProgress}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isLight
                      ? "border-slate-200 bg-slate-50 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      : "border-slate-700 bg-slate-800 text-slate-300 hover:border-red-500/50 hover:text-red-300"
                  }`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reiniciar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className={`rounded-xl border p-3.5 ${isLight ? "border-emerald-200 bg-emerald-50/50" : "border-emerald-500/20 bg-emerald-500/5"}`}>
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-500">
                  <span>Materias Aprobadas</span>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className={`mt-1 text-2xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
                  {aprobadas} <span className="text-xs font-medium text-slate-400">/ 25 ({pctAprobadas}%)</span>
                </p>
              </div>

              <div className={`rounded-xl border p-3.5 ${isLight ? "border-amber-200 bg-amber-50/50" : "border-amber-500/20 bg-amber-500/5"}`}>
                <div className="flex items-center justify-between text-xs font-semibold text-amber-500">
                  <span>Materias Regulares</span>
                  <BookOpen className="h-4 w-4" />
                </div>
                <p className={`mt-1 text-2xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
                  {regulares} <span className="text-xs font-medium text-slate-400">pend. de final</span>
                </p>
              </div>

              <div className={`rounded-xl border p-3.5 ${isLight ? "border-cyan-200 bg-cyan-50/50" : "border-cyan-500/20 bg-cyan-500/5"}`}>
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-500">
                  <span>Carga Horaria Aprobada</span>
                  <Clock className="h-4 w-4" />
                </div>
                <p className={`mt-1 text-2xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
                  {horasAprobadas} <span className="text-xs font-medium text-slate-400">/ {PLAN_METADATA.totalHoursCatedra} hs</span>
                </p>
              </div>

              <div className={`rounded-xl border p-3.5 ${isLight ? "border-blue-200 bg-blue-50/50" : "border-blue-500/20 bg-blue-500/5"}`}>
                <div className="flex items-center justify-between text-xs font-semibold text-blue-500">
                  <span>Habilitadas p/ Cursar</span>
                  <Unlock className="h-4 w-4" />
                </div>
                <p className={`mt-1 text-2xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
                  {materiasHabilitadasCursar.length} <span className="text-xs font-medium text-slate-400">disponibles hoy</span>
                </p>
              </div>
            </div>

            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800/40 p-0.5 flex gap-0.5">
              <div
                className="h-full rounded-l-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${pctAprobadas}%` }}
              />
              <div
                className="h-full rounded-r-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${pctRegulares}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}