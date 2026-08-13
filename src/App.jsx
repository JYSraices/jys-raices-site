import React, { useState, useEffect, useCallback } from "react";
import { Home, Settings2, Search, Building2, Phone, Mail, MapPin } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, FONT_MONO } from "./theme";
import { supabase } from "./supabaseClient";
import PropertyCard from "./components/PropertyCard";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";

// Datos reales de contacto (tomados de jysraices.com — edítalos aquí cuando cambien)
const AGENCY = {
  name: "JYS",
  suffix: "RAÍCES",
  phone: "+57 310 447 6964",
  phoneHref: "tel:+573104476964",
  email: "jbedoya@jysraices.com",
  address: "Calle 36 sur # 43 a 41, Barrio Andalucía, Envigado - Antioquia",
  areas: "MEDELLÍN · ENVIGADO · ITAGÜÍ · SABANETA",
};

export default function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [filter, setFilter] = useState("todas");
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (error) {
      setLoadError(true);
    } else {
      setProperties(data || []);
      setLoadError(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProperties();

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setShowLogin(false);
        setShowAdmin(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [fetchProperties]);

  const openManage = () => {
    if (session) {
      setShowAdmin(true);
    } else {
      setShowLogin(true);
    }
  };

  const visible = properties.filter((p) => {
    const matchesFilter = filter === "todas" || p.operation === filter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (p.title || "").toLowerCase().includes(q) ||
      (p.location || "").toLowerCase().includes(q) ||
      (p.city || "").toLowerCase().includes(q) ||
      (p.type || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.paper, minHeight: "100vh" }}>
      {/* NAV */}
      <header style={{ background: C.blueprint, borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Building2 size={20} color={C.brass} />
            <span style={{ fontFamily: FONT_DISPLAY, color: C.white, fontSize: 20, fontWeight: 700, letterSpacing: "0.02em" }}>
              {AGENCY.name}
            </span>
            <span style={{ fontFamily: FONT_MONO, color: C.lineStrong, fontSize: 10, letterSpacing: "0.1em" }}>
              {AGENCY.suffix}
            </span>
          </div>
          <button
            onClick={openManage}
            style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.white, border: `1px solid ${C.lineStrong}` }}
            className="flex items-center gap-2 px-3 py-2"
          >
            <Settings2 size={14} /> Gestionar propiedades
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          background: C.blueprintDeep,
          backgroundImage:
            "linear-gradient(rgba(111,168,214,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(111,168,214,0.14) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          padding: "72px 20px 60px",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: FONT_MONO, color: C.brass, fontSize: 12, letterSpacing: "0.14em" }} className="mb-4">
            {AGENCY.areas}
          </div>
          <h1
            style={{ fontFamily: FONT_DISPLAY, color: C.white, fontSize: "clamp(34px, 6vw, 58px)", fontWeight: 700, lineHeight: 1.05, maxWidth: 720 }}
            className="mb-5"
          >
            Cada propiedad, <em style={{ color: C.brass, fontStyle: "italic" }}>trazada</em> con precisión.
          </h1>
          <p style={{ fontFamily: FONT_BODY, color: "rgba(255,255,255,0.75)", fontSize: 17, maxWidth: 520 }} className="mb-8">
            Más que negocios con propósito: confianza y acompañamiento desde el inicio hasta el cierre de cada operación inmobiliaria.
          </p>

          <div style={{ background: C.card, border: `1px solid ${C.line}`, maxWidth: 560 }} className="flex items-center gap-2 px-4 py-3">
            <Search size={17} color={C.muted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por barrio, ciudad, tipo o nombre..."
              style={{ fontFamily: FONT_BODY, fontSize: 14, border: "none", outline: "none", background: "transparent", width: "100%", color: C.ink }}
            />
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <div style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-6xl mx-auto flex items-center gap-2 px-5 py-4 flex-wrap">
          {[
            ["todas", "Todas"],
            ["venta", "Venta"],
            ["arriendo", "Arriendo"],
            ["permuta", "Permuta"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 12,
                letterSpacing: "0.05em",
                padding: "8px 16px",
                border: `1px solid ${filter === key ? C.blueprint : C.line}`,
                background: filter === key ? C.blueprint : "transparent",
                color: filter === key ? C.white : C.ink,
              }}
            >
              {label.toUpperCase()}
            </button>
          ))}
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.muted }} className="ml-auto">
            {visible.length} RESULTADO{visible.length === 1 ? "" : "S"}
          </span>
        </div>
      </div>

      {/* LISTADO */}
      <main className="max-w-6xl mx-auto px-5 py-10">
        {loading ? (
          <p style={{ fontFamily: FONT_MONO, color: C.muted, fontSize: 13 }}>Cargando propiedades...</p>
        ) : loadError ? (
          <div style={{ border: `1px dashed ${C.brick}`, padding: 40 }} className="text-center">
            <p style={{ fontFamily: FONT_BODY, color: C.brick, fontSize: 14 }}>
              No se pudo conectar con la base de datos. Verifica las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div style={{ border: `1px dashed ${C.line}`, padding: 40 }} className="text-center">
            <Home size={22} color={C.muted} className="mx-auto mb-3" />
            <p style={{ fontFamily: FONT_BODY, color: C.muted, fontSize: 14 }}>
              {properties.length === 0
                ? "Aún no hay propiedades cargadas. Entra a \"Gestionar propiedades\" para agregar la primera."
                : "No hay propiedades que coincidan con la búsqueda."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {visible.map((p) => (
              <PropertyCard key={p.id} p={p} adminMode={false} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ background: C.blueprint }} className="mt-10">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-wrap items-start justify-between gap-8">
          <div>
            <span style={{ fontFamily: FONT_DISPLAY, color: C.white, fontSize: 18, fontWeight: 700 }}>{AGENCY.name}</span>
            <span style={{ fontFamily: FONT_MONO, color: C.lineStrong, fontSize: 10, marginLeft: 8 }}>{AGENCY.suffix}</span>
          </div>
          <div className="flex flex-col gap-2">
            <a href={AGENCY.phoneHref} style={{ fontFamily: FONT_BODY, color: "rgba(255,255,255,0.8)", fontSize: 13 }} className="flex items-center gap-2">
              <Phone size={14} /> {AGENCY.phone}
            </a>
            <a href={`mailto:${AGENCY.email}`} style={{ fontFamily: FONT_BODY, color: "rgba(255,255,255,0.8)", fontSize: 13 }} className="flex items-center gap-2">
              <Mail size={14} /> {AGENCY.email}
            </a>
            <span style={{ fontFamily: FONT_BODY, color: "rgba(255,255,255,0.8)", fontSize: 13 }} className="flex items-center gap-2">
              <MapPin size={14} /> {AGENCY.address}
            </span>
          </div>
        </div>
      </footer>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showAdmin && session && (
        <AdminPanel
          properties={properties}
          userEmail={session.user.email}
          onClose={() => setShowAdmin(false)}
          onChanged={fetchProperties}
        />
      )}
    </div>
  );
}
