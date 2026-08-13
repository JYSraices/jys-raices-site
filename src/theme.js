// Paleta y tipografía oficiales — tomadas del Manual de Marca J&S Raíces
export const C = {
  ink: "#1C1A16",
  charcoal: "#1B1912",
  charcoalDeep: "#141310",
  line: "rgba(160,133,86,0.30)",
  gold: "#A08556",
  goldDark: "#7A6640",
  goldBright: "#C7A85E",
  olive: "#576C2A",
  orange: "#F59D1A",
  rust: "#EA5B2F",
  paper: "#EFE7D3",
  card: "#F8F4E9",
  cream: "#EDE2C7",
  muted: "#6B6152",
  white: "#FFFFFF",
};

// Fuente principal (marca): Inter — Fuente de acento (wordmark/headers): Georgia (system)
// Fuente de titulares grandes: Barlow Semi Condensed (sustituto libre de Flama, usada en el manual)
export const FONT_DISPLAY = "Georgia, 'Times New Roman', serif";
export const FONT_HEAD = "'Barlow Semi Condensed', sans-serif";
export const FONT_BODY = "'Inter', sans-serif";
export const FONT_MONO = "'Inter', sans-serif";

export const STATUS_COLOR = {
  Disponible: C.olive,
  Reservado: C.orange,
  Vendido: C.muted,
  Arrendado: C.muted,
};

export function formatCOP(n) {
  const num = Number(n) || 0;
  return "$" + num.toLocaleString("es-CO");
}
