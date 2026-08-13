import React from "react";
import { MapPin, BedDouble, Bath, Ruler, Car, PencilLine, Trash2 } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, FONT_HEAD, STATUS_COLOR, formatCOP } from "../theme";

export default function PropertyCard({ p, adminMode, onEdit, onDelete }) {
  const photo = p.photos && p.photos.length > 0 ? p.photos[0] : null;

  return (
    <div style={{ background: C.card, borderRadius: 22, overflow: "hidden", border: `1px solid ${C.line}` }} className="flex flex-col">
      <div style={{ position: "relative", height: 190 }}>
        {photo ? (
          <img src={photo} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: C.charcoal, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.gold, letterSpacing: "0.08em" }}>SIN FOTO</span>
          </div>
        )}

        {/* Etiqueta de precio, estilo plantilla del manual de marca */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: C.orange,
            color: C.charcoal,
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 15,
            padding: "5px 12px",
            borderRadius: 999,
          }}
        >
          {formatCOP(p.price)}
          {p.operation === "arriendo" && <span style={{ fontSize: 11, fontWeight: 600 }}> /mes</span>}
        </div>

        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            fontFamily: FONT_BODY,
            fontSize: 10,
            fontWeight: 600,
            color: C.white,
            background: "rgba(27,25,18,0.75)",
            padding: "4px 10px",
            borderRadius: 999,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {p.status}
        </div>
      </div>

      <div className="flex flex-col flex-1" style={{ padding: "16px 18px 18px" }}>
        <div className="flex items-center gap-1 mb-1" style={{ color: C.gold }}>
          <MapPin size={13} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600 }}>{p.location}{p.city ? `, ${p.city}` : ""}</span>
        </div>

        <h3 style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: 18, lineHeight: 1.3, fontWeight: 700 }} className="mb-3">
          {p.title}
        </h3>

        <div
          style={{ background: C.charcoal, borderRadius: 999, padding: "7px 14px" }}
          className="flex items-center gap-3 mb-3 w-fit"
        >
          <span className="flex items-center gap-1" style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.cream }}>
            <Ruler size={13} color={C.gold} /> {p.area} m²
          </span>
          <span className="flex items-center gap-1" style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.cream }}>
            <BedDouble size={13} color={C.gold} /> {p.bedrooms}
          </span>
          <span className="flex items-center gap-1" style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.cream }}>
            <Bath size={13} color={C.gold} /> {p.bathrooms}
          </span>
          {p.garages > 0 && (
            <span className="flex items-center gap-1" style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.cream }}>
              <Car size={13} color={C.gold} /> {p.garages}
            </span>
          )}
        </div>

        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.muted, lineHeight: 1.5 }} className="mb-4 flex-1">
          {p.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.muted }}>{p.code}</span>

          {adminMode ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit(p)} style={{ border: `1px solid ${C.line}`, color: C.ink, background: "transparent" }} className="p-2 rounded-full">
                <PencilLine size={14} />
              </button>
              <button onClick={() => onDelete(p.id)} style={{ border: `1px solid ${C.rust}`, color: C.rust, background: "transparent" }} className="p-2 rounded-full">
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: 11,
                fontWeight: 600,
                color: p.operation === "venta" ? C.rust : C.olive,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {p.operation}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
