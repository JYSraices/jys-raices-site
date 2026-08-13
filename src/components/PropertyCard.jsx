import React from "react";
import { MapPin, BedDouble, Bath, Ruler, Car, PencilLine, Trash2 } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY, formatCOPShort } from "../theme";

export default function PropertyCard({ p, index, adminMode, onEdit, onDelete }) {
  const photo = p.photos && p.photos.length > 0 ? p.photos[0] : null;
  const num = String((index ?? 0) + 1).padStart(2, "0");

  return (
    <div style={{ background: C.charcoalCard, borderTop: `3px solid ${C.orange}` }} className="flex flex-col">
      <div style={{ position: "relative", height: 210 }}>
        {photo ? (
          <img src={photo} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, #3a3226, ${C.charcoalDeep})` }} />
        )}

        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            fontFamily: FONT_HEAD,
            color: C.cream,
            opacity: 0.55,
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          {num}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            background: C.orange,
            color: C.charcoalDeep,
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: 18,
            padding: "9px 18px",
          }}
        >
          {formatCOPShort(p.price)}
          {p.operation === "arriendo" && <span style={{ fontSize: 12 }}>/mes</span>}
        </div>

        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            fontFamily: FONT_BODY,
            fontSize: 10,
            fontWeight: 700,
            color: C.charcoalDeep,
            background: C.cream,
            padding: "4px 10px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {p.status}
        </div>
      </div>

      <div className="flex flex-col flex-1" style={{ padding: "20px 20px 22px" }}>
        <div className="flex items-center gap-1 mb-2" style={{ color: C.gold }}>
          <MapPin size={12} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            {p.location}{p.city ? `, ${p.city}` : ""}
          </span>
        </div>

        <h3 style={{ fontFamily: FONT_BODY, color: C.cream, fontSize: 17, lineHeight: 1.35, fontWeight: 600 }} className="mb-4">
          {p.title}
        </h3>

        <div className="flex items-center gap-4 mb-4" style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mutedDark }}>
          <span className="flex items-center gap-1">
            <Ruler size={13} /> <b style={{ color: C.cream, fontWeight: 700 }}>{p.area}</b> m²
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={13} /> <b style={{ color: C.cream, fontWeight: 700 }}>{p.bedrooms}</b>
          </span>
          <span className="flex items-center gap-1">
            <Bath size={13} /> <b style={{ color: C.cream, fontWeight: 700 }}>{p.bathrooms}</b>
          </span>
          {p.garages > 0 && (
            <span className="flex items-center gap-1">
              <Car size={13} /> <b style={{ color: C.cream, fontWeight: 700 }}>{p.garages}</b>
            </span>
          )}
        </div>

        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mutedDark, lineHeight: 1.5 }} className="mb-4 flex-1">
          {p.description}
        </p>

        <div className="flex items-center justify-between mt-auto" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.mutedDark }}>{p.code}</span>

          {adminMode ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit(p)} style={{ border: `1px solid ${C.line}`, color: C.cream, background: "transparent" }} className="p-2">
                <PencilLine size={14} />
              </button>
              <button onClick={() => onDelete(p.id)} style={{ border: `1px solid ${C.rust}`, color: C.rust, background: "transparent" }} className="p-2">
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <span
              style={{
                fontFamily: FONT_HEAD,
                fontSize: 12,
                fontWeight: 700,
                color: p.operation === "venta" ? C.orange : C.gold,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
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
