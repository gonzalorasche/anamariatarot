// Precios y servicios, todos en pesos argentinos.
// Numerología salió del catálogo: ese servicio ya no se ofrece.
// La detección de país por IP se quitó: antes mostraba USD y EUR según el
// visitante. Si alguna vez hace falta, está en el historial de git.

export const VIGENCIA = "Octubre 2026";

export type Fila = { t: string; p: string };

export type Servicio = {
  id: string;
  titulo: string;
  desc: string;
  precios: Fila[];
  nota?: string;
  /** Línea de contexto que se muestra arriba del precio. */
  meta?: string;
  /** La tarjeta se destaca en oscuro: cierra la fila en vez de quedar coja. */
  destacada?: boolean;
};

export const SERVICIOS: Servicio[] = [
  {
    id: "individual",
    titulo: "Lectura individual",
    desc: "Un encuentro profundo para explorar tu presente y las energías que te rodean.",
    precios: [
      { t: "30 min", p: "$ 27.000" },
      { t: "40 min", p: "$ 33.000" },
      { t: "60 min", p: "$ 43.000" },
    ],
  },
  {
    id: "grupal",
    titulo: "Dos personas",
    desc: "Sesión compartida para profundizar en vínculos y energías conjuntas.",
    precios: [
      { t: "30 min", p: "$ 37.800" },
      { t: "40 min", p: "$ 46.200" },
      { t: "60 min", p: "$ 56.000" },
    ],
  },
  {
    id: "audio",
    titulo: "Tiradas por audio",
    desc: "Consultas puntuales y concretas, respondidas por mensaje de voz.",
    precios: [
      { t: "1 pregunta", p: "$ 8.000" },
      { t: "2 preguntas", p: "$ 14.000" },
      { t: "3 preguntas", p: "$ 20.000" },
    ],
  },
  {
    id: "eventos",
    titulo: "Servicio para eventos",
    desc: "Lecturas presenciales para celebraciones, con un mínimo de dos horas.",
    precios: [{ t: "Por hora", p: "$ 65.000" }],
    meta: "Presencial · Mínimo dos horas",
    nota: "Los viáticos se cotizan aparte.",
    destacada: true,
  },
];

export const CONDICIONES = [
  "Las sesiones se reservan abonando una seña del 30% del valor total.",
  "Cancelaciones con al menos 24 horas de anticipación; de lo contrario la seña no se reintegra.",
  "Todas las sesiones se realizan por videollamada.",
];
