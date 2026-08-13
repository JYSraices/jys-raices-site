// Paleta y tipografía oficiales — Manual de Marca J&S Raíces
// Dirección: MODERNA — naranja como protagonista, tipografía condensada en negrita
export const C = {
  ink: "#1C1A16",
  charcoal: "#151310",
  charcoalDeep: "#0F0D0A",
  charcoalCard: "#1E1B15",
  line: "rgba(160,133,86,0.25)",
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
  mutedDark: "#8B8478",
  white: "#FFFFFF",
};

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

export function formatCOPShort(n) {
  const num = Number(n) || 0;
  if (num >= 1000000000) return "$" + (num / 1000000000).toFixed(num % 1000000000 === 0 ? 0 : 1) + "MM";
  if (num >= 1000000) return "$" + Math.round(num / 1000000) + "M";
  return "$" + num.toLocaleString("es-CO");
}
