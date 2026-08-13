import React, { useState } from "react";
import { X, LogIn } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, FONT_MONO } from "../theme";
import { supabase } from "../supabaseClient";

export default function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    onClose();
  };

  const inputStyle = {
    fontFamily: FONT_BODY,
    fontSize: 14,
    background: C.white,
    border: `1px solid ${C.line}`,
    color: C.ink,
    padding: "10px 12px",
    width: "100%",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,39,63,0.55)" }} className="flex items-center justify-center" onClick={onClose}>
      <div style={{ background: C.paper, width: "min(360px, 92vw)", padding: "28px 26px" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.blueprint, letterSpacing: "0.08em" }}>ACCESO</div>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: 21, fontWeight: 600 }}>Iniciar sesión</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar"><X size={20} color={C.ink} /></button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input style={inputStyle} type="email" required placeholder="Tu correo" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.brick }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: FONT_BODY, fontWeight: 600, background: C.blueprint, color: C.white }}
            className="flex items-center justify-center gap-2 py-3 mt-1"
          >
            <LogIn size={16} /> {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.muted, marginTop: 16, lineHeight: 1.5 }}>
          ¿Eres asesor y no tienes cuenta? Pídele a la administradora que te cree el acceso desde el panel de Supabase.
        </p>
      </div>
    </div>
  );
}
