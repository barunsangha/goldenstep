import React, { useState, useEffect } from "react";

/* -----------------------------------------------------------
   PACT — running competition app
   Palette follows the Strava brand sheet, with green in place of
   Tangelo: Black #000000 · Raisin Black #212124 · White #FFFFFF
   · Gray #818181 · Accent #00E07A · Money leaving #FF8534
   ----------------------------------------------------------- */

const T = {
  font: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  black: "#000000",
  card: "#212124",
  cardSoft: "#191919",
  line: "#282828",
  track: "#333336",
  white: "#FFFFFF",
  gray: "#818181",
  dim: "#5A5A5E",
  green: "#00E07A",
  orange: "#FF8534",
};

const CSS = `
html,body,#root{margin:0;padding:0;height:100%;background:${T.black};overscroll-behavior:none}
.pact-app{position:fixed;inset:0;display:flex;flex-direction:column;background:${T.black};color:${T.white};padding-top:env(safe-area-inset-top);font-family:${T.font};-webkit-font-smoothing:antialiased}
.pact-body{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.pact-body::-webkit-scrollbar{display:none}
.pact-tabs{flex:0 0 auto;border-top:1px solid ${T.line};display:flex;align-items:flex-start;padding:11px 6px 6px;padding-bottom:calc(6px + env(safe-area-inset-bottom))}
.pact-range{-webkit-appearance:none;appearance:none;background:transparent;width:100%;height:26px;margin:12px 0 2px}
.pact-range::-webkit-slider-runnable-track{height:2px;background:${T.track};border-radius:2px}
.pact-range::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;margin-top:-10px;cursor:pointer}
.pact-range::-moz-range-track{height:2px;background:${T.track};border-radius:2px}
.pact-range::-moz-range-thumb{width:22px;height:22px;border:none;border-radius:50%;background:#fff;cursor:pointer}
.pact-tap{cursor:pointer;background:none;border:none;padding:0;font-family:inherit;color:inherit;text-align:left;width:100%;display:block;-webkit-tap-highlight-color:transparent}
`;

/* Example clip — a friend's two seconds from a rain window. */
const CLIP = "data:image/jpeg;base64,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";

/* ------------------------------- data ------------------------------- */

const PEOPLE = [
  { id: "zi", name: "Zahid Ibrahim", meta: "On PACT · 4 pacts together", init: "ZI" },
  { id: "ph", name: "Pham Hanni", meta: "On PACT", init: "PH" },
  { id: "sm", name: "Sam Mendel", meta: "Will get a text invite", init: "SM" },
  { id: "jk", name: "Jules Kim", meta: "Will get a text invite", init: "JK" },
  { id: "ao", name: "Aisha Osman", meta: "On PACT", init: "AO" },
];

const CHARITIES = [
  { id: "red", name: "Red Cross", meta: "Emergency relief" },
  { id: "wwf", name: "WWF Australia", meta: "Habitat and wildlife" },
  { id: "ocean", name: "Ocean Cleanup", meta: "Plastic removal" },
  { id: "canc", name: "Cancer Council", meta: "Research and support" },
];

const PAYOUTS = [
  { id: "winner", t: "Winner takes all", d: "One runner takes the whole pot." },
  { id: "ranked", t: "Split by finishing place", d: "50 / 30 / 20 to the top three." },
  { id: "share", t: "Share of the pot by progress", d: "Everyone gets back a slice matching how much they hit." },
  { id: "finish", t: "Finishers split the pot", d: "Reach the goal and split it evenly. Miss it and you get nothing back." },
];

const DURATIONS = [
  { d: 7, t: "1 week", s: "Short and sharp" },
  { d: 14, t: "2 weeks", s: "Room to recover from a bad day" },
  { d: 30, t: "1 month", s: "Most popular" },
  { d: 90, t: "3 months", s: "Habit territory" },
];

const MODE_NAMES = { 1: "Beat yourself", 2: "Beat your friends", 3: "Pay your friend" };

/* A window opens when the weather turns. It multiplies what a run adds toward
   the goal — one currency, so money still follows from progress. */
const CONDITIONS = [
  { id: "rain", name: "Rain", mult: "2", meta: "While it's raining where you are" },
  { id: "hills", name: "Hills", mult: "1.5", meta: "Over 100 m of climbing" },
  { id: "dark", name: "Before sunrise", mult: "1.5", meta: "Out the door before first light" },
  { id: "cold", name: "Cold", mult: "1.5", meta: "Below 5°C" },
  { id: "heat", name: "Heat", mult: "1.5", meta: "Above 30°C" },
];

/* Plays are earned by streaks and spent on other runners. They move progress,
   never money — so nothing you can be handed changes what you owe. */
const PLAYS = [
  { id: "skim", name: "Skim", short: "Take 5% off the leader", owned: 1,
    desc: "Take 5% of whoever is first and add it to your own total. Only playable when you're not first." },
  { id: "downpour", name: "Downpour", short: "They run in the rain or not at all", owned: 1,
    desc: "For 48 hours, their runs only bank if they start inside a rain window. Dry runs still show in the feed — they just don't count." },
  { id: "double", name: "Double back", short: "Set them twice their shortest run", owned: 0, unlock: "21-day streak",
    desc: "Their next run has to beat twice their shortest run of the pact, or it doesn't count." },
];

const PLAY_LOG = [
  ["You skimmed Zahid", "−4.4 km off his total, 2h ago", "−4.4"],
  ["Pham called Downpour on you", "31h left · dry runs won't bank", "48h"],
];

/* ----------------------------- primitives ----------------------------- */

const num = (x) => Number(x).toLocaleString("en-US");
const money = (x) => "$" + Number(x).toFixed(2);
const money0 = (x) => "$" + Math.round(x);

const Eyebrow = ({ children, top = 40 }) => (
  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.dim, margin: `${top}px 0 16px` }}>
    {children}
  </div>
);

const H1 = ({ children }) => (
  <div style={{ fontSize: 27, fontWeight: 400, letterSpacing: "-.022em", lineHeight: 1.2, marginBottom: 12 }}>{children}</div>
);

const H2 = ({ children }) => (
  <div style={{ fontSize: 21, fontWeight: 400, letterSpacing: "-.026em", lineHeight: 1.2, marginBottom: 10 }}>{children}</div>
);

const Lede = ({ children, bottom = 36 }) => (
  <div style={{ fontSize: 14, fontWeight: 400, color: T.gray, lineHeight: 1.5, marginBottom: bottom }}>{children}</div>
);

const Note = ({ children, style }) => (
  <div style={{ fontSize: 13, fontWeight: 400, color: T.gray, lineHeight: 1.6, ...style }}>{children}</div>
);

const Hair = ({ m = "0" }) => <div style={{ height: 1, background: T.line, margin: m }} />;

const Bar = ({ pct, dim, h = 3, top = 10 }) => (
  <div style={{ height: h, background: T.track, borderRadius: h, overflow: "hidden", marginTop: top }}>
    <div style={{ height: "100%", width: pct + "%", background: dim ? "#565659" : T.green, borderRadius: h }} />
  </div>
);

const Avatar = ({ init, on, size = 32 }) => (
  <div style={{
    width: size, height: size, flex: `0 0 ${size}px`, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size > 40 ? 15 : 11, fontWeight: 500,
    background: on ? "rgba(0,224,122,.15)" : "#2C2C30", color: on ? T.green : T.gray,
  }}>{init}</div>
);

const Check = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#00160C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6.4 4.8 9 10 3" />
  </svg>
);

const Tick = ({ on }) => (
  <div style={{
    width: 20, height: 20, flex: "0 0 20px", borderRadius: "50%",
    border: on ? "none" : "1px solid #46464A", background: on ? T.green : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>{on ? <Check /> : null}</div>
);

const Chevron = ({ style }) => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke={T.dim} strokeWidth="1.6" strokeLinecap="round" style={style}>
    <path d="M1 1l5 5-5 5" />
  </svg>
);

/* A tappable option. Card only when it needs a tap target. */
const Option = ({ title, desc, selected, onClick, chevron }) => (
  <button className="pact-tap" onClick={onClick} style={{
    display: "flex", alignItems: desc ? "flex-start" : "center", gap: 14,
    background: T.card, borderRadius: 16, padding: "19px 19px", marginBottom: 10,
    border: `1px solid ${selected ? T.green : "transparent"}`,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15.5, fontWeight: 400, letterSpacing: "-.012em", color: selected ? T.green : T.white }}>{title}</div>
      {desc ? <div style={{ fontSize: 13, fontWeight: 400, color: T.gray, marginTop: 7, lineHeight: 1.55 }}>{desc}</div> : null}
    </div>
    {chevron ? <Chevron style={{ marginTop: desc ? 5 : 0 }} /> : <Tick on={selected} />}
  </button>
);

/* A hairline row — the default for lists, so screens don't fill with boxes. */
const Row = ({ children, onClick, last }) => {
  const style = { display: "flex", alignItems: "center", gap: 13, padding: "15px 0", borderBottom: last ? "none" : `1px solid ${T.line}` };
  return onClick
    ? <button className="pact-tap" onClick={onClick} style={style}>{children}</button>
    : <div style={style}>{children}</div>;
};

const Chip = ({ label, selected, onClick }) => (
  <button className="pact-tap" onClick={onClick} style={{
    width: "auto", background: T.card, borderRadius: 999, padding: "8px 15px",
    fontSize: 13, fontWeight: 500, color: selected ? T.green : T.gray,
    border: `1px solid ${selected ? T.green : "transparent"}`,
  }}>{label}</button>
);

const Stat = ({ v, l, color }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 19, fontWeight: 400, letterSpacing: "-.028em", fontVariantNumeric: "tabular-nums", color: color || T.white }}>{v}</div>
    <div style={{ fontSize: 11, fontWeight: 400, color: T.dim, marginTop: 5 }}>{l}</div>
  </div>
);

const Cta = ({ children, onClick, variant }) => {
  const base = { borderRadius: 14, padding: 15, textAlign: "center", fontSize: 15.5, letterSpacing: "-.01em", marginTop: 7 };
  const v = variant === "ghost"
    ? { background: "transparent", color: T.gray, fontWeight: 400 }
    : variant === "quiet"
      ? { background: "transparent", color: T.dim, fontWeight: 400, fontSize: 13.5 }
      : { background: T.green, color: "#00160C", fontWeight: 500 };
  return <button className="pact-tap" onClick={onClick} style={{ ...base, ...v }}>{children}</button>;
};

const CtaWrap = ({ children }) => (
  <div style={{
    position: "sticky", bottom: 0, paddingTop: 38, paddingBottom: 24,
    background: "linear-gradient(to top, #000 64%, rgba(0,0,0,0))",
  }}>{children}</div>
);

const Switch = ({ on, onClick }) => (
  <button className="pact-tap" onClick={onClick} style={{
    width: 46, height: 28, flex: "0 0 46px", borderRadius: 14,
    background: on ? T.green : "#3A3A3E", position: "relative",
  }}>
    <div style={{
      position: "absolute", top: 3, left: on ? 21 : 3, width: 22, height: 22,
      borderRadius: "50%", background: "#fff", transition: "left .16s ease",
    }} />
  </button>
);

const Multiplier = ({ v }) => (
  <div style={{ fontSize: 21, fontWeight: 250, letterSpacing: "-.02em", color: T.green, fontVariantNumeric: "tabular-nums" }}>{v}×</div>
);

const Clip = ({ caption, tall }) => (
  <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#131316" }}>
    <img src={CLIP} alt="" style={{ width: "100%", display: "block", aspectRatio: tall ? "4 / 5" : "16 / 10", objectFit: "cover", opacity: .92 }} />
    <div style={{
      position: "absolute", left: 14, top: 14, display: "flex", alignItems: "center", gap: 7,
      background: "rgba(0,0,0,.55)", borderRadius: 999, padding: "5px 11px 5px 9px",
    }}>
      <svg width="9" height="10" viewBox="0 0 9 10" fill="#fff"><path d="M0 0l9 5-9 5z" /></svg>
      <span style={{ fontSize: 11.5, fontWeight: 400, color: "#fff", fontVariantNumeric: "tabular-nums" }}>0:02</span>
    </div>
    {caption ? (
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 13, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,.92)" }}>
        {caption}
      </div>
    ) : null}
  </div>
);

const Streak = ({ done = 4, of = 7 }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {Array.from({ length: of }).map((_, i) => (
      <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < done ? T.green : "#2E2E32" }} />
    ))}
  </div>
);

const WindowRow = ({ worth, timeLeft, onClick }) => (
  <button className="pact-tap" onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 13, borderRadius: 15, padding: "15px 16px",
    background: "radial-gradient(120% 150% at 85% 0%, rgba(0,224,122,.16) 0%, rgba(0,224,122,.05) 55%, rgba(0,224,122,.03) 100%)",
    border: "1px solid rgba(0,224,122,.30)",
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.green }}>
        Rain window · {timeLeft}
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 400, marginTop: 8, lineHeight: 1.4 }}>{worth}</div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 250, letterSpacing: "-.03em", color: T.green, lineHeight: 1 }}>2×</div>
    <Chevron />
  </button>
);

const Fine = ({ children }) => (
  <div style={{ fontSize: 11.5, fontWeight: 400, color: T.dim, textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>{children}</div>
);

const Progress = ({ step }) => (
  <div style={{ display: "flex", gap: 5, padding: "6px 22px 30px" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{ height: 2, flex: 1, borderRadius: 2, background: i <= step ? "#6E6E72" : "#2E2E32" }} />
    ))}
  </div>
);

const Nav = ({ title, onBack, backGlyph = "‹", right, big }) => (
  <div style={{ display: "flex", alignItems: "center", height: 46, padding: "0 16px 0 8px" }}>
    {onBack ? (
      <button className="pact-tap" onClick={onBack} style={{
        width: backGlyph.length > 1 ? "auto" : 36, height: 36, padding: backGlyph.length > 1 ? "0 8px" : 0,
        display: "flex", alignItems: "center", justifyContent: "center", color: T.gray,
        fontSize: backGlyph === "‹" ? 26 : 14, fontWeight: 400, lineHeight: 1,
      }}>{backGlyph}</button>
    ) : <div style={{ width: 8 }} />}
    <div style={{
      flex: 1,
      textAlign: big ? "left" : "center",
      paddingRight: big ? 0 : 36,
      paddingLeft: big ? 8 : 0,
      fontSize: big ? 19 : 14,
      fontWeight: 400,
      letterSpacing: big ? (title === "PACT" ? ".24em" : "-.01em") : ".01em",
      color: big ? T.white : T.gray,
    }}>{title}</div>
    {right || null}
  </div>
);

/* -------------------------------- app -------------------------------- */

export default function PactApp() {
  const [stack, setStack] = useState(["home"]);
  const [mode, setMode] = useState(1);
  const [metric, setMetric] = useState("steps");
  const [goal, setGoal] = useState(50000);
  const [days, setDays] = useState(7);
  const [charity, setCharity] = useState("red");
  const [payout, setPayout] = useState("winner");
  const [friends, setFriends] = useState([]);
  const [stake, setStake] = useState(50);
  const [rate, setRate] = useState(2);
  const [whatIf, setWhatIf] = useState(74);
  const [conditions, setConditions] = useState(true);
  const [playPicked, setPlayPicked] = useState("skim");
  const [playTargetId, setPlayTargetId] = useState("zi");
  const [left, setLeft] = useState(8048); // seconds remaining in the open window

  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = Math.floor(left / 3600);
  const mm = Math.floor((left % 3600) / 60);
  const ss = left % 60;
  const pad = (v) => String(v).padStart(2, "0");
  const shortLeft = `${hh}h ${mm}m left`;

  const screen = stack[stack.length - 1];
  const go = (id) => setStack((s) => [...s, id]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const root = (id) => setStack([id]);

  const goalText = () => (metric === "steps" ? num(goal) + " steps" : goal + " km");
  const durText = () => (DURATIONS.find((d) => d.d === days) || {}).t || days + " days";
  const perDay = () => {
    const v = goal / days;
    return metric === "steps" ? num(Math.round(v / 50) * 50) + " steps a day" : v.toFixed(1) + " km a day";
  };
  const charityName = () => (CHARITIES.find((c) => c.id === charity) || {}).name || "charity";
  const payoutName = () => (PAYOUTS.find((p) => p.id === payout) || {}).t || "";
  const friendNames = () => friends.map((id) => (PEOPLE.find((p) => p.id === id) || {}).name.split(" ")[0]).join(", ");
  const maxExposure = () => (mode === 3 ? (metric === "steps" ? goal / 1000 : goal) * rate : stake);

  const pick = (m) => {
    setMode(m);
    setMetric(m === 2 ? "km" : "steps");
    setGoal(m === 2 ? 100 : m === 3 ? 70000 : 50000);
    setDays(m === 2 ? 30 : 7);
    setFriends(m === 3 ? ["zi"] : []);
    go("goal");
  };

  const toggleFriend = (id) =>
    setFriends((f) => (f.includes(id) ? f.filter((x) => x !== id) : mode === 3 ? [id] : [...f, id]));

  const afterDuration = () => go(mode === 1 ? "charity" : mode === 2 ? "payout" : "friends");
  const openLive = () => setStack(["home", mode === 1 ? "live1" : mode === 2 ? "live2" : "live3"]);

  /* ------------------------------ screens ------------------------------ */

  const Pad = ({ children }) => <div style={{ padding: "0 22px" }}>{children}</div>;

  const screens = {

    /* ---------------- home ---------------- */
    home: (
      <>
        <Nav big title="PACT" right={
          <button className="pact-tap" onClick={() => go("profile")} style={{ width: 36, color: T.gray }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8.2" r="3.4" /><path d="M5 20c.9-3.5 3.7-5.3 7-5.3s6.1 1.8 7 5.3" />
            </svg>
          </button>
        } />
        <Pad>
          <div style={{ padding: "20px 0 34px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.dim }}>Today</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginTop: 14 }}>
              <div style={{ fontSize: 52, fontWeight: 250, letterSpacing: "-.028em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>8,412</div>
              <div style={{ fontSize: 14, fontWeight: 400, color: T.gray }}>steps</div>
            </div>
            <Bar pct={67} top={20} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12.5 }}>
              <span style={{ color: T.gray }}>4,088 to go today</span>
              <span style={{ color: T.orange, fontWeight: 500 }}>$1.20 at risk</span>
            </div>
          </div>

          <Eyebrow top={0}>Active pact</Eyebrow>

          <button className="pact-tap" onClick={() => go("live1")} style={{ background: T.card, borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.dim }}>Solo · Red Cross</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: T.dim }}>3 days left</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 400, letterSpacing: "-.022em", marginTop: 13 }}>50,000 steps this week</div>
            <Bar pct={74} top={18} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12.5 }}>
              <span style={{ color: T.gray }}>37,000 of 50,000</span>
              <span style={{ color: T.orange, fontWeight: 500 }}>$13 at risk</span>
            </div>
          </button>

          <button className="pact-tap" onClick={() => go("live2")} style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 2px 0" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 400, letterSpacing: "-.012em" }}>July 100 km club</div>
              <div style={{ fontSize: 12.5, fontWeight: 400, color: T.gray, marginTop: 4 }}>2nd of 5 · 11 days left</div>
            </div>
            <div style={{ fontSize: 14, color: T.gray, fontVariantNumeric: "tabular-nums" }}>75 km</div>
            <Chevron />
          </button>

          <CtaWrap><Cta onClick={() => go("modes")}>Start a pact</Cta></CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- mode select ---------------- */
    modes: (
      <>
        <Nav title="" />
        <Pad>
          <div style={{ padding: "22px 0 0" }}>
            <div style={{ fontSize: 31, fontWeight: 250, letterSpacing: "-.02em", lineHeight: 1.3 }}>
              Put something<br />on the line
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: T.gray, lineHeight: 1.6, marginTop: 18, maxWidth: 288 }}>
              Money only leaves your account if you fall short. Choose who it goes to.
            </div>
          </div>

          <div style={{ marginTop: 46 }}>
            <Option chevron title="Beat yourself" desc="Stake against your own goal. Whatever you miss goes to a charity." onClick={() => pick(1)} />
            <Option chevron title="Beat your friends" desc="Everyone pays into one pot. You decide how it gets split." onClick={() => pick(2)} />
            <Option chevron title="Pay your friend" desc="Same goal, no pot. Whatever you fall short by, you pay them." onClick={() => pick(3)} />
          </div>

          <Note style={{ marginTop: 34, marginBottom: 40, maxWidth: 300 }}>
            Steps and distance come from Apple Health.
          </Note>
        </Pad>
      </>
    ),

    /* ---------------- goal ---------------- */
    goal: (() => {
      const steps = metric === "steps";
      const presets = steps ? [35000, 50000, 70000, 100000, 150000] : [25, 50, 100, 150, 200];
      return (
        <>
          <Nav title={MODE_NAMES[mode]} onBack={back} />
          <Progress step={1} />
          <Pad>
            <H2>{mode === 3 ? "Set the shared goal" : "Set the goal"}</H2>
            <Lede>
              {mode === 3 ? "You both chase the same number. Whoever falls short pays the difference."
                : mode === 2 ? "Everyone in the group chases this same number."
                  : "Choose what you're chasing."}
            </Lede>

            <div style={{ display: "flex", background: T.card, borderRadius: 10, padding: 3, marginBottom: 36 }}>
              {[["steps", "Steps"], ["km", "Distance"]].map(([k, label]) => (
                <button key={k} className="pact-tap" onClick={() => { setMetric(k); setGoal(k === "steps" ? 50000 : 100); }}
                  style={{
                    flex: 1, padding: 7, borderRadius: 7, textAlign: "center", fontSize: 13.5,
                    fontWeight: metric === k ? 500 : 400,
                    background: metric === k ? "#3A3A3E" : "transparent",
                    color: metric === k ? T.white : T.gray,
                  }}>{label}</button>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 54, fontWeight: 250, letterSpacing: "-.026em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {steps ? num(goal) : goal}
              </div>
              <div style={{ fontSize: 13, fontWeight: 400, color: T.gray, marginTop: 12 }}>
                {steps ? "steps for the whole pact" : "kilometres for the whole pact"}
              </div>
            </div>

            <input className="pact-range" type="range" value={goal}
              min={steps ? 10000 : 5} max={steps ? 250000 : 250} step={steps ? 2500 : 5}
              onChange={(e) => setGoal(Number(e.target.value))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.dim, marginBottom: 28 }}>
              <span>{steps ? "10,000" : "5 km"}</span><span>{steps ? "250,000" : "250 km"}</span>
            </div>

            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {presets.map((p) => <Chip key={p} label={steps ? num(p) : p + " km"} selected={p === goal} onClick={() => setGoal(p)} />)}
            </div>

            <Note style={{ marginTop: 26 }}>
              That works out to {perDay()} over {durText()}. Your 30-day average is {steps ? "8,900 steps" : "5.8 km"} a day.
            </Note>

            <CtaWrap><Cta onClick={() => go("duration")}>Continue</Cta></CtaWrap>
          </Pad>
        </>
      );
    })(),

    /* ---------------- duration ---------------- */
    duration: (
      <>
        <Nav title={MODE_NAMES[mode]} onBack={back} />
        <Progress step={2} />
        <Pad>
          <H2>How long?</H2>
          <Lede>The clock starts once everyone has paid in.</Lede>
          {DURATIONS.map((o) => (
            <Option key={o.d} title={o.t} desc={o.s} selected={o.d === days} onClick={() => setDays(o.d)} />
          ))}
          <Note style={{ marginTop: 26 }}>{goalText()} over {durText()} is {perDay()}.</Note>
          <CtaWrap><Cta onClick={afterDuration}>Continue</Cta></CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- charity ---------------- */
    charity: (
      <>
        <Nav title="Beat yourself" onBack={back} />
        <Progress step={3} />
        <Pad>
          <H2>Who gets the shortfall?</H2>
          <Lede>Finish and nothing moves. Fall short and the missed portion goes here.</Lede>
          {CHARITIES.map((c) => (
            <Option key={c.id} title={c.name} desc={c.meta} selected={c.id === charity} onClick={() => setCharity(c.id)} />
          ))}
          <CtaWrap><Cta onClick={() => go("stake")}>Continue</Cta></CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- payout ---------------- */
    payout: (() => {
      const rows = {
        winner: [["1st · Zahid", "$250"], ["2nd · You", "$0"], ["3rd · Pham", "$0"]],
        ranked: [["1st · Zahid", "$125"], ["2nd · You", "$75"], ["3rd · Pham", "$50"]],
        share: [["Zahid · 88% of goal", "$83"], ["You · 75% of goal", "$71"], ["Pham · 61% of goal", "$58"]],
        finish: [["Zahid · finished", "$125"], ["You · finished", "$125"], ["Pham · missed", "$0"]],
      }[payout];
      return (
        <>
          <Nav title="Beat your friends" onBack={back} />
          <Progress step={3} />
          <Pad>
            <H2>How does the pot get split?</H2>
            <Lede>Everyone sees this before they pay in. It can't change once the pact starts.</Lede>
            {PAYOUTS.map((p) => (
              <Option key={p.id} title={p.t} desc={p.d} selected={p.id === payout} onClick={() => setPayout(p.id)} />
            ))}
            <Eyebrow>Preview on a $250 pot</Eyebrow>
            {rows.map((r, i) => (
              <Row key={r[0]} last={i === rows.length - 1}>
                <div style={{ flex: 1, fontSize: 14.5, fontWeight: 400 }}>{r[0]}</div>
                <div style={{ fontSize: 14.5, fontWeight: 500, fontVariantNumeric: "tabular-nums", color: r[1] === "$0" ? T.dim : T.green }}>{r[1]}</div>
              </Row>
            ))}
            <CtaWrap><Cta onClick={() => go("friends")}>Continue</Cta></CtaWrap>
          </Pad>
        </>
      );
    })(),

    /* ---------------- friends ---------------- */
    friends: (
      <>
        <Nav title={MODE_NAMES[mode]} onBack={back}
          right={<button className="pact-tap" onClick={() => go("stake")} style={{ width: "auto", fontSize: 14, color: T.gray }}>Skip</button>} />
        <Progress step={4} />
        <Pad>
          <H2>{mode === 3 ? "Who are you up against?" : "Who's in?"}</H2>
          <Lede>
            {mode === 3 ? "Pick one person. They have to accept the goal and the rate first."
              : "Anyone without PACT gets a text with a link to join."}
          </Lede>
          {PEOPLE.map((p, i) => {
            const on = friends.includes(p.id);
            return (
              <Row key={p.id} onClick={() => toggleFriend(p.id)} last={i === PEOPLE.length - 1}>
                <Avatar init={p.init} on={on} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: on ? 500 : 400, color: on ? T.green : T.white }}>{p.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 400, color: T.gray, marginTop: 3 }}>{p.meta}</div>
                </div>
                <Tick on={on} />
              </Row>
            );
          })}
          <Note style={{ marginTop: 22 }}>Or invite by phone number — they'll get a text with a join link.</Note>
          <CtaWrap>
            <Cta onClick={() => go("stake")}>Continue</Cta>
            <Fine>
              {mode === 3
                ? (friends.length === 0 ? "Pick one person to go against" : "Going against " + friendNames())
                : (friends.length === 0 ? "No one invited yet" : `${friends.length} ${friends.length === 1 ? "person" : "people"} invited · ${friends.length + 1} runners total`)}
            </Fine>
          </CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- stake ---------------- */
    stake: (() => {
      const max = maxExposure();
      const lost = (max * (100 - whatIf)) / 100;
      const kept = max - lost;
      const pot = stake * (friends.length + 1);
      return (
        <>
          <Nav title={MODE_NAMES[mode]} onBack={back} />
          <Progress step={4} />
          <Pad>
            <H2>{mode === 2 ? "Set the buy-in" : mode === 3 ? "Set the rate" : "Set your stake"}</H2>
            <Lede>
              {mode === 2 ? "Everyone pays the same amount in. Nobody starts until it all clears."
                : mode === 3 ? "What each missing 1,000 steps costs. Charged only if you fall short."
                  : "Held on your card, charged only for what you miss."}
            </Lede>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 54, fontWeight: 250, letterSpacing: "-.026em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                ${mode === 3 ? rate : stake}
              </div>
              <div style={{ fontSize: 13, fontWeight: 400, color: T.gray, marginTop: 12 }}>
                {mode === 3 ? "per 1,000 steps you fall short" : mode === 2 ? `each · pot of ${money0(pot)}` : "held for the whole pact"}
              </div>
            </div>

            <input className="pact-range" type="range"
              value={mode === 3 ? rate : stake}
              min={mode === 3 ? 1 : 5} max={mode === 3 ? 20 : 300} step={mode === 3 ? 1 : 5}
              onChange={(e) => (mode === 3 ? setRate(Number(e.target.value)) : setStake(Number(e.target.value)))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.dim, marginBottom: 28 }}>
              <span>{mode === 3 ? "$1" : "$5"}</span><span>{mode === 3 ? "$20" : "$300"}</span>
            </div>

            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {(mode === 3 ? [1, 2, 5, 10] : [20, 50, 100, 200]).map((p) => (
                <Chip key={p} label={"$" + p} selected={p === (mode === 3 ? rate : stake)}
                  onClick={() => (mode === 3 ? setRate(p) : setStake(p))} />
              ))}
            </div>

            {mode === 2 ? (
              <>
                <Eyebrow>The pot</Eyebrow>
                <div style={{ display: "flex", gap: 20 }}>
                  <Stat v={money0(pot)} l="Total pot" color={T.green} />
                  <Stat v={"$" + stake} l="Each" />
                  <Stat v={friends.length + 1} l="Runners" />
                </div>
              </>
            ) : (
              <>
                <Eyebrow>If you finish at {whatIf}%</Eyebrow>
                <div style={{ height: 6, background: T.track, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: whatIf + "%", background: T.green }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: T.dim }}>You keep</div>
                    <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-.03em", color: T.green, marginTop: 5, fontVariantNumeric: "tabular-nums" }}>{money(kept)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: T.dim }}>{mode === 1 ? charityName() : friendNames() || "Your friend"} gets</div>
                    <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-.03em", color: T.orange, marginTop: 5, fontVariantNumeric: "tabular-nums" }}>{money(lost)}</div>
                  </div>
                </div>

                <div style={{ marginTop: 30 }}>
                  <Note>Drag to see other finishes</Note>
                  <input className="pact-range" type="range" min={0} max={100} value={whatIf} onChange={(e) => setWhatIf(Number(e.target.value))} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.dim }}>
                    <span>Missed it entirely</span><span>{whatIf}% of goal</span>
                  </div>
                </div>
              </>
            )}

            <CtaWrap><Cta onClick={() => go("review")}>Review pact</Cta></CtaWrap>
          </Pad>
        </>
      );
    })(),

    /* ---------------- review ---------------- */
    review: (() => {
      let rows = [], rule = "", lede = "";
      if (mode === 1) {
        lede = "Last look before anything is held.";
        rows = [["Goal", goalText()], ["Length", durText()], ["A day", perDay()], ["Stake held", "$" + stake],
        ["Shortfall goes to", charityName()], ["Conditions", conditions ? "Counted" : "Off"]];
        rule = `Finish and nothing is charged — the hold is released. Fall short and you are charged the same share you missed. Hit 80% of ${goalText()} and ${money(stake * 0.2)} goes to ${charityName()}; you keep ${money(stake * 0.8)}.`;
      } else if (mode === 2) {
        const pot = stake * (friends.length + 1);
        lede = "Everyone sees these terms before they pay in.";
        rows = [["Goal", goalText() + " each"], ["Length", durText()], ["Split", payoutName()],
        ["Runners", friends.length ? `${friends.length + 1} · you, ${friendNames()}` : "1 · just you so far"],
        ["Buy-in", "$" + stake + " each"], ["Pot", money0(pot)]];
        rule = `Everyone stakes $${stake}, making a pot of ${money0(pot)}. ` + {
          winner: "Whoever covers the most distance takes all of it.",
          ranked: "The top three split it 50 / 30 / 20.",
          share: "Each runner gets back a share matching how much of the goal they completed.",
          finish: `Everyone who reaches ${goalText()} splits the pot evenly. Miss it and your buy-in stays in.`,
        }[payout];
      } else {
        lede = "Both of you have to accept before the clock starts.";
        rows = [["Shared goal", goalText() + " each"], ["Length", durText()], ["A day", perDay()],
        ["Rate", "$" + rate + " per 1,000 missed"], ["Against", friendNames() || "Not picked yet"],
        ["Most you can lose", money0(maxExposure())]];
        rule = `There is no pot. At the end, each of you owes $${rate} for every 1,000 steps you came up short, and only the difference changes hands — if you owe $17 and they owe $22, they pay you $5.`;
      }
      return (
        <>
          <Nav title="Review" onBack={back} />
          <Progress step={5} />
          <Pad>
            <H2>{MODE_NAMES[mode]}</H2>
            <Lede>{lede}</Lede>
            {rows.map((r, i) => (
              <Row key={r[0]} last={i === rows.length - 1}>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 400, color: T.gray }}>{r[0]}</div>
                <div style={{ fontSize: 14, fontWeight: 500, textAlign: "right" }}>{r[1]}</div>
              </Row>
            ))}
            <Eyebrow>Conditions</Eyebrow>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 400 }}>Count conditions</div>
                <div style={{ fontSize: 12.5, color: T.gray, marginTop: 4, lineHeight: 1.5 }}>
                  Hills, rain and early starts multiply what a run adds. Highest one applies.
                </div>
              </div>
              <Switch on={conditions} onClick={() => setConditions(!conditions)} />
            </div>
            <button className="pact-tap" onClick={() => go("conditions")}
              style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, fontSize: 13, color: T.gray }}>
              <span style={{ flex: 1 }}>See every multiplier</span><Chevron />
            </button>

            <Eyebrow>The rule</Eyebrow>
            <Note>{rule}</Note>
            <CtaWrap>
              <Cta onClick={() => go("done")}>Start pact</Cta>
              <Fine>Cancel free within 24 hours. After that the stake is locked until the pact ends.</Fine>
            </CtaWrap>
          </Pad>
        </>
      );
    })(),

    /* ---------------- done ---------------- */
    done: (
      <Pad>
        <div style={{ paddingTop: 130, textAlign: "center" }}>
          <svg width="52" height="52" viewBox="0 0 52 52" style={{ marginBottom: 30 }}>
            <circle cx="26" cy="26" r="25" fill="none" stroke={T.green} strokeWidth="1" opacity=".4" />
            <path d="M17 26.5 23 32.5 35 19.5" fill="none" stroke={T.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <H1>You're in</H1>
          <div style={{ maxWidth: 270, margin: "0 auto" }}>
            <Lede bottom={0}>
              {mode === 1 ? `Your ${durText()} pact is live. $${stake} is held — finish ${goalText()} and you keep all of it.`
                : mode === 2 ? `${friends.length ? friendNames() + " will get a text with the join link. " : ""}The clock starts once everyone has paid in.`
                  : `${friendNames() || "Your friend"} has to accept the goal and the rate. You'll get a notification either way.`}
            </Lede>
          </div>
          <div style={{ marginTop: 44, paddingBottom: 30 }}>
            <Cta onClick={openLive}>See the pact</Cta>
            <Cta variant="ghost" onClick={() => root("home")}>Back to home</Cta>
          </div>
        </div>
      </Pad>
    ),

    /* ---------------- live 1 ---------------- */
    live1: (
      <>
        <Nav title="Weekly pact" onBack={back} right={<button className="pact-tap" style={{ width: "auto", fontSize: 14, color: T.gray }}>Edit</button>} />
        <Pad>
          <div style={{ padding: "6px 0 30px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.dim }}>Solo · Red Cross</div>
            <div style={{ fontSize: 21, fontWeight: 400, letterSpacing: "-.026em", marginTop: 13 }}>50,000 steps this week</div>
            <Note style={{ marginTop: 6 }}>Ends Sunday, 11:59pm</Note>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
            <div style={{ fontSize: 46, fontWeight: 250, letterSpacing: "-.028em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>37,000</div>
            <div style={{ fontSize: 14, color: T.gray }}>of 50,000</div>
          </div>
          <Bar pct={74} top={20} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12.5, color: T.dim }}>
            <span>74% complete</span><span>4,334 a day to finish</span>
          </div>

          <Eyebrow>If it ended now</Eyebrow>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, color: T.dim }}>You keep</div>
              <div style={{ fontSize: 24, fontWeight: 400, letterSpacing: "-.03em", color: T.green, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>$37.00</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: T.dim }}>At risk</div>
              <div style={{ fontSize: 24, fontWeight: 400, letterSpacing: "-.03em", color: T.orange, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>$13.00</div>
            </div>
          </div>

          <Eyebrow>Open now</Eyebrow>
          <WindowRow timeLeft={shortLeft} onClick={() => go("challenge")}
            worth="6,500 steps in the rain finishes this pact" />

          <Eyebrow>This week</Eyebrow>
          {[["Mon", "6,204", 41, true], ["Tue", "9,880", 66, false], ["Wed", "12,412", 83, false], ["Thu", "8,504", 57, true]].map((d, i) => (
            <Row key={d[0]} last={i === 3}>
              <div style={{ width: 34, fontSize: 12.5, color: T.dim }}>{d[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 400, fontVariantNumeric: "tabular-nums" }}>{d[1]}</div>
                <Bar pct={d[2]} dim={d[3]} h={2} top={9} />
              </div>
            </Row>
          ))}

          <CtaWrap>
            <Cta onClick={() => go("run")}>Start a run</Cta>
            <Cta variant="quiet" onClick={() => root("home")}>Give up and pay now</Cta>
          </CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- live 2 ---------------- */
    live2: (
      <>
        <Nav title="Group pact" onBack={back} right={<button className="pact-tap" style={{ width: "auto", fontSize: 14, color: T.gray }}>Share</button>} />
        <Pad>
          <div style={{ padding: "6px 0 28px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.dim }}>Winner takes all</div>
            <div style={{ fontSize: 21, fontWeight: 400, letterSpacing: "-.026em", marginTop: 13 }}>July 100 km club</div>
            <Note style={{ marginTop: 6 }}>100 km each · 11 days left</Note>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <Stat v="$250" l="In the pot" color={T.green} />
            <Stat v="$50" l="Each" />
            <Stat v="2nd" l="Your place" />
          </div>

          <Eyebrow>Leaderboard</Eyebrow>
          {[["1", "ZI", "Zahid Ibrahim", "88 km", 88, false, false],
          ["2", "TM", "You", "75 km", 75, false, true],
          ["3", "PH", "Pham Hanni", "61 km", 61, true, false],
          ["4", "SM", "Sam Mendel", "44 km", 44, true, false],
          ["5", "JK", "Jules Kim", "12 km", 12, true, false]].map((r, i) => (
            <Row key={r[0]} last={i === 4}>
              <div style={{ width: 14, fontSize: 12.5, color: T.dim, fontVariantNumeric: "tabular-nums" }}>{r[0]}</div>
              <Avatar init={r[1]} on={r[6]} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: r[6] ? 500 : 400 }}>{r[2]}</div>
                <Bar pct={r[4]} dim={r[5]} h={2} top={9} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: r[6] ? 500 : 400, fontVariantNumeric: "tabular-nums" }}>{r[3]}</div>
            </Row>
          ))}

          <Eyebrow>Open now</Eyebrow>
          <WindowRow timeLeft={shortLeft} onClick={() => go("challenge")}
            worth="12.5 km in the rain puts you first" />

          <Eyebrow>Plays</Eyebrow>
          <button className="pact-tap" onClick={() => go("plays")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1, fontSize: 14.5, fontWeight: 400 }}>2 to spend in this pact</div>
              <Chevron />
            </div>
            <div style={{ marginTop: 14 }}><Streak done={4} of={7} /></div>
            <div style={{ fontSize: 12, color: T.gray, marginTop: 11, paddingBottom: 4 }}>
              4 of 7 days hit. Three more earns another.
            </div>
          </button>
          <div style={{ height: 8 }} />
          {PLAY_LOG.map((r, i) => (
            <Row key={r[0]} last={i === PLAY_LOG.length - 1}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 400 }}>{r[0]}</div>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 3 }}>{r[1]}</div>
              </div>
              <div style={{ fontSize: 13.5, color: T.gray, fontVariantNumeric: "tabular-nums" }}>{r[2]}</div>
            </Row>
          ))}

          <Eyebrow>If it ended today</Eyebrow>
          <Note>Zahid takes the full $250. You're 13 km behind — about 1.2 km a day to overtake him.</Note>

          <CtaWrap>
            <Cta onClick={() => go("run")}>Start a run</Cta>
            <Cta variant="ghost">Invite more friends</Cta>
          </CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- live 3 ---------------- */
    live3: (
      <>
        <Nav title="Head to head" onBack={back} right={<button className="pact-tap" style={{ width: "auto", fontSize: 14, color: T.gray }}>Nudge</button>} />
        <Pad>
          <div style={{ padding: "6px 0 30px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.dim }}>Pay your friend</div>
            <div style={{ fontSize: 21, fontWeight: 400, letterSpacing: "-.026em", marginTop: 13 }}>You vs Zahid</div>
            <Note style={{ marginTop: 6 }}>70,000 steps each · $2 per 1,000 missed</Note>
          </div>

          <div style={{ textAlign: "center", padding: "4px 0 8px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.dim }}>Settles at</div>
            <div style={{ fontSize: 44, fontWeight: 250, letterSpacing: "-.028em", color: T.green, margin: "14px 0 12px", fontVariantNumeric: "tabular-nums" }}>+$5.20</div>
            <Note>Zahid pays you the difference on Sunday.<br />Only the gap changes hands.</Note>
          </div>

          <Eyebrow>Where you both stand</Eyebrow>
          {[["TM", "You", "61,400 · 8,600 short", "$17.20", 88, true],
          ["ZI", "Zahid", "58,800 · 11,200 short", "$22.40", 84, false]].map((r, i) => (
            <Row key={r[0]} last={i === 1}>
              <Avatar init={r[0]} on={r[5]} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: r[5] ? 500 : 400 }}>{r[1]}</div>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>{r[2]}</div>
                <Bar pct={r[4]} dim={!r[5]} h={2} top={9} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 500, color: T.orange, fontVariantNumeric: "tabular-nums" }}>{r[3]}</div>
            </Row>
          ))}

          <Eyebrow>Open now</Eyebrow>
          <WindowRow timeLeft={shortLeft} onClick={() => go("challenge")}
            worth="4,300 steps in the rain clears what you owe" />

          <Eyebrow>Last 5 days</Eyebrow>
          <svg viewBox="0 0 300 88" style={{ width: "100%", height: 88 }}>
            <polyline points="8,70 78,55 148,42 218,34 292,20" fill="none" stroke={T.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="8,76 78,63 148,55 218,42 292,32" fill="none" stroke="#5A5A5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="292" cy="20" r="3" fill={T.green} /><circle cx="292" cy="32" r="3" fill="#5A5A5E" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.dim }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => <span key={d}>{d}</span>)}
          </div>

          <CtaWrap><Cta onClick={() => go("run")}>Start a run</Cta></CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- run summary ---------------- */
    run: (
      <>
        <Nav title="" onBack={back} backGlyph="Close" right={<button className="pact-tap" style={{ width: "auto", fontSize: 14, color: T.gray }}>Share</button>} />
        <Pad>
          <Note style={{ marginBottom: 18 }}>Today, 6:42am · Surry Hills loop</Note>
          <div style={{ borderRadius: 16, overflow: "hidden", background: "#131316", position: "relative" }}>
            <svg viewBox="0 0 350 240" style={{ width: "100%", display: "block" }}>
              <g stroke="#212124" strokeWidth="1">
                <path d="M0 58H350M0 124H350M0 190H350M70 0V240M150 0V240M235 0V240M300 0V240" />
              </g>
              <path d="M62 190 C62 156 74 138 108 130 C150 120 168 94 160 64 C154 44 178 34 206 44 C238 56 262 82 258 116 C254 148 226 164 190 172 C150 181 120 194 104 208 C90 220 68 218 62 190Z"
                fill="none" stroke={T.green} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="62" cy="190" r="5" fill="#131316" stroke={T.green} strokeWidth="2.2" />
              <circle cx="206" cy="44" r="5" fill={T.green} />
            </svg>
            <div style={{ position: "absolute", left: 10, bottom: 8, fontSize: 9.5, color: "#6A6A6E" }}>Map data</div>
          </div>

          <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
            <Stat v="6.71" l="km" /><Stat v="34:12" l="Time" /><Stat v="5:06" l="/km" /><Stat v="7,940" l="Steps" />
          </div>

          <Eyebrow>Rain window</Eyebrow>
          <Row onClick={() => go("conditions")}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 400 }}>Caught it with 1h 52m to spare</div>
              <div style={{ fontSize: 12, color: T.gray, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>
                7,940 steps counted as 15,880
              </div>
            </div>
            <Multiplier v="2" />
            <Chevron />
          </Row>
          <div style={{ paddingTop: 16 }}>
            <Clip caption="Sent to Zahid, Pham and 3 others" />
          </div>

          <Eyebrow>What this run moved</Eyebrow>
          {[["Weekly pact", "74% → 100% · pact complete", "$50 kept", 100, T.green],
          ["July 100 km club", "75 → 88.4 km · now 1st", "ahead by 0.4 km", 88, T.green]].map((r, i) => (
            <Row key={r[0]} last={i === 1}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{r[0]}</div>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 3 }}>{r[1]}</div>
                <Bar pct={r[3]} h={2} top={9} />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 400, color: r[4] }}>{r[2]}</div>
            </Row>
          ))}

          <CtaWrap><Cta onClick={() => root("home")}>Done</Cta></CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- challenge ---------------- */
    challenge: (
      <>
        <Nav title="" onBack={back} backGlyph="Close" />
        <div style={{
          padding: "6px 22px 34px",
          background: "radial-gradient(90% 55% at 50% 0%, rgba(0,224,122,.16) 0%, rgba(0,224,122,.04) 55%, rgba(0,0,0,0) 100%)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.green }}>
            Rain · window open
          </div>
          <div style={{ fontSize: 76, fontWeight: 250, letterSpacing: "-.04em", lineHeight: 1, color: T.green, margin: "20px 0 4px" }}>2×</div>
          <div style={{ fontSize: 27, fontWeight: 400, letterSpacing: "-.022em", lineHeight: 1.25, marginTop: 18 }}>
            It's raining in<br />Surry Hills
          </div>
          <div style={{ fontSize: 14, color: T.gray, lineHeight: 1.6, marginTop: 14, maxWidth: 300 }}>
            Anything you log before the rain stops counts double toward every pact you're in.
          </div>
        </div>

        <Pad>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, paddingBottom: 4 }}>
            <div style={{ fontSize: 34, fontWeight: 250, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" }}>
              {hh}:{pad(mm)}:{pad(ss)}
            </div>
            <div style={{ fontSize: 12.5, color: T.gray }}>left in this window</div>
          </div>

          <Eyebrow>Prove it</Eyebrow>
          <Note style={{ marginBottom: 18 }}>
            Two seconds of video, sent to the people in your pacts. Not a public feed — just them.
          </Note>
          <Clip tall caption="Zahid · 41 minutes ago" />

          <Eyebrow>What it's worth</Eyebrow>
          {[["Weekly pact", "13,000 steps left", "6,500 in the rain"],
          ["July 100 km club", "25 km behind Zahid", "12.5 km in the rain"]].map((r, i) => (
            <Row key={r[0]} last={i === 1}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 400 }}>{r[0]}</div>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 3 }}>{r[1]}</div>
              </div>
              <div style={{ fontSize: 13.5, color: T.green, fontVariantNumeric: "tabular-nums" }}>{r[2]}</div>
            </Row>
          ))}

          <CtaWrap>
            <Cta onClick={() => go("run")}>Record 2 seconds and go</Cta>
            <Cta variant="ghost" onClick={() => back()}>Not this one</Cta>
          </CtaWrap>
        </Pad>
      </>
    ),

    /* ---------------- plays ---------------- */
    plays: (
      <>
        <Nav title="" onBack={back} backGlyph="Close" />
        <Pad>
          <div style={{ padding: "18px 0 0" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.dim }}>
              July 100 km club
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 11, marginTop: 16 }}>
              <div style={{ fontSize: 54, fontWeight: 250, letterSpacing: "-.026em", lineHeight: 1, color: T.green }}>2</div>
              <div style={{ fontSize: 14, color: T.gray }}>plays to spend here</div>
            </div>
            <div style={{ fontSize: 14, color: T.gray, lineHeight: 1.6, marginTop: 16, maxWidth: 302 }}>
              Seven days without missing your target in this pact earns one. You're four days in.
            </div>
            <div style={{ marginTop: 18 }}><Streak done={4} of={7} /></div>
          </div>

          <Eyebrow>Yours</Eyebrow>
          {PLAYS.filter((x) => x.owned).map((x, i, arr) => (
            <Row key={x.id} onClick={() => { setPlayPicked(x.id); go("playTarget"); }} last={i === arr.length - 1}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 400 }}>{x.name}</div>
                <div style={{ fontSize: 12.5, color: T.gray, marginTop: 4 }}>{x.short}</div>
              </div>
              <div style={{ fontSize: 21, fontWeight: 250, color: T.green, fontVariantNumeric: "tabular-nums" }}>×{x.owned}</div>
              <Chevron />
            </Row>
          ))}

          <Eyebrow>Locked</Eyebrow>
          {PLAYS.filter((x) => !x.owned).map((x, i, arr) => (
            <Row key={x.id} last={i === arr.length - 1}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 400, color: T.dim }}>{x.name}</div>
                <div style={{ fontSize: 12.5, color: T.dim, marginTop: 4 }}>{x.short}</div>
              </div>
              <div style={{ fontSize: 12, color: T.dim }}>{x.unlock}</div>
            </Row>
          ))}

          <Eyebrow>The rules</Eyebrow>
          <Note>
            A play moves progress, never money. Nobody can be made to owe more than they signed up for —
            the worst a play does is make the goal harder to reach.
          </Note>
          <Note style={{ marginTop: 16 }}>
            Everyone in the pact sees who played what, the moment it happens. One play per person per pact,
            so nobody gets ganged up on, and none of them work in the last 24 hours.
          </Note>
          <Note style={{ marginTop: 16 }}>
            Plays are earned inside a pact and stay there. When it ends, anything unspent goes with it.
          </Note>

          <div style={{ height: 40 }} />
        </Pad>
      </>
    ),

    /* ---------------- play a card ---------------- */
    playTarget: (() => {
      const play = PLAYS.find((x) => x.id === playPicked) || PLAYS[0];
      const board = [["zi", "ZI", "Zahid Ibrahim", "88 km · 1st"],
      ["ph", "PH", "Pham Hanni", "61 km · 3rd"],
      ["sm", "SM", "Sam Mendel", "44 km · 4th"],
      ["jk", "JK", "Jules Kim", "12 km · 5th"]];
      return (
        <>
          <Nav title="" onBack={back} />
          <Pad>
            <div style={{ padding: "12px 0 0" }}>
              <div style={{ fontSize: 27, fontWeight: 400, letterSpacing: "-.022em" }}>{play.name}</div>
              <div style={{ fontSize: 14, color: T.gray, lineHeight: 1.6, marginTop: 14, maxWidth: 302 }}>{play.desc}</div>
            </div>

            <Eyebrow>Who</Eyebrow>
            {board.map((r, i) => {
              const on = playTargetId === r[0];
              const blocked = play.id === "skim" && i !== 0;
              return (
                <Row key={r[0]} onClick={blocked ? undefined : () => setPlayTargetId(r[0])} last={i === board.length - 1}>
                  <Avatar init={r[1]} on={on} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 400, color: blocked ? T.dim : on ? T.green : T.white }}>{r[2]}</div>
                    <div style={{ fontSize: 12, color: T.dim, marginTop: 3 }}>{blocked ? "Skim only works on whoever is first" : r[3]}</div>
                  </div>
                  {blocked ? null : <Tick on={on} />}
                </Row>
              );
            })}

            <Eyebrow>What happens</Eyebrow>
            <Note>
              {play.id === "skim"
                ? "Zahid drops to 83.6 km and you go to 79.4 km. He gets a notification naming you, and it sits in the pact's history until the end."
                : "It starts the moment you play it, and everyone in the pact can see it running."}
            </Note>

            <CtaWrap>
              <Cta onClick={() => back()}>Play it</Cta>
              <Fine>Can't be undone. You'll have one play left.</Fine>
            </CtaWrap>
          </Pad>
        </>
      );
    })(),

    /* ---------------- conditions ---------------- */
    conditions: (
      <>
        <Nav title="" onBack={back} backGlyph="Close" />
        <Pad>
          <div style={{ padding: "18px 0 0" }}>
            <div style={{ fontSize: 27, fontWeight: 400, letterSpacing: "-.022em", lineHeight: 1.2 }}>Windows</div>
            <div style={{ fontSize: 14, color: T.gray, lineHeight: 1.6, marginTop: 16, maxWidth: 302 }}>
              When the weather turns, a window opens and the app tells you. Run inside it and what you log
              counts for more in every pact you're in — toward the same goal, so there's no second score
              to keep track of.
            </div>
          </div>

          <Eyebrow>What opens one</Eyebrow>
          {CONDITIONS.map((c, i) => (
            <Row key={c.id} last={i === CONDITIONS.length - 1}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 400 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 3 }}>{c.meta}</div>
              </div>
              <Multiplier v={c.mult} />
            </Row>
          ))}

          <Eyebrow>The rules</Eyebrow>
          <Note>
            A window lasts as long as the weather does, up to three hours, and you have to start inside it.
            Only one applies per run, whichever is highest — a rainy hill run counts at 2×, not 3×.
          </Note>
          <Note style={{ marginTop: 16 }}>
            In a pact with other people, a window needs two seconds of video to count. Weather and elevation
            are read from your location as you run, so neither can be set by hand.
          </Note>

          <div style={{ height: 40 }} />
        </Pad>
      </>
    ),

    /* ---------------- feed ---------------- */
    feed: (
      <>
        <Nav big title="Feed" />
        <Pad>
          <div style={{ padding: "16px 0 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Avatar init="ZI" />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>Zahid Ibrahim</div>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 3 }}>Morning run · 14.03 km · 2h ago</div>
              </div>
            </div>
            <div style={{ margin: "18px 0" }}>
              <Clip />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: T.green }}>Rain window</div>
              <Multiplier v="2" />
            </div>
            <Note style={{ marginTop: 10 }}>Went out in it. Took the lead in July 100 km club — 88 km.</Note>
          </div>
          <Hair />
          <div style={{ padding: "26px 0 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Avatar init="PH" />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>Pham Hanni</div>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 3 }}>Evening walk · 3.03 km · yesterday</div>
              </div>
            </div>
            <Note style={{ marginTop: 16 }}>Finished a solo pact. $40 kept, $10 to Ocean Cleanup.</Note>
          </div>
        </Pad>
      </>
    ),

    /* ---------------- profile ---------------- */
    profile: (
      <>
        <Nav big title="Profile" right={<button className="pact-tap" style={{ width: "auto", fontSize: 14, color: T.gray }}>Settings</button>} />
        <Pad>
          <div style={{ display: "flex", alignItems: "center", gap: 15, padding: "16px 0 32px" }}>
            <Avatar init="TM" on size={56} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-.024em" }}>Tirta Mandira</div>
              <div style={{ fontSize: 13, color: T.gray, marginTop: 4 }}>Sydney · running since 2021</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <Stat v="$412" l="Kept this year" color={T.green} />
            <Stat v="$68" l="Donated" color={T.orange} />
            <Stat v="14" l="Pacts won" />
          </div>

          <Eyebrow>Longest streak</Eyebrow>
          <div style={{ display: "flex", alignItems: "baseline", gap: 11 }}>
            <div style={{ fontSize: 34, fontWeight: 250, letterSpacing: "-.024em", fontVariantNumeric: "tabular-nums" }}>23</div>
            <div style={{ fontSize: 13, color: T.gray }}>days, set in March</div>
          </div>

          <Eyebrow>Distance this month</Eyebrow>
          <div style={{ fontSize: 34, fontWeight: 250, letterSpacing: "-.024em", fontVariantNumeric: "tabular-nums" }}>
            81.7 <span style={{ fontSize: 14, fontWeight: 400, color: T.gray }}>km</span>
          </div>
          <svg viewBox="0 0 300 92" style={{ width: "100%", height: 92, marginTop: 14 }}>
            <line x1="0" y1="18" x2="300" y2="18" stroke="#212124" />
            <line x1="0" y1="54" x2="300" y2="54" stroke="#212124" />
            <line x1="0" y1="88" x2="300" y2="88" stroke="#212124" />
            <polyline points="8,84 56,72 104,74 152,50 200,42 248,26 292,14" fill="none" stroke={T.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="292" cy="14" r="3" fill={T.green} />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.dim }}>
            {["W1", "W2", "W3", "W4"].map((w) => <span key={w}>{w}</span>)}
          </div>

          <Eyebrow>Past pacts</Eyebrow>
          {[["June step pact", "280,000 steps · finished", "$60 kept", T.green],
          ["May 5 km sprint", "4th of 6", "−$25", T.orange],
          ["Zahid rematch", "Head to head", "+$14", T.green]].map((r, i) => (
            <Row key={r[0]} last={i === 2}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{r[0]}</div>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 3 }}>{r[1]}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 400, color: r[3] }}>{r[2]}</div>
            </Row>
          ))}
          <div style={{ height: 40 }} />
        </Pad>
      </>
    ),

  };

  /* -------------------------------- chrome -------------------------------- */

  const TabIcon = ({ name, on }) => {
    const c = on ? T.green : T.dim;
    const p = { fill: "none", stroke: c, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
    if (name === "home") return <svg width="23" height="23" viewBox="0 0 24 24"><path {...p} d="M3.5 10.6 12 3.7l8.5 6.9V20a.8.8 0 0 1-.8.8h-4.5v-5.6H8.8v5.6H4.3a.8.8 0 0 1-.8-.8z" /></svg>;
    if (name === "pacts") return <svg width="23" height="23" viewBox="0 0 24 24"><path {...p} d="M7.5 4h9v3.6a4.5 4.5 0 0 1-9 0zM7.5 5.4H4.8v.9a3 3 0 0 0 2.9 3M16.5 5.4h2.7v.9a3 3 0 0 1-2.9 3M12 12.2V16M8.6 20.3h6.8M10.3 20.3V17h3.4v3.3" /></svg>;
    if (name === "feed") return <svg width="23" height="23" viewBox="0 0 24 24"><rect {...p} x="3.6" y="4.2" width="16.8" height="15.6" rx="2.4" /><path {...p} d="M7.4 9h9.2M7.4 12.6h9.2M7.4 16.2h5.4" /></svg>;
    return <svg width="23" height="23" viewBox="0 0 24 24"><circle {...p} cx="12" cy="8.2" r="3.4" /><path {...p} d="M5 20c.9-3.5 3.7-5.3 7-5.3s6.1 1.8 7 5.3" /></svg>;
  };

  const Tab = ({ id, name, label }) => {
    const on = screen === id;
    return (
      <button className="pact-tap" onClick={() => root(id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: "auto" }}>
        <TabIcon name={name} on={on} />
        <span style={{ fontSize: 9.5, fontWeight: 400, color: on ? T.green : T.dim }}>{label}</span>
      </button>
    );
  };

  return (
    <div className="pact-app">
      <style>{CSS}</style>

      {/* screen */}
      <div className="pact-body" key={screen}>
        {screens[screen]}
      </div>

      {/* tab bar */}
      <div className="pact-tabs">
        <Tab id="home" name="home" label="Home" />
        <Tab id="modes" name="pacts" label="Pacts" />
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <button className="pact-tap" onClick={() => go("run")} style={{
            width: 50, height: 50, borderRadius: "50%", background: T.green,
            display: "flex", alignItems: "center", justifyContent: "center", marginTop: -11,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00160C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="14.2" cy="4.6" r="1.8" fill="#00160C" stroke="none" />
              <path d="M8 21l2.6-5.4-2.4-2.6.8-4.4 3.6-1.6 3 2.6 2.8 1M8.2 8.6 5 10.2M10.6 15.6l3.9 1.3 1.7 3.9" />
            </svg>
          </button>
        </div>
        <Tab id="feed" name="feed" label="Feed" />
        <Tab id="profile" name="profile" label="Profile" />
      </div>
    </div>
  );
}
