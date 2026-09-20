/** @type {import('tailwindcss').Config} */

/*
 * Sistema de diseño - Plataforma de Videos UNAD
 *
 * Toda la paleta vive en variables CSS (ver src/index.css) y aqui solo se
 * exponen nombres semanticos. Eso permite dos cosas:
 *   1. Cambiar de tema claro/oscuro sin duplicar clases `dark:` en cada
 *      componente: el mismo `bg-surface text-fg` sirve para los dos temas.
 *   2. Que la paleta sea una sola fuente de verdad auditable.
 *
 * Paleta: azul institucional + neutros frios + semanticos estandar.
 * Sin degradados, neon ni colores decorativos.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Superficies */
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        elevated: "rgb(var(--c-elevated) / <alpha-value>)",
        subtle: "rgb(var(--c-subtle) / <alpha-value>)",

        /* Bordes */
        line: "rgb(var(--c-line) / <alpha-value>)",
        "line-strong": "rgb(var(--c-line-strong) / <alpha-value>)",

        /* Texto */
        fg: "rgb(var(--c-fg) / <alpha-value>)",
        "fg-muted": "rgb(var(--c-fg-muted) / <alpha-value>)",
        "fg-subtle": "rgb(var(--c-fg-subtle) / <alpha-value>)",

        /* Velo de los modales: no sigue a `fg` porque en modo oscuro `fg` es
           claro y el fondo del modal quedaria blanco. */
        scrim: "rgb(var(--c-scrim) / <alpha-value>)",

        /* Marca: `brand` es relleno de boton (siempre con `brand-fg` encima);
           `brand-ink` es el color de texto, iconos y enlaces. */
        brand: {
          DEFAULT: "rgb(var(--c-brand) / <alpha-value>)",
          hover: "rgb(var(--c-brand-hover) / <alpha-value>)",
          fg: "rgb(var(--c-brand-fg) / <alpha-value>)",
          soft: "rgb(var(--c-brand-soft) / <alpha-value>)",
          ink: "rgb(var(--c-brand-ink) / <alpha-value>)",
        },

        /* Semanticos. `DEFAULT` sirve como color de texto/icono y como relleno;
           `fg` es el color legible encima de ese relleno y cambia por tema
           porque el relleno se aclara en modo oscuro. */
        success: {
          DEFAULT: "rgb(var(--c-success) / <alpha-value>)",
          soft: "rgb(var(--c-success-soft) / <alpha-value>)",
          fg: "rgb(var(--c-success-fg) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--c-warning) / <alpha-value>)",
          soft: "rgb(var(--c-warning-soft) / <alpha-value>)",
          fg: "rgb(var(--c-warning-fg) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--c-danger) / <alpha-value>)",
          soft: "rgb(var(--c-danger-soft) / <alpha-value>)",
          fg: "rgb(var(--c-danger-fg) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Manrope", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(8px) scale(.985)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "grow-bar": {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in .18s ease-out both",
        "fade-in-up": "fade-in-up .26s ease-out both",
        "pop-in": "pop-in .2s cubic-bezier(.22,1,.36,1) both",
        "slide-in-right": "slide-in-right .22s ease-out both",
        shimmer: "shimmer 1.6s infinite",
        "grow-bar": "grow-bar .5s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
};
