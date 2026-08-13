import React, { useState } from "react";
import { Plus, Trash2, PencilLine, X, Check, LogOut, ImagePlus } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, FONT_MONO, formatCOP } from "../theme";
import { supabase } from "../supabaseClient";

const EMPTY_FORM = {
  title: "",
  operation: "venta",
  type: "Apartamento",
  price: "",
  location: "",
  city: "",
  bedrooms: "",
  bathrooms: "",
  garages: "",
  area: "",
  status: "Disponible",
  description: "",
  photos: [],
};

export default function AdminPanel({ properties, onClose, onChanged, userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const startNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setErrorMsg("");
  };

  const startEdit = (p) => {
    setForm({
      title: p.title || "",
      operation: p.operation || "venta",
      type: p.type || "Apartamento",
      price: p.price || "",
      location: p.location || "",
      city: p.city || "",
      bedrooms: p.bedrooms || "",
      bathrooms: p.bathrooms || "",
      garages: p.garages || "",
      area: p.area || "",
      status: p.status || "Disponible",
      description: p.description || "",
      photos: p.photos || [],
    });
    setEditingId(p.id);
    setShowForm(true);
    setErrorMsg("");
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setErrorMsg("");
    const uploaded = [];
    for (const file of files) {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("property-photos").upload(path, file);
      if (error) {
        setErrorMsg("No se pudo subir " + file.name + ": " + error.message);
        continue;
      }
      const { data } = supabase.storage.from("property-photos").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setForm((f) => ({ ...f, photos: [...f.photos, ...uploaded] }));
    setUploading(false);
  };

  const removePhoto = (url) => {
    setForm((f) => ({ ...f, photos: f.photos.filter((p) => p !== url) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;
    setSaving(true);
    setErrorMsg("");

    const payload = {
      title: form.title,
      operation: form.operation,
      type: form.type,
      price: Number(form.price) || 0,
      location: form.location,
      city: form.city,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      garages: Number(form.garages) || 0,
      area: Number(form.area) || 0,
      status: form.status,
      description: form.description,
      photos: form.photos,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("properties").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("properties").insert(payload));
    }

    setSaving(false);
    if (error) {
      setErrorMsg("No se pudo guardar: " + error.message);
      return;
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    onChanged();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (!error) onChanged();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  const inputStyle = {
    fontFamily: FONT_BODY,
    fontSize: 14,
    background: C.white,
    border: `1px solid ${C.line}`,
    color: C.ink,
    padding: "9px 10px",
    width: "100%",
  };
  const labelStyle = {
    fontFamily: FONT_MONO,
    fontSize: 10,
    letterSpacing: "0.06em",
    color: C.muted,
    display: "block",
    marginBottom: 4,
    textTransform: "uppercase",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,39,63,0.55)" }} className="flex justify-end" onClick={onClose}>
      <div
        style={{ background: C.paper, width: "min(500px, 100%)", height: "100%", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col"
      >
        <div style={{ background: C.charcoal, padding: "20px 22px" }} className="flex items-center justify-between">
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.goldBright, letterSpacing: "0.08em" }}>
              {userEmail}
            </div>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.white, fontSize: 22, fontWeight: 600 }}>Gestionar propiedades</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={signOut} title="Cerrar sesión" style={{ color: C.white }}>
              <LogOut size={19} />
            </button>
            <button onClick={onClose} aria-label="Cerrar panel" style={{ color: C.white }}>
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-5 flex-1">
          {!showForm ? (
            <>
              <button
                onClick={startNew}
                style={{ fontFamily: FONT_BODY, fontWeight: 600, background: C.charcoal, color: C.white }}
                className="w-full flex items-center justify-center gap-2 py-3 mb-6"
              >
                <Plus size={17} /> Agregar propiedad
              </button>

              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.muted, letterSpacing: "0.06em" }} className="mb-2">
                {properties.length} PROPIEDAD{properties.length === 1 ? "" : "ES"} REGISTRADA{properties.length === 1 ? "" : "S"}
              </div>

              <div className="flex flex-col gap-2">
                {properties.map((p) => (
                  <div key={p.id} style={{ background: C.card, border: `1px solid ${C.line}` }} className="flex items-center justify-between p-3">
                    <div className="min-w-0">
                      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.muted }}>{p.code}</div>
                      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: C.ink }} className="truncate">
                        {p.title}
                      </div>
                      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.muted }}>{formatCOP(p.price)}</div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <button onClick={() => startEdit(p)} style={{ border: `1px solid ${C.line}`, color: C.ink }} className="p-2">
                        <PencilLine size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ border: `1px solid ${C.rust}`, color: C.rust }} className="p-2">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {properties.length === 0 && (
                  <p style={{ fontFamily: FONT_BODY, color: C.muted, fontSize: 13 }}>
                    Todavía no hay propiedades. Usa "Agregar propiedad" para crear la primera.
                  </p>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.charcoal }}>
                {editingId ? "EDITANDO PROPIEDAD" : "NUEVA PROPIEDAD"}
              </div>

              <div>
                <label style={labelStyle}>Título</label>
                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Operación</label>
                  <select style={inputStyle} value={form.operation} onChange={(e) => setForm({ ...form, operation: e.target.value })}>
                    <option value="venta">Venta</option>
                    <option value="arriendo">Arriendo</option>
                    <option value="permuta">Permuta</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tipo</label>
                  <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Casa Campestre</option>
                    <option>Apartaestudio</option>
                    <option>Lote / Terreno</option>
                    <option>Local</option>
                    <option>Oficina</option>
                    <option>Bodega</option>
                    <option>Finca</option>
                    <option>Penthouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Precio (COP)</label>
                <input style={inputStyle} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Ciudad</label>
                  <input style={inputStyle} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Medellín, Envigado..." />
                </div>
                <div>
                  <label style={labelStyle}>Barrio / zona</label>
                  <input style={inputStyle} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label style={labelStyle}>Habs.</label>
                  <input style={inputStyle} type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Baños</label>
                  <input style={inputStyle} type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Garajes</label>
                  <input style={inputStyle} type="number" min="0" value={form.garages} onChange={(e) => setForm({ ...form, garages: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Área m²</label>
                  <input style={inputStyle} type="number" min="0" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Estado</label>
                <select style={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Disponible</option>
                  <option>Reservado</option>
                  <option>Vendido</option>
                  <option>Arrendado</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>Fotos</label>
                <label
                  style={{ border: `1px dashed ${C.line}`, color: C.muted, fontFamily: FONT_BODY, fontSize: 13 }}
                  className="flex items-center justify-center gap-2 py-4 cursor-pointer"
                >
                  <ImagePlus size={16} />
                  {uploading ? "Subiendo..." : "Subir fotos desde tu computador"}
                  <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} disabled={uploading} />
                </label>
                {form.photos.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {form.photos.map((url) => (
                      <div key={url} style={{ position: "relative" }}>
                        <img src={url} alt="" style={{ width: 64, height: 64, objectFit: "cover", border: `1px solid ${C.line}` }} />
                        <button
                          type="button"
                          onClick={() => removePhoto(url)}
                          style={{ position: "absolute", top: -6, right: -6, background: C.rust, color: C.white, borderRadius: "50%", width: 18, height: 18, fontSize: 11, lineHeight: "18px" }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errorMsg && <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.rust }}>{errorMsg}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  style={{ fontFamily: FONT_BODY, border: `1px solid ${C.line}`, color: C.ink }}
                  className="flex-1 py-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ fontFamily: FONT_BODY, fontWeight: 600, background: C.charcoal, color: C.white }}
                  className="flex-1 py-3 flex items-center justify-center gap-2"
                >
                  <Check size={16} /> {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Publicar propiedad"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
