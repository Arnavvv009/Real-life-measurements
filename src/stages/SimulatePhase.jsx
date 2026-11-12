import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { narrate } from '../utils/audio.js';
import { simulateStationIntro, simulateActivityNarration, simulateHintNarration, feedbackNarration } from '../utils/narration.js';

/* =========================================================================
   SIMULATION STATIONS — Units & Real-Life Measurement (Grade 8)
   Station 1 · Unit Ladder        → SEE the decimal point slide between units
   Station 2 · Measure It         → TRY it: balance, pour and cut to a target
   Station 3 · Real-Life Planner  → APPLY units in multi-step problems
   ========================================================================= */

const close = (a, b) => Math.abs(a - b) < 0.0011;
const nice = n => Number(n.toFixed(4)).toLocaleString('en-US', { maximumFractionDigits: 4 });

/* ------------------------------------------------------------------------
   STATION DATA
   ------------------------------------------------------------------------ */
const LADDERS = {
  length: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'],
  mass: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'],
  capacity: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL']
};
const COMMON = ['km', 'm', 'cm', 'mm', 'kg', 'g', 'mg', 'kL', 'L', 'mL'];

const STATION_ACTIVITIES = {
  1: [
    {
      id: 1,
      title: "Activity 1: The Walk to School",
      desc: "Leo's walk to school is 2.5 km. His fitness app counts in metres. Move down the ladder from km to m, pick the rule, then write the distance in metres.",
      icon: "🚶",
      ladder: 'length',
      digits: { 0: 2, 1: 5 },
      start: 0,
      target: 3,
      op: '× 1000',
      answer: 2500,
      hint: "From km down to m is 3 steps. Each step down multiplies by 10: 10 × 10 × 10 = 1000."
    },
    {
      id: 2,
      title: "Activity 2: Market Watermelon",
      desc: "A watermelon has a mass of 4750 g. The price label needs kilograms. Move UP the ladder from g to kg, pick the rule, then write the mass in kg.",
      icon: "🍉",
      ladder: 'mass',
      digits: { 0: 4, 1: 7, 2: 5, 3: 0 },
      start: 3,
      target: 0,
      op: '÷ 1000',
      answer: 4.75,
      hint: "Going up to a bigger unit divides. g to kg is 3 steps up: ÷ 1000."
    },
    {
      id: 3,
      title: "Activity 3: Juice Bottle",
      desc: "A bottle holds 1.25 L of juice. A recipe asks for millilitres. Move from L to mL, pick the rule, then write the amount in mL.",
      icon: "🧃",
      ladder: 'capacity',
      digits: { 3: 1, 4: 2, 5: 5 },
      start: 3,
      target: 6,
      op: '× 1000',
      answer: 1250,
      hint: "L down to mL is 3 steps: × 1000. The decimal point jumps 3 places right."
    }
  ],
  2: [
    {
      id: 1,
      title: "Activity 1: Balance the Pumpkin",
      desc: "A pumpkin has a mass of 3 kg 250 g. Add weights to the scale until it balances exactly. Then write the mass in grams and in kilograms.",
      icon: "🎃",
      kind: 'mass',
      target: 3250,
      unit: 'g',
      pieces: [1000, 500, 200, 100, 50],
      label: v => (v >= 1000 ? `${v / 1000} kg` : `${v} g`),
      groups: [
        { label: 'In grams', formula: '3 kg 250 g =', answer: 3250, unit: 'g' },
        { label: 'In kilograms', formula: '3250 g =', answer: 3.25, unit: 'kg' }
      ],
      hint: "1 kg = 1000 g. You need 3 × 1 kg, then 250 g more (200 g + 50 g)."
    },
    {
      id: 2,
      title: "Activity 2: Party Punch Bowl",
      desc: "The punch bowl needs exactly 1 L 750 mL of juice. Pour from the measuring cups until you hit the line. Then write the amount in mL and in L.",
      icon: "🥤",
      kind: 'capacity',
      target: 1750,
      unit: 'mL',
      pieces: [500, 250, 100],
      label: v => `${v} mL`,
      groups: [
        { label: 'In millilitres', formula: '1 L 750 mL =', answer: 1750, unit: 'mL' },
        { label: 'In litres', formula: '1750 mL =', answer: 1.75, unit: 'L' }
      ],
      hint: "1 L = 1000 mL. 500 + 500 + 500 + 250 = 1750 mL works!"
    },
    {
      id: 3,
      title: "Activity 3: Gift Ribbon",
      desc: "Chloe needs 2 m 35 cm of ribbon. Join pieces along the measuring tape until you reach the mark. Then write the length in cm and in m.",
      icon: "🎀",
      kind: 'length',
      target: 235,
      unit: 'cm',
      pieces: [100, 50, 20, 5],
      label: v => (v >= 100 ? `${v / 100} m` : `${v} cm`),
      groups: [
        { label: 'In centimetres', formula: '2 m 35 cm =', answer: 235, unit: 'cm' },
        { label: 'In metres', formula: '235 cm =', answer: 2.35, unit: 'm' }
      ],
      hint: "1 m = 100 cm. Two 1 m pieces, then 35 cm more (20 + 5 + 5 + 5)."
    }
  ],
  3: [
    {
      id: 1,
      title: "Activity 1: Express Train",
      desc: "A train travels 180 km in 2 hours 30 minutes. Find its average speed in km/h, then change it into metres per second.",
      icon: "🚆",
      type: 'train',
      steps: [
        { text: "2 h 30 min in hours =", answer: 2.5, unit: "h" },
        { text: "Speed = 180 ÷ 2.5 =", answer: 72, unit: "km/h" },
        { text: "72 km in metres =", answer: 72000, unit: "m" },
        { text: "72 000 m ÷ 3600 s =", answer: 20, unit: "m/s" }
      ],
      hint: "30 minutes is half an hour. 1 hour = 60 × 60 = 3600 seconds."
    },
    {
      id: 2,
      title: "Activity 2: Tiling the Kitchen",
      desc: "A kitchen floor is 3 m by 2 m. Square tiles are 20 cm by 20 cm. How many tiles cover the floor? Convert to the same unit first!",
      icon: "🧱",
      type: 'tiles',
      steps: [
        { text: "3 m in centimetres =", answer: 300, unit: "cm" },
        { text: "Tiles along 300 cm = 300 ÷ 20 =", answer: 15, unit: "tiles" },
        { text: "Tiles across 2 m = 200 ÷ 20 =", answer: 10, unit: "tiles" },
        { text: "Total tiles = 15 × 10 =", answer: 150, unit: "tiles" }
      ],
      hint: "Change metres to centimetres (× 100), then see how many 20 cm tiles fit each way."
    },
    {
      id: 3,
      title: "Activity 3: Water Cooler",
      desc: "A water cooler bottle holds 18.9 L. Each paper cup holds 350 mL. How many cups can be filled, and how many people get 2 cups each?",
      icon: "💧",
      type: 'water',
      steps: [
        { text: "18.9 L in millilitres =", answer: 18900, unit: "mL" },
        { text: "Cups = 18 900 ÷ 350 =", answer: 54, unit: "cups" },
        { text: "People with 2 cups = 54 ÷ 2 =", answer: 27, unit: "people" }
      ],
      hint: "L to mL: × 1000. Then share the mL equally into 350 mL cups."
    }
  ]
};

/** Read the place-value chart: digits stay fixed, the decimal point sits after column u. */
function readChart(digits, u) {
  const cols = Object.keys(digits).map(Number);
  const first = Math.min(...cols, u);
  const last = Math.max(...cols);
  let int = '';
  for (let c = first; c <= u; c++) int += digits[c] ?? 0;
  let frac = '';
  for (let c = u + 1; c <= last; c++) frac += digits[c] ?? 0;
  int = int.replace(/^0+(?=\d)/, '');
  frac = frac.replace(/0+$/, '');
  return frac ? `${int}.${frac}` : int;
}

/* ------------------------------------------------------------------------
   STATION 1 — UNIT LADDER + PLACE-VALUE CHART
   ------------------------------------------------------------------------ */
function LadderCanvas({ act, u }) {
  const VW = 420, VH = 300;
  const units = LADDERS[act.ladder];
  const rungY = i => 34 + i * 36;
  const value = readChart(act.digits, u);
  const cols = Object.keys(act.digits).map(Number);
  const colX = i => 150 + i * 37;
  const steps = u - act.start;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">
      {/* ladder rails */}
      <line x1="22" y1="20" x2="22" y2="282" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
      <line x1="112" y1="20" x2="112" y2="282" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" />
      {units.map((un, i) => {
        const on = i === u, tgt = i === act.target, start = i === act.start;
        return (
          <g key={un}>
            <rect x="26" y={rungY(i) - 13} width="82" height="26" rx="8"
              fill={on ? '#facc15' : tgt ? 'rgba(244,114,182,0.25)' : 'rgba(255,255,255,0.06)'}
              stroke={on ? '#facc15' : tgt ? '#f472b6' : 'rgba(255,255,255,0.18)'} strokeWidth="2" />
            <text x="67" y={rungY(i) + 1} fill={on ? '#0c0424' : COMMON.includes(un) ? '#ffffff' : '#94a3b8'} fontSize="14" fontWeight="900" textAnchor="middle" dominantBaseline="middle">{un}</text>
            {start && !on && <text x="12" y={rungY(i) + 1} fill="#94a3b8" fontSize="10" fontWeight="900" textAnchor="end" dominantBaseline="middle">start</text>}
            {tgt && <text x="117" y={rungY(i) + 1} fill="#f472b6" fontSize="14" fontWeight="900" dominantBaseline="middle">◀</text>}
          </g>
        );
      })}
      <text x="67" y="12" fill="#c4b5fd" fontSize="10" fontWeight="900" textAnchor="middle">bigger ▲ ÷10</text>
      <text x="67" y="296" fill="#c4b5fd" fontSize="10" fontWeight="900" textAnchor="middle">smaller ▼ ×10</text>

      {/* big value readout */}
      <rect x="150" y="18" width="258" height="70" rx="14" fill="#0c0424" stroke="#38bdf8" strokeWidth="2" />
      <text x="279" y="58" fill="#facc15" fontSize="30" fontWeight="900" textAnchor="middle" dominantBaseline="middle">{value} {units[u]}</text>

      {/* place value chart */}
      <text x="279" y="114" fill="#7dd3fc" fontSize="11" fontWeight="900" textAnchor="middle">PLACE-VALUE CHART — the digits stay, the point moves!</text>
      {units.map((un, i) => (
        <g key={un}>
          <rect x={colX(i) - 17} y="126" width="34" height="26" rx="5" fill={i === u ? 'rgba(250,204,21,0.25)' : 'rgba(255,255,255,0.06)'} stroke="rgba(255,255,255,0.15)" />
          <text x={colX(i)} y="140" fill={i === u ? '#facc15' : '#cbd5e1'} fontSize="11" fontWeight="900" textAnchor="middle" dominantBaseline="middle">{un}</text>
          <rect x={colX(i) - 17} y="156" width="34" height="44" rx="5" fill="#14082c" stroke="rgba(255,255,255,0.15)" />
          {act.digits[i] !== undefined ? (
            <text x={colX(i)} y="179" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle" dominantBaseline="middle">{act.digits[i]}</text>
          ) : (i <= u && i > Math.max(...cols)) || (i < Math.min(...cols) && i >= Math.min(u, Math.min(...cols))) ? (
            <text x={colX(i)} y="179" fill="#4ade80" fontSize="22" fontWeight="900" textAnchor="middle" dominantBaseline="middle" opacity="0.8">0</text>
          ) : null}
        </g>
      ))}
      {/* decimal point after column u */}
      <circle cx={colX(u) + 18.5} cy="196" r="6" fill="#f472b6" style={{ transition: 'cx 0.35s ease' }} />
      <text x="279" y="226" fill="#94a3b8" fontSize="11" fontWeight="800" textAnchor="middle">green 0s are placeholders</text>

      {/* step summary */}
      <rect x="150" y="240" width="258" height="44" rx="12" fill="#14082c" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="279" y="263" fill="#e9d5ff" fontSize="14" fontWeight="900" textAnchor="middle" dominantBaseline="middle">
        {steps === 0 ? 'Start here — move the token!' : `${Math.abs(steps)} step${Math.abs(steps) > 1 ? 's' : ''} ${steps > 0 ? 'down → × ' : 'up → ÷ '}${10 ** Math.abs(steps)}`}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------------
   STATION 2 — SCALE / JUG / TAPE
   ------------------------------------------------------------------------ */
function MeasureCanvas({ act, total }) {
  const VW = 420, VH = 300;
  const diff = total - act.target;
  const status = diff === 0 ? '#4ade80' : diff > 0 ? '#f87171' : '#facc15';
  const readout = act.kind === 'mass'
    ? `${Math.floor(total / 1000)} kg ${total % 1000} g`
    : act.kind === 'capacity'
      ? `${Math.floor(total / 1000)} L ${total % 1000} mL`
      : `${Math.floor(total / 100)} m ${total % 100} cm`;

  let scene = null;
  if (act.kind === 'mass') {
    const tilt = Math.max(-14, Math.min(14, (diff / act.target) * 40));
    scene = (
      <g>
        <polygon points="210,250 190,285 230,285" fill="#64748b" />
        <rect x="205" y="120" width="10" height="135" fill="#94a3b8" />
        <g transform={`rotate(${tilt} 210 120)`} style={{ transition: 'transform 0.4s ease' }}>
          <rect x="60" y="114" width="300" height="10" rx="5" fill="#cbd5e1" />
          <line x1="90" y1="124" x2="90" y2="160" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="330" y1="124" x2="330" y2="160" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M40 160 h100 l-12 16 h-76z" fill="#475569" />
          <path d="M280 160 h100 l-12 16 h-76z" fill="#475569" />
          {/* pumpkin */}
          <ellipse cx="90" cy="135" rx="38" ry="25" fill="#f97316" stroke="#fdba74" strokeWidth="3" />
          <path d="M90 110 q4 -14 12 -16" stroke="#4ade80" strokeWidth="5" fill="none" />
          <text x="90" y="138" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">3 kg 250 g</text>
          {/* weights stack */}
          <text x="330" y="148" fill={status} fontSize="13" fontWeight="900" textAnchor="middle">{readout}</text>
        </g>
      </g>
    );
  } else if (act.kind === 'capacity') {
    const max = 2000;
    const jH = 200, jy = 70, jx = 140, jw = 140;
    const fill = Math.min(total, max) / max * jH;
    const line = act.target / max * jH;
    scene = (
      <g>
        <rect x={jx} y={jy + jH - fill} width={jw} height={fill} fill={diff > 0 ? '#f87171' : '#38bdf8'} fillOpacity="0.55" style={{ transition: 'all 0.4s ease' }} />
        <path d={`M${jx} ${jy} v${jH} h${jw} v${-jH}`} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <path d={`M${jx + jw} ${jy + 30} q40 10 0 70`} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        {[500, 1000, 1500, 2000].map(m => (
          <g key={m}>
            <line x1={jx} y1={jy + jH - m / max * jH} x2={jx + 18} y2={jy + jH - m / max * jH} stroke="#cbd5e1" strokeWidth="2" />
            <text x={jx - 6} y={jy + jH - m / max * jH} fill="#cbd5e1" fontSize="11" fontWeight="800" textAnchor="end" dominantBaseline="middle">{m} mL</text>
          </g>
        ))}
        <line x1={jx - 4} y1={jy + jH - line} x2={jx + jw + 4} y2={jy + jH - line} stroke="#f472b6" strokeWidth="3" strokeDasharray="8 5" />
        <text x={jx + jw + 8} y={jy + jH - line - 10} fill="#f472b6" fontSize="12" fontWeight="900">target</text>
        <text x={jx + jw / 2} y={jy - 14} fill={status} fontSize="16" fontWeight="900" textAnchor="middle">{readout}</text>
      </g>
    );
  } else {
    const max = 300, x0 = 30, w = 360;
    const X = v => x0 + (v / max) * w;
    let acc = 0;
    scene = (
      <g>
        <rect x={x0} y="150" width={w} height="40" rx="6" fill="#facc15" fillOpacity="0.2" stroke="#facc15" strokeWidth="2" />
        {[...Array(31)].map((_, i) => (
          <g key={i}>
            <line x1={X(i * 10)} y1="150" x2={X(i * 10)} y2={i % 10 === 0 ? 172 : i % 5 === 0 ? 166 : 160} stroke="#facc15" strokeWidth="1.5" />
            {i % 10 === 0 && <text x={X(i * 10)} y="184" fill="#fde047" fontSize="11" fontWeight="900" textAnchor="middle">{i / 10} m</text>}
          </g>
        ))}
        <line x1={X(act.target)} y1="80" x2={X(act.target)} y2="200" stroke="#f472b6" strokeWidth="3" strokeDasharray="7 5" />
        <text x={X(act.target)} y="72" fill="#f472b6" fontSize="12" fontWeight="900" textAnchor="middle">2 m 35 cm</text>
        {act.placed.map((p, i) => {
          const a = acc; acc += p;
          return <rect key={i} x={X(Math.min(a, max))} y="110" width={Math.max(0, X(Math.min(acc, max)) - X(Math.min(a, max)) - 1.5)} height="26" rx="4"
            fill={i % 2 ? '#f472b6' : '#c084fc'} stroke="#0c0424" strokeWidth="1" />;
        })}
        <text x="210" y="240" fill={status} fontSize="18" fontWeight="900" textAnchor="middle">{readout}</text>
      </g>
    );
  }
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full drop-shadow-[0_0_20px_rgba(250,204,21,0.25)]">
      {scene}
      <text x="210" y="292" fill={status} fontSize="12" fontWeight="900" textAnchor="middle">
        {diff === 0 ? '✔ Exactly on target!' : diff > 0 ? `Too much by ${nice(diff)} ${act.unit}` : `${nice(-diff)} ${act.unit} still needed`}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------------
   STATION 3 — REAL-LIFE SCENES (progress = steps solved)
   ------------------------------------------------------------------------ */
function PlannerCanvas({ act, p }) {
  const VW = 420, VH = 300;
  if (act.type === 'train') {
    const x = 40 + p * 300;
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full">
        <rect x="20" y="190" width="380" height="8" fill="#64748b" />
        {[...Array(20)].map((_, i) => <rect key={i} x={24 + i * 19} y="198" width="10" height="6" fill="#475569" />)}
        <circle cx="40" cy="220" r="6" fill="#4ade80" /><text x="40" y="240" fill="#cbd5e1" fontSize="11" fontWeight="900" textAnchor="middle">Start</text>
        <circle cx="380" cy="220" r="6" fill="#f472b6" /><text x="380" y="240" fill="#cbd5e1" fontSize="11" fontWeight="900" textAnchor="middle">180 km</text>
        <g style={{ transform: `translateX(${x - 40}px)`, transition: 'transform 0.9s ease' }}>
          <rect x="10" y="150" width="70" height="38" rx="10" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="2" />
          <rect x="20" y="158" width="14" height="12" rx="2" fill="#e0f2fe" /><rect x="40" y="158" width="14" height="12" rx="2" fill="#e0f2fe" />
          <path d="M80 152 q22 4 22 34 h-22z" fill="#facc15" />
          <circle cx="28" cy="190" r="6" fill="#1e293b" /><circle cx="66" cy="190" r="6" fill="#1e293b" />
        </g>
        <rect x="110" y="40" width="200" height="80" rx="14" fill="#0c0424" stroke="#facc15" strokeWidth="2" />
        <text x="210" y="70" fill="#cbd5e1" fontSize="12" fontWeight="900" textAnchor="middle">SPEEDOMETER</text>
        <text x="210" y="100" fill="#facc15" fontSize="24" fontWeight="900" textAnchor="middle">{p >= 0.5 ? (p >= 1 ? '20 m/s' : '72 km/h') : '? km/h'}</text>
      </svg>
    );
  }
  if (act.type === 'tiles') {
    const n = Math.round(p * 150);
    const cw = 22, ox = 45, oy = 50;
    return (
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full">
        <rect x={ox} y={oy} width={15 * cw} height={10 * cw} fill="#1e1342" stroke="#e2e8f0" strokeWidth="3" />
        {[...Array(n)].map((_, i) => (
          <rect key={i} x={ox + (i % 15) * cw + 1} y={oy + Math.floor(i / 15) * cw + 1} width={cw - 2} height={cw - 2} rx="2"
            fill={(i % 15 + Math.floor(i / 15)) % 2 ? '#38bdf8' : '#facc15'} fillOpacity="0.75" />
        ))}
        <text x={ox + 7.5 * cw} y={oy - 12} fill="#fde047" fontSize="13" fontWeight="900" textAnchor="middle">3 m = 300 cm</text>
        <text x={ox + 15 * cw + 8} y={oy + 5 * cw} fill="#fde047" fontSize="13" fontWeight="900" dominantBaseline="middle">2 m</text>
        <text x={ox + 7.5 * cw} y={oy + 10 * cw + 22} fill="#cbd5e1" fontSize="12" fontWeight="900" textAnchor="middle">tile = 20 cm × 20 cm · {n} placed</text>
      </svg>
    );
  }
  // water cooler
  const cups = Math.round(p * 54);
  const level = 1 - p;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full">
      <rect x="40" y="40" width="90" height="170" rx="18" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <rect x="43" y={43 + 164 * (1 - level)} width="84" height={164 * level} rx="15" fill="#38bdf8" fillOpacity="0.55" style={{ transition: 'all 0.9s ease' }} />
      <rect x="70" y="22" width="30" height="20" rx="4" fill="#38bdf8" />
      <rect x="30" y="210" width="110" height="60" rx="8" fill="#e2e8f0" fillOpacity="0.2" stroke="#e2e8f0" strokeWidth="2" />
      <text x="85" y="245" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">18.9 L</text>
      {[...Array(cups)].map((_, i) => {
        const cx = 170 + (i % 9) * 26, cy = 40 + Math.floor(i / 9) * 40;
        return <path key={i} d={`M${cx} ${cy} h18 l-3 26 h-12z`} fill="#facc15" fillOpacity="0.75" stroke="#fde047" strokeWidth="1" />;
      })}
      <text x="285" y="290" fill="#cbd5e1" fontSize="12" fontWeight="900" textAnchor="middle">350 mL cups filled: {cups}</text>
    </svg>
  );
}

/* ------------------------------------------------------------------------
   MAIN COMPONENT
   ------------------------------------------------------------------------ */
export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Station 1
  const [rung, setRung] = useState(0);
  const [opPick, setOpPick] = useState(null);
  const [totalAns, setTotalAns] = useState('');

  // Station 2
  const [placed, setPlaced] = useState([]);
  const [levelOk, setLevelOk] = useState(false);
  const [groupAns, setGroupAns] = useState({});
  const [groupOk, setGroupOk] = useState({});

  // Station 3
  const [stepIdx, setStepIdx] = useState(0);
  const [stepAns, setStepAns] = useState('');
  const [stepWrong, setStepWrong] = useState(false);

  const currentActivity = STATION_ACTIVITIES[station][actIdx];
  const say = list => narrate(list, !muted);

  useEffect(() => {
    setShowHint(false);
    setFeedback(null);
    setRung(station === 1 ? currentActivity.start : 0);
    setOpPick(null);
    setTotalAns('');
    setPlaced([]);
    setLevelOk(false);
    setGroupAns({});
    setGroupOk({});
    setStepIdx(0);
    setStepAns('');
    setStepWrong(false);
  }, [station, actIdx]);

  useEffect(() => {
    if (actIdx === 0) {
      // New station: play station intro followed by activity description
      say([...simulateStationIntro(station), ...simulateActivityNarration(station, actIdx)]);
    } else {
      // Same station, new activity: play only the activity description
      say(simulateActivityNarration(station, actIdx));
    }
  }, [station, actIdx, muted]);

  /* ---------- Station 1 ---------- */
  const OPS = ['× 10', '× 100', '× 1000', '÷ 10', '÷ 100', '÷ 1000'];
  const atTarget = station === 1 && rung === currentActivity.target;
  const checkConvert = () => {
    const a = currentActivity;
    const units = LADDERS[a.ladder];
    if (!atTarget) {
      setFeedback({ success: false, text: `Move the token to ${units[a.target]} on the ladder first.` });
      return;
    }
    if (opPick !== a.op) {
      setFeedback({ success: false, text: `Check the rule! How many steps did you move, and which way?` });
      say(feedbackNarration.tryAgain());
      return;
    }
    if (close(parseFloat(String(totalAns).replace(/,/g, '')), a.answer)) {
      setFeedback({ success: true, text: `🎉 ${readChart(a.digits, a.start)} ${units[a.start]} ${a.op} = ${nice(a.answer)} ${units[a.target]}!` });
      say(feedbackNarration.splitDone());
    } else {
      setFeedback({ success: false, text: `Not quite! Read the number on the chart with the decimal point where it is now.` });
      say(feedbackNarration.tryAgain());
    }
  };

  /* ---------- Station 2 ---------- */
  const total2 = placed.reduce((s, v) => s + v, 0);
  const checkTarget = () => {
    const a = currentActivity;
    if (total2 === a.target) {
      setLevelOk(true);
      setFeedback({ success: true, text: `✅ Exactly ${a.target} ${a.unit}! Now write it in both units.` });
    } else {
      setFeedback({ success: false, text: total2 > a.target ? `Too much! Tap a piece in the list to remove it.` : `Not enough yet — ${a.target - total2} ${a.unit} still needed.` });
      say(feedbackNarration.tryAgain());
    }
  };
  const checkBoth = () => {
    const ok = {};
    currentActivity.groups.forEach((g, i) => { ok[i] = close(parseFloat(String(groupAns[i] ?? '').replace(/,/g, '')), g.answer); });
    setGroupOk(ok);
    if (Object.values(ok).every(Boolean)) {
      const g = currentActivity.groups;
      setFeedback({ success: true, text: `🎉 ${g[0].answer} ${g[0].unit} = ${g[1].answer} ${g[1].unit}. Measured perfectly!` });
      say(feedbackNarration.buildDone());
    } else {
      setFeedback({ success: false, text: "Some boxes are red — check those conversions again!" });
      say(feedbackNarration.tryAgain());
    }
  };

  /* ---------- Station 3 ---------- */
  const checkStep = () => {
    const st = currentActivity.steps[stepIdx];
    if (close(parseFloat(String(stepAns).replace(/,/g, '')), st.answer)) {
      const next = stepIdx + 1;
      setStepIdx(next);
      setStepAns('');
      setStepWrong(false);
      if (next >= currentActivity.steps.length) {
        setFeedback({ success: true, text: `🎉 Solved! Final answer: ${nice(st.answer)} ${st.unit}.` });
        say(feedbackNarration.reverseDone());
      } else {
        setFeedback(null);
      }
    } else {
      setStepWrong(true);
      setFeedback({ success: false, text: "Not quite — check this step. Use the 💡 Hint if you're stuck!" });
      say(feedbackNarration.tryAgain());
    }
  };

  /* ---------- Navigation ---------- */
  const nextActivity = () => {
    if (actIdx < 2) {
      setActIdx(i => i + 1);
    } else if (station < 3) {
      setStation(s => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (station > 1) {
      setStation(s => s - 1);
      setActIdx(2);
    }
  };

  const STATIONS = [
    { n: 1, icon: '🪜', name: 'Station 1: Unit Ladder', sub: 'Slide the decimal point' },
    { n: 2, icon: '⚖️', name: 'Station 2: Measure It', sub: 'Weigh, pour & cut' },
    { n: 3, icon: '🗺️', name: 'Station 3: Real-Life Planner', sub: 'Multi-step problems' }
  ];

  const inputCls = ok =>
    `bg-[#14082c] border-2 rounded-xl px-3 py-2 text-white font-display font-900 text-base text-center outline-none w-24 shadow-inner ${
      ok === true ? 'border-emerald-400' : ok === false ? 'border-rose-400' : 'border-cyan-400/70 focus:border-amber-400'
    }`;

  const hintBtn = (
    <button
      onClick={() => {
        const wasHidden = !showHint;
        setShowHint(h => !h);
        if (wasHidden) say(simulateHintNarration(station, actIdx));
      }}
      className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs px-3 py-2 rounded-xl transition cursor-pointer"
    >
      💡 Hint
    </button>
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Simulation Stations Glass Card Container */}
      <div className="w-full max-w-6xl max-h-[94vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="w-24 h-2 bg-cyan-400 rounded-full mb-2.5 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <h2 className="font-display font-900 text-2xl sm:text-3xl text-white flex items-center gap-3 mb-3.5 shrink-0">
          <span className="text-3xl sm:text-4xl">🧪</span>
          <span>Simulation Stations</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs */}
          <div className="md:col-span-4 flex flex-col justify-between gap-3 shrink-0">
            <div className="flex flex-col gap-3.5">
              {STATIONS.map(s => (
                <button
                  key={s.n}
                  onClick={() => {
                    setStation(s.n);
                    setActIdx(0);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    station === s.n
                      ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.02]'
                      : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 ${
                      station === s.n ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                    }`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-display font-900 text-base sm:text-lg leading-tight">{s.name}</p>
                      <p className="text-xs font-extrabold text-slate-300 mt-0.5">{s.sub}</p>
                    </div>
                  </div>
                  <span className="text-base">🔓</span>
                </button>
              ))}
            </div>

            {/* Bottom Left CTA Button */}
            <button
              onClick={onNext}
              className="btn-gold font-display font-900 text-base sm:text-lg py-4 px-6 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition mt-2 w-full flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Go to Practice Phase!</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: Interactive Simulation Box */}
          <div className="md:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 justify-between">
              {/* Header Row */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3 shrink-0 gap-3">
                <h3 className="font-display font-900 text-xl sm:text-2xl text-cyan-300 flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{currentActivity.icon}</span>
                  <span>{currentActivity.title}</span>
                </h3>
                <span className="font-display font-900 text-xs sm:text-sm text-slate-200 bg-white/10 px-4 py-1 rounded-full border border-white/15 shrink-0">
                  Activity {actIdx + 1} of 3
                </span>
              </div>

              {/* Activity Description */}
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-extrabold mb-3 shrink-0">
                {currentActivity.desc}
              </p>

              {/* ===================== STATION 1: UNIT LADDER ===================== */}
              {station === 1 && (
                <div className="flex gap-4 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0">
                  <div className="flex-1 min-w-0 min-h-0 flex items-center justify-center">
                    <LadderCanvas act={currentActivity} u={rung} />
                  </div>

                  <div className="w-60 sm:w-64 shrink-0 flex flex-col gap-2.5 min-h-0 overflow-y-auto">
                    <p className="text-xs font-900 text-cyan-300 uppercase tracking-wider">① Move to {LADDERS[currentActivity.ladder][currentActivity.target]}</p>
                    <div className="flex gap-2">
                      <button
                        disabled={rung <= 0}
                        onClick={() => { setRung(r => r - 1); setFeedback(null); }}
                        className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border-2 border-cyan-400/60 text-cyan-200 font-display font-900 text-sm py-2 rounded-xl cursor-pointer transition disabled:opacity-35 disabled:cursor-not-allowed"
                      >
                        ▲ Bigger unit
                      </button>
                      <button
                        disabled={rung >= 6}
                        onClick={() => { setRung(r => r + 1); setFeedback(null); }}
                        className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border-2 border-cyan-400/60 text-cyan-200 font-display font-900 text-sm py-2 rounded-xl cursor-pointer transition disabled:opacity-35 disabled:cursor-not-allowed"
                      >
                        ▼ Smaller unit
                      </button>
                    </div>
                    <p className={`text-xs font-bold italic ${atTarget ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {atTarget ? '✔ You reached the target unit!' : 'Watch the pink decimal point slide as you move.'}
                    </p>

                    <p className="text-xs font-900 text-cyan-300 uppercase tracking-wider mt-1">② Pick the rule</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {OPS.map(op => (
                        <button
                          key={op}
                          onClick={() => setOpPick(op)}
                          className={`py-1.5 rounded-lg text-xs font-900 border-2 transition cursor-pointer ${
                            opPick === op ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105' : 'bg-[#14082c] text-white border-purple-400/40 hover:border-cyan-400'
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs font-900 text-cyan-300 uppercase tracking-wider mt-1">③ Write the answer</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" placeholder="?" value={totalAns}
                        onChange={e => setTotalAns(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && checkConvert()}
                        className={inputCls(feedback ? feedback.success : null) + ' flex-1'}
                      />
                      <span className="text-sm font-900 text-slate-300">{LADDERS[currentActivity.ladder][currentActivity.target]}</span>
                    </div>
                    <div className="flex gap-2">
                      <button disabled={totalAns === ''} onClick={checkConvert} className="btn-gold flex-1 text-sm font-900 px-3 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed">
                        Check ✨
                      </button>
                      {hintBtn}
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== STATION 2: MEASURE IT ===================== */}
              {station === 2 && (
                <div className="flex gap-4 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0">
                  <div className="flex-1 min-w-0 min-h-0 flex items-center justify-center">
                    <MeasureCanvas act={{ ...currentActivity, placed }} total={total2} />
                  </div>

                  <div className="w-64 sm:w-72 shrink-0 flex flex-col gap-2.5 min-h-0 overflow-y-auto">
                    {!levelOk ? (
                      <>
                        <p className="text-xs font-900 text-cyan-300 uppercase tracking-wider">
                          ① {currentActivity.kind === 'mass' ? 'Add weights' : currentActivity.kind === 'capacity' ? 'Pour cups' : 'Join pieces'}
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {currentActivity.pieces.map(v => (
                            <button
                              key={v}
                              onClick={() => { setPlaced(p => [...p, v]); setFeedback(null); }}
                              className="py-2 rounded-xl text-xs font-900 border-2 bg-[#14082c] text-white border-amber-400/50 hover:border-cyan-400 hover:scale-105 transition cursor-pointer"
                            >
                              ＋ {currentActivity.label(v)}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs font-900 text-cyan-300 uppercase tracking-wider">Added (tap to remove)</p>
                        <div className="flex flex-wrap gap-1 min-h-[2rem] bg-[#14082c] rounded-xl p-1.5 border border-white/10">
                          {placed.length === 0 && <span className="text-xs font-bold text-slate-500 italic px-1">Nothing yet</span>}
                          {placed.map((v, i) => (
                            <button
                              key={i}
                              onClick={() => setPlaced(p => p.filter((_, k) => k !== i))}
                              className="text-[11px] font-900 px-2 py-1 rounded-lg bg-purple-500/30 text-purple-100 hover:bg-rose-500/40 cursor-pointer"
                            >
                              {currentActivity.label(v)} ✕
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setPlaced([])} className="bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-900 text-xs px-3 py-2 rounded-xl cursor-pointer">Clear</button>
                          <button onClick={checkTarget} className="btn-gold flex-1 text-sm font-900 px-3 py-2.5">Check ✨</button>
                          {hintBtn}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-900 text-cyan-300 uppercase tracking-wider">② Write it in both units</p>
                        {currentActivity.groups.map((g, i) => (
                          <div key={i} className="bg-[#14082c] rounded-xl p-2.5 border-2 border-amber-400/40">
                            <p className="text-xs font-900 text-amber-300">{g.label}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-900 text-slate-200 flex-1">{g.formula}</span>
                              <input type="number" value={groupAns[i] || ''} onChange={e => setGroupAns(s => ({ ...s, [i]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && checkBoth()} className={inputCls(groupOk[i])} />
                              <span className="text-[11px] font-900 text-slate-300 w-6">{g.unit}</span>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <button onClick={checkBoth} className="btn-gold flex-1 text-sm font-900 px-3 py-2.5">Check ✨</button>
                          {hintBtn}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ===================== STATION 3: REAL-LIFE PLANNER ===================== */}
              {station === 3 && (
                <div className="flex gap-4 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0">
                  <div className="flex-1 min-w-0 min-h-0 flex flex-col items-center justify-center gap-2">
                    <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                      <PlannerCanvas act={currentActivity} p={Math.min(stepIdx, currentActivity.steps.length) / currentActivity.steps.length} />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between text-xs font-900 text-slate-300 mb-1">
                        <span>Steps solved</span>
                        <span className="text-amber-300">{Math.min(stepIdx, currentActivity.steps.length)} / {currentActivity.steps.length}</span>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/15">
                        <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${(Math.min(stepIdx, currentActivity.steps.length) / currentActivity.steps.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="w-64 sm:w-72 shrink-0 flex flex-col gap-2 min-h-0 overflow-y-auto">
                    <p className="text-xs font-900 text-cyan-300 uppercase tracking-wider">Solve it step by step</p>
                    {currentActivity.steps.map((st, i) => {
                      const doneStep = i < stepIdx;
                      const active = i === stepIdx;
                      return (
                        <div
                          key={i}
                          className={`rounded-xl p-2 border-2 transition ${
                            doneStep ? 'bg-emerald-950/70 border-emerald-400/60' : active ? 'bg-[#14082c] border-amber-400/70' : 'bg-[#14082c]/50 border-white/10 opacity-40'
                          }`}
                        >
                          <p className="text-xs font-900 text-slate-100">{i + 1}. {st.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {doneStep ? (
                              <span className="text-sm font-900 text-emerald-300">✔ {nice(st.answer)} {st.unit}</span>
                            ) : (
                              <>
                                <input
                                  type="number" disabled={!active} value={active ? stepAns : ''} placeholder="?"
                                  onChange={e => { setStepAns(e.target.value); setStepWrong(false); }}
                                  onKeyDown={e => e.key === 'Enter' && active && checkStep()}
                                  className={inputCls(active && stepWrong ? false : null) + ' flex-1 disabled:opacity-50 !py-1.5'}
                                />
                                <span className="text-xs font-900 text-slate-300">{st.unit}</span>
                                {active && (
                                  <button onClick={checkStep} disabled={stepAns === ''} className="btn-gold text-xs font-900 px-3 py-1.5 disabled:opacity-40">✓</button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex">{hintBtn}</div>
                  </div>
                </div>
              )}

              {/* Hint + feedback strip */}
              {showHint && (
                <div className="p-2.5 mt-2 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0">
                  💡 {currentActivity.hint}
                </div>
              )}
              {feedback && (
                <div className={`p-2.5 mt-2 rounded-2xl text-sm font-900 w-full text-center shadow-xl shrink-0 fade-in-up ${
                  feedback.success ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border-2 border-rose-400/60'
                }`}>
                  {feedback.text}
                </div>
              )}
            </div>

            {/* Bottom Activity Step Buttons */}
            <div className="flex items-center justify-between border-t border-white/15 pt-3 mt-3 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/25 text-white font-display font-900 text-sm sm:text-base px-6 py-2.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous Activity
              </button>

              <button
                onClick={nextActivity}
                className="btn-gold text-sm sm:text-base font-900 px-8 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 3 && actIdx === 2 ? 'Go to Practice Phase' : 'Next Activity'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
