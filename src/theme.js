export const C = {
  ink: "#14212E",
  blueprint: "#1B3A5C",
  blueprintDeep: "#0F273F",
  line: "rgba(111,168,214,0.28)",
  lineStrong: "#6FA8D6",
  paper: "#EDE9DD",
  card: "#F8F6EF",
  brass: "#C9973E",
  brick: "#A8461F",
  green: "#4C7A5E",
  muted: "#5B6B78",
  white: "#FFFFFF",
};

export const FONT_DISPLAY = "'Fraunces', serif";
export const FONT_BODY = "'Space Grotesk', sans-serif";
export const FONT_MONO = "'JetBrains Mono', monospace";

export const STATUS_COLOR = {
  Disponible: C.green,
  Reservado: C.brass,
  Vendido: C.muted,
  Arrendado: C.muted,
};

export function formatCOP(n) {
  const num = Number(n) || 0;
  return "$" + num.toLocaleString("es-CO");
}
