import React, { useState, useEffect, useCallback } from "react";
import { Home, Settings2, Search, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, FONT_MONO, FONT_HEAD } from "./theme";
import { supabase } from "./supabaseClient";
import PropertyCard from "./components/PropertyCard";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";

// Datos reales de contacto (tomados de jysraices.com — edítalos aquí cuando cambien)
const AGENCY = {
  name: "J&S",
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

  const forSaleCount = properties.filter((p) => p.operation === "venta").length;
  const cities = new Set(properties.map((p) => p.city).filter(Boolean)).size || 4;

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.charcoal, minHeight: "100vh" }}>
      {/* NAV */}
      <header className="px-5 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="J&S Raíces" style={{ width: 44, height: 44, borderRadius: "50%" }} />
            <div className="flex flex-col leading-none">
              <span style={{ fontFamily: FONT_HEAD, color: C.white, fontSize: 21, fontWeight: 700 }}>
                {AGENCY.name} <span style={{ color: C.orange }}>{AGENCY.suffix}</span>
              </span>
              <span style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>
                Inmobiliaria
              </span>
            </div>
          </div>
          <button
            onClick={openManage}
            style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, color: C.charcoalDeep, background: C.orange, border: "none" }}
            className="flex items-center gap-2 px-5 py-3"
          >
            <Settings2 size={15} /> Gestionar propiedades
          </button>
        </div>
      </header>

      {/* HERO asimétrico */}
      <section className="max-w-6xl mx-auto px-5" style={{ paddingTop: 8, paddingBottom: 90 }}>
        <div className="flex flex-wrap gap-10">
          <div style={{ flex: "1 1 480px", minWidth: 300 }}>
            <div
              style={{
                display: "inline-block",
                background: C.orange,
                color: C.charcoalDeep,
                fontFamily: FONT_BODY,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.04em",
                padding: "7px 16px",
              }}
              className="mb-8"
            >
              CONFIANZA QUE CONSTRUYE FUTURO
            </div>
            <h1
              style={{ fontFamily: FONT_HEAD, color: C.white, fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 800, lineHeight: 0.98, textTransform: "uppercase" }}
              className="mb-7"
            >
              Tenemos la <span style={{ color: C.gold }}>llave</span> de tu hogar soñado
            </h1>
            <p style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 16, maxWidth: 440, lineHeight: 1.7 }} className="mb-9">
              Conectamos personas con espacios para vivir, crecer e invertir en {AGENCY.areas.toLowerCase().replace(/ · /g, ", ")}.
            </p>

            <div className="flex gap-10 mb-10">
              <div>
                <div style={{ fontFamily: FONT_HEAD, color: C.orange, fontSize: 34, fontWeight: 700 }}>{properties.length || "—"}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Propiedades</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_HEAD, color: C.orange, fontSize: 34, fontWeight: 700 }}>{cities}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ciudades</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_HEAD, color: C.orange, fontSize: 34, fontWeight: 700 }}>{forSaleCount}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>En venta</div>
              </div>
            </div>

            <div style={{ background: C.card, maxWidth: 480 }} className="flex items-center gap-2 px-4 py-3">
              <Search size={17} color={C.muted} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por barrio, ciudad, tipo o nombre..."
                style={{ fontFamily: FONT_BODY, fontSize: 14, border: "none", outline: "none", background: "transparent", width: "100%", color: C.ink }}
              />
            </div>
          </div>

          <div style={{ flex: "1 1 320px", minWidth: 280, position: "relative", background: `linear-gradient(160deg, #4a3a20, ${C.charcoalDeep})`, minHeight: 380 }}>
            <div style={{ position: "absolute", inset: 24, border: `2px solid ${C.gold}` }} />
            <div style={{ position: "absolute", bottom: 24, left: 40, fontFamily: FONT_HEAD, color: C.white, opacity: 0.85, fontSize: 90, fontWeight: 800, lineHeight: 1 }}>
              01
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <div className="max-w-6xl mx-auto px-5 flex items-end justify-between flex-wrap gap-4" style={{ paddingBottom: 28 }}>
        <div>
          <div style={{ fontFamily: FONT_BODY, color: C.orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>SELECCIÓN ACTUAL</div>
          <h2 style={{ fontFamily: FONT_HEAD, color: C.white, fontSize: 34, fontWeight: 800, textTransform: "uppercase", marginTop: 6 }}>
            Propiedades destacadas
          </h2>
        </div>
        <div className="flex gap-2">
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
                fontFamily: FONT_BODY,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.03em",
                padding: "9px 16px",
                border: `1px solid ${filter === key ? C.orange : C.line}`,
                background: filter === key ? C.orange : "transparent",
                color: filter === key ? C.charcoalDeep : C.mutedDark,
              }}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO */}
      <main className="max-w-6xl mx-auto px-5" style={{ paddingBottom: 90 }}>
        {loading ? (
          <p style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 13 }}>Cargando propiedades...</p>
        ) : loadError ? (
          <div style={{ border: `1px dashed ${C.rust}`, padding: 40 }} className="text-center">
            <p style={{ fontFamily: FONT_BODY, color: C.rust, fontSize: 14 }}>
              No se pudo conectar con la base de datos. Verifica las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div style={{ border: `1px dashed ${C.line}`, padding: 40 }} className="text-center">
            <Home size={22} color={C.mutedDark} className="mx-auto mb-3" />
            <p style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 14 }}>
              {properties.length === 0
                ? "Aún no hay propiedades cargadas. Entra a \"Gestionar propiedades\" para agregar la primera."
                : "No hay propiedades que coincidan con la búsqueda."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {visible.map((p, i) => (
              <PropertyCard key={p.id} p={p} index={i} adminMode={false} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ background: C.charcoalDeep, borderTop: `1px solid ${C.line}` }}>
        <div className="max-w-6xl mx-auto px-5 py-12 flex flex-wrap items-start justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="J&S Raíces" style={{ width: 36, height: 36, borderRadius: "50%" }} />
            <div>
              <span style={{ fontFamily: FONT_HEAD, color: C.white, fontSize: 17, fontWeight: 700 }}>{AGENCY.name}</span>
              <span style={{ fontFamily: FONT_BODY, color: C.orange, fontSize: 11, marginLeft: 6, letterSpacing: "0.08em", fontWeight: 700 }}>{AGENCY.suffix}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a href={AGENCY.phoneHref} style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 13 }} className="flex items-center gap-2">
              <Phone size={14} /> {AGENCY.phone}
            </a>
            <a href={`mailto:${AGENCY.email}`} style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 13 }} className="flex items-center gap-2">
              <Mail size={14} /> {AGENCY.email}
            </a>
            <span style={{ fontFamily: FONT_BODY, color: C.mutedDark, fontSize: 13 }} className="flex items-center gap-2">
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
