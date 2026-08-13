import React from "react";
import { MapPin, BedDouble, Bath, Ruler, PencilLine, Trash2 } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, FONT_MONO, STATUS_COLOR, formatCOP } from "../theme";

function CornerTicks({ color = C.lineStrong }) {
  const seg = { position: "absolute", width: 10, height: 10, borderColor: color };
  return (
    <>
      <span style={{ ...seg, top: 8, left: 8, borderTop: "1.5px solid", borderLeft: "1.5px solid" }} />
      <span style={{ ...seg, top: 8, right: 8, borderTop: "1.5px solid", borderRight: "1.5px solid" }} />
      <span style={{ ...seg, bottom: 8, left: 8, borderBottom: "1.5px solid", borderLeft: "1.5px solid" }} />
      <span style={{ ...seg, bottom: 8, right: 8, borderBottom: "1.5px solid", borderRight: "1.5px solid" }} />
    </>
  );
}

export default function PropertyCard({ p, adminMode, onEdit, onDelete }) {
  const photo = p.photos && p.photos.length > 0 ? p.photos[0] : null;

  return (
    <div style={{ position: "relative", background: C.card, border: `1px solid ${C.line}` }} className="flex flex-col">
      <CornerTicks />

      {photo ? (
        <img
          src={photo}
          alt={p.title}
          style={{ width: "100%", height: 170, objectFit: "cover", borderBottom: `1px solid ${C.line}` }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 170,
            background: C.blueprintDeep,
            borderBottom: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.lineStrong, letterSpacing: "0.08em" }}>
            SIN FOTO
          </span>
        </div>
      )}

      <div style={{ padding: "18px" }} className="flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <span style={{ fontFamily: FONT_MONO, color: C.muted, fontSize: 11, letterSpacing: "0.06em" }}>{p.code}</span>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              letterSpacing: "0.08em",
              color: STATUS_COLOR[p.status] || C.muted,
              border: `1px solid ${STATUS_COLOR[p.status] || C.muted}`,
              padding: "2px 8px",
              textTransform: "uppercase",
            }}
          >
            {p.status}
          </span>
        </div>

        <h3 style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: 19, lineHeight: 1.25, fontWeight: 600 }} className="mb-1">
          {p.title}
        </h3>

        <div className="flex items-center gap-1 mb-4" style={{ color: C.muted }}>
          <MapPin size={13} />
          <span style={{ fontFamily: FONT_BODY, fontSize: 13 }}>{p.location}</span>
        </div>

        <div
          style={{ borderTop: `1px dashed ${C.line}`, paddingTop: 12, fontFamily: FONT_MONO, fontSize: 12, color: C.muted }}
          className="flex items-center gap-4 mb-4"
        >
          <span className="flex items-center gap-1">
            <BedDouble size={14} /> {p.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} /> {p.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Ruler size={14} /> {p.area} m²
          </span>
        </div>

        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.ink, opacity: 0.75, lineHeight: 1.5 }} className="mb-5 flex-1">
          {p.description}
        </p>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.muted, letterSpacing: "0.08em" }}>
              {p.operation === "venta" ? "PRECIO VENTA" : "ARRIENDO / MES"}
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: C.blueprint }}>
              {formatCOP(p.price)}
            </div>
          </div>

          {adminMode ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit(p)} style={{ border: `1px solid ${C.line}`, color: C.ink, background: "transparent" }} className="p-2">
                <PencilLine size={15} />
              </button>
              <button onClick={() => onDelete(p.id)} style={{ border: `1px solid ${C.brick}`, color: C.brick, background: "transparent" }} className="p-2">
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: p.operation === "venta" ? C.brick : C.blueprint,
                border: `1px solid ${p.operation === "venta" ? C.brick : C.blueprint}`,
                padding: "4px 10px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
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
