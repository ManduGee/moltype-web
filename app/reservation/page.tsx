"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { COLORS, FONTS, PATTERNS } from "@/lib/assets";

const SESSIONS = [
  "Patch Session 01 — Sat 14:00",
  "Pocket Making Lab — Sun 16:00",
  "Thread by Thread — Fri 19:00",
];

type FieldKey = "name" | "email" | "session" | "message";

function Field({
  label, name, type = "text", as, options, value, onChange,
}: {
  label: string; name: FieldKey; type?: string;
  as?: "textarea" | "select"; options?: string[];
  value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  const base: React.CSSProperties = {
    width: "100%", background: "none", border: "none",
    borderBottom: `1px solid ${focused ? COLORS.pink : "#e0e0e0"}`,
    padding: "10px 0",
    fontFamily: FONTS.body, fontSize: "14px", color: COLORS.black,
    outline: "none", transition: "border-color 0.25s",
    resize: "none", display: "block",
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <label style={{
        fontFamily: FONTS.condensed, fontSize: "9px",
        letterSpacing: "0.28em", textTransform: "uppercase",
        color: COLORS.gray, display: "block", marginBottom: "8px",
      }}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea rows={3} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, lineHeight: "1.6" }} />
      ) : as === "select" ? (
        <select value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, cursor: "pointer", appearance: "none" }}>
          <option value="">— Select a session</option>
          {options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base} />
      )}
      <motion.div
        animate={{ scaleX: focused ? 1 : 0 }} initial={{ scaleX: 0 }}
        transition={{ duration: 0.3 }}
        style={{ height: "1px", backgroundColor: COLORS.pink, transformOrigin: "left", marginTop: "-1px" }}
      />
    </div>
  );
}

export default function ReservationPage() {
  const [form, setForm] = useState({ name: "", email: "", session: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const set = (k: FieldKey) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <PageLayout>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 56px)" }}>

        {/* Left — concept */}
        <div style={{
          padding: "80px 56px",
          borderRight: "1px solid #f0f0f0",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
              style={{ fontFamily: FONTS.condensed, fontSize: "9px", letterSpacing: "0.3em", color: COLORS.gray, textTransform: "uppercase", marginBottom: "24px" }}>
              Reservation
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "clamp(36px, 4.5vw, 64px)", letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.black, margin: "0 0 24px", lineHeight: 1 }}>
              Reserve your<br />unfinished<br />piece.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontFamily: FONTS.body, fontSize: "13px", lineHeight: "1.8", color: "#777777", maxWidth: "380px" }}>
              Choose a session. Bring your missing part. Leave with your own skin.
            </motion.p>
          </div>

          {/* Pattern accent — arrowPattern (workshop 관련) */}
          <div style={{ overflow: "hidden", height: "28px", marginTop: "48px" }}>
            <img src={PATTERNS.arrowPattern} alt=""
              style={{ width: "100%", height: "28px", objectFit: "cover", opacity: 0.45 }} />
          </div>
        </div>

        {/* Right — form */}
        <div style={{ padding: "80px 56px", display: "flex", alignItems: "flex-start" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ width: "100%", maxWidth: "440px" }}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                  <Field label="Name"    name="name"    value={form.name}    onChange={set("name")} />
                  <Field label="Email"   name="email"   type="email" value={form.email} onChange={set("email")} />
                  <Field label="Select Session" name="session" as="select"
                    options={SESSIONS} value={form.session} onChange={set("session")} />
                  <Field label="What do you want to complete?" name="message"
                    as="textarea" value={form.message} onChange={set("message")} />

                  {/* Submit — pink on hover */}
                  <button type="submit"
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    style={{
                      background: btnHover ? COLORS.pink : "none",
                      border: `1px solid ${btnHover ? COLORS.pink : COLORS.black}`,
                      padding: "14px 36px", cursor: "pointer",
                      fontFamily: FONTS.condensed, fontWeight: 700,
                      fontSize: "10px", letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: btnHover ? "#ffffff" : COLORS.black,
                      transition: "all 0.25s ease",
                    }}>
                    Submit
                  </button>
                  <p style={{ fontFamily: FONTS.body, fontSize: "9px", letterSpacing: "0.14em", color: "#C0C0C0", marginTop: "16px" }}>
                    Reservations are not yet available. This is a preview.
                  </p>
                </motion.form>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }} style={{ paddingTop: "40px" }}>
                  <div style={{ overflow: "hidden", height: "12px", marginBottom: "32px" }}>
                    <img src={PATTERNS.diamondPattern} alt=""
                      style={{ width: "100%", height: "12px", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontFamily: FONTS.condensed, fontWeight: 700, fontSize: "20px", letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.black, marginBottom: "16px" }}>
                    Noted.
                  </p>
                  <p style={{ fontFamily: FONTS.body, fontSize: "13px", lineHeight: "1.8", color: "#777777" }}>
                    Reservation is not available yet.<br />
                    We'll reach out when sessions open.
                  </p>
                  <button onClick={() => setSubmitted(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONTS.body, fontSize: "11px", letterSpacing: "0.14em", color: COLORS.pink, marginTop: "24px", padding: 0, textDecoration: "underline" }}>
                    Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
