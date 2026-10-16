export const PLAN_METADATA = {
  resolution: "Resolución N° 3098-E • Jujuy",
  career: "Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial",
  subtitle: "Plan de Estudios y Régimen de Correlatividades Interactivo",
  institution: 'I.E.S. N° 9 "Juana Azurduy" — San Pedro de Jujuy',
  totalHoursCatedra: 2912,
  totalHoursReloj: 1941,
};

export const subjectsData = [
  // 1° AÑO
  { id: 1, year: 1, name: "Álgebra", cf: "Fundamento", reg: "Anual", hs: 96, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },
  { id: 2, year: 1, name: "Análisis Matemático", cf: "Fundamento", reg: "Anual", hs: 128, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },
  { id: 3, year: 1, name: "Programación I", cf: "Fundamento", reg: "Anual", hs: 128, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },
  { id: 4, year: 1, name: "Ciencia y TIC", cf: "General", reg: "Anual", hs: 96, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },
  { id: 5, year: 1, name: "Base de Datos", cf: "Fundamento", reg: "Anual", hs: 128, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },
  { id: 6, year: 1, name: "Redes", cf: "Específica", reg: "Anual", hs: 128, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },
  { id: 7, year: 1, name: "Prácticas Profesionalizantes I", cf: "Práctica Profesionalizante", reg: "Anual", hs: 128, regReq: [], aprReq: [], accred: "Promocional" },
  { id: 8, year: 1, name: "EDI I", cf: "Específica", reg: "Anual", hs: 96, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },

  // 2° AÑO
  { id: 9, year: 2, name: "Inglés Técnico", cf: "Fundamento", reg: "Anual", hs: 96, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },
  { id: 10, year: 2, name: "Ciencia de Datos", cf: "Específica", reg: "Anual", hs: 128, regReq: [4, 5, 6], aprReq: [4, 5, 6], accred: "Promocional/Examen Final" },
  { id: 11, year: 2, name: "Estadística y Probabilidad", cf: "Fundamento", reg: "Anual", hs: 96, regReq: [1, 2], aprReq: [1, 2], accred: "Promocional/Examen Final" },
  { id: 12, year: 2, name: "Programación II", cf: "Fundamento", reg: "Anual", hs: 128, regReq: [3, 5], aprReq: [3, 5], accred: "Promocional/Examen Final" },
  { id: 13, year: 2, name: "Lógica", cf: "Fundamento", reg: "Anual", hs: 96, regReq: [1, 2, 3, 4, 5], aprReq: [1, 3, 5], accred: "Promocional/Examen Final" },
  { id: 14, year: 2, name: "Introducción a la Inteligencia Artificial", cf: "Específica", reg: "Anual", hs: 128, regReq: [3, 4, 5], aprReq: [3, 4, 5], accred: "Promocional/Examen Final" },
  { id: 15, year: 2, name: "Machine Learning", cf: "Específica", reg: "Anual", hs: 96, regReq: [3, 4, 5, 6], aprReq: [4, 5, 6], accred: "Promocional/Examen Final" },
  { id: 16, year: 2, name: "Prácticas Profesionalizantes II", cf: "Práctica Profesionalizante", reg: "Anual", hs: 128, regReq: [3, 4, 5, 7], aprReq: "1er. Año", accred: "Promocional" },
  { id: 17, year: 2, name: "EDI II", cf: "Específica", reg: "Anual", hs: 96, regReq: [], aprReq: [], accred: "Promocional/Examen Final" },

  // 3° AÑO
  { id: 18, year: 3, name: "Gestión de Proyectos", cf: "Fundamento", reg: "Anual", hs: 96, regReq: [12, 15], aprReq: [15], accred: "Promocional/Examen Final" },
  { id: 19, year: 3, name: "Minería de Datos", cf: "Específica", reg: "Anual", hs: 128, regReq: [10, 13], aprReq: [10], accred: "Promocional/Examen Final" },
  { id: 20, year: 3, name: "Reconocimiento Visual", cf: "Específica", reg: "Anual", hs: 128, regReq: [10, 11, 12, 13], aprReq: [11, 13, 14], accred: "Promocional/Examen Final" },
  { id: 21, year: 3, name: "Ciberseguridad", cf: "Específica", reg: "Anual", hs: 128, regReq: [9, 14, 15], aprReq: [9, 14, 15], accred: "Promocional/Examen Final" },
  { id: 22, year: 3, name: "Ética y Deontología Profesional", cf: "General", reg: "Anual", hs: 96, regReq: [13, 14, 15], aprReq: [14, 15], accred: "Promocional/Examen Final" },
  { id: 23, year: 3, name: "Analítica Web", cf: "Específica", reg: "Anual", hs: 128, regReq: [10, 12, 13, 14], aprReq: [10, 12, 13], accred: "Promocional/Examen Final" },
  { id: 24, year: 3, name: "Procesamiento del Lenguaje Natural", cf: "Específica", reg: "Anual", hs: 128, regReq: [11, 12, 13, 14, 15], aprReq: [11, 13, 14, 15], accred: "Promocional/Examen Final" },
  { id: 25, year: 3, name: "Prácticas Profesionalizantes III", cf: "Práctica Profesionalizante", reg: "Anual", hs: 160, regReq: [16], aprReq: "2do. Año", accred: "Promocional" }
];