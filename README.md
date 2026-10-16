# 🧠 Mapa Interactivo de Correlatividades — Ciencia de Datos e IA

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Resolución](https://img.shields.io/badge/Resoluci%C3%B3n-3098--E%20Jujuy-06b6d4?style=for-the-badge)

Plataforma web interactiva y simulador de avance académico para la **Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial** (**Resolución N° 3098-E** - Provincia de Jujuy), dictada en el **I.E.S. N° 9 "Juana Azurduy"** de San Pedro de Jujuy.

---

## ✨ Características Principales

- 🗺️ **Doble Visualización (Mapa Kanban por Años + Tabla Técnica):** Alterná en un clic entre una vista tipo *roadmap* dividida en columnas de 1°, 2° y 3° Año o una tabla detallada de especificaciones.
- 🔗 **Motor Bidireccional de Correlatividades:** Al seleccionar cualquier espacio curricular, el sistema ilumina simultáneamente:
  - 📌 **Requisitos de Regularidad** para poder cursar.
  - 🔒 **Requisitos de Aprobación** (incluyendo validaciones globales de 1° y 2° año para Prácticas Profesionalizantes).
  - 🚀 **Desbloqueos a Futuro** (qué materias posteriores habilita).
- 🎓 **Simulador "Mi Cursada" con Persistencia Local (`localStorage`):** Permite a cada estudiante registrar sus materias *Regulares* y *Aprobadas*, calculando en tiempo real el porcentaje de carrera completado, horas cátedra acumuladas (sobre 2912 hs) y qué materias tiene habilitadas para cursar en el próximo ciclo lectivo.
- 📱 **Diseño Mobile-First:** Inspector lateral fijo en escritorio y *Bottom Drawer* deslizable en dispositivos móviles.

---

## 🗂️ Arquitectura del Proyecto

```text
├── public/
│   └── img/
│       ├── ies9.png                # Escudo institucional I.E.S. N° 9
│       └── carrera.jpeg            # Identidad visual de la carrera
├── src/
│   ├── data/
│   │   └── subjects.js             # Malla curricular oficial (Res. N° 3098-E)
│   ├── utils/
│   │   └── correlativas.js         # Lógica de grafos de dependencia y simulador
│   ├── components/
│   │   ├── Header.jsx              # Cabecera institucional y Dashboard de KPIs
│   │   └── SubjectInspector.jsx    # Inspector interactivo de dependencias
│   └── app/
│       └── page.js                 # Controlador principal de vistas y filtros