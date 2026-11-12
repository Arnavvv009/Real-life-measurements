/* =========================================================================
   MATH DATA & PROCEDURAL QUESTION GENERATOR
   Procedurally generates Grade 8 "Units & Real-Life Measurement" questions.
   Each question carries diagram data for <MeasureDiagram/>.
   ========================================================================= */

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

export const PRACTICE_WORLDS = [
  { id: 0, name: "Ruler Ridge", icon: "📏", range: "Q1–10", difficulty: 1 },
  { id: 1, name: "Market Scales", icon: "⚖️", range: "Q11–20", difficulty: 1 },
  { id: 2, name: "Juice Bar", icon: "🧃", range: "Q21–30", difficulty: 2 },
  { id: 3, name: "Luggage Lounge", icon: "🧳", range: "Q31–40", difficulty: 2 },
  { id: 4, name: "Clock Tower", icon: "⏰", range: "Q41–50", difficulty: 2 },
  { id: 5, name: "Tile Town", icon: "🧱", range: "Q51–60", difficulty: 3 },
  { id: 6, name: "Aquarium Annex", icon: "🐠", range: "Q61–70", difficulty: 3 },
  { id: 7, name: "Railway Junction", icon: "🚆", range: "Q71–80", difficulty: 3 },
  { id: 8, name: "Supermarket Street", icon: "🛒", range: "Q81–90", difficulty: 4 },
  { id: 9, name: "Speedway Summit", icon: "🏎️", range: "Q91–100", difficulty: 4 }
];

const CONV = {
  length: [
    { from: 'km', to: 'm', f: 1000 }, { from: 'm', to: 'km', f: 1 / 1000 },
    { from: 'm', to: 'cm', f: 100 }, { from: 'cm', to: 'm', f: 1 / 100 },
    { from: 'cm', to: 'mm', f: 10 }, { from: 'mm', to: 'cm', f: 1 / 10 }
  ],
  mass: [
    { from: 'kg', to: 'g', f: 1000 }, { from: 'g', to: 'kg', f: 1 / 1000 },
    { from: 't', to: 'kg', f: 1000 }, { from: 'kg', to: 't', f: 1 / 1000 }
  ],
  capacity: [
    { from: 'L', to: 'mL', f: 1000 }, { from: 'mL', to: 'L', f: 1 / 1000 }
  ]
};

const CTX = {
  length: { km: ["cycle route", "marathon", "road trip"], m: ["running track", "swimming race", "rope"], cm: ["desk", "plant", "pencil case"], mm: ["beetle", "screw", "phone thickness"] },
  mass: { kg: ["bag of rice", "puppy", "suitcase"], g: ["bar of chocolate", "apple", "letter"], t: ["truck", "elephant", "boat"] },
  capacity: { L: ["water bottle", "paint tin", "fish tank"], mL: ["cup of tea", "medicine bottle", "juice box"] }
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const r4 = v => Math.round(v * 10000) / 10000;

export function formatNum(val) {
  return r4(val).toLocaleString('en-US', { maximumFractionDigits: 4 });
}

const RULES = {
  convert: "✦ SMALLER UNIT → MULTIPLY",
  mixed: "✦ SAME UNITS FIRST",
  compare: "✦ CONVERT, THEN COMPARE",
  time: "✦ 60 MIN = 1 HOUR",
  area: "✦ SQUARE THE FACTOR",
  volume: "✦ 1 cm³ = 1 mL",
  speed: "✦ SPEED = DISTANCE ÷ TIME",
  price: "✦ UNIT PRICE × AMOUNT"
};

/** A "nice" starting value for a conversion from a given unit. */
function niceValue(c) {
  if (c.f >= 1) return pick([randInt(2, 9) + randInt(1, 9) / 10, randInt(1, 9) + randInt(5, 95) / 100, randInt(2, 40)]);
  const big = 1 / c.f;
  return pick([randInt(2, 9) * big + randInt(1, 9) * big / 10, randInt(11, 99) * big / 10, randInt(5, 95) * big / 100]);
}

const two = n => String(n).padStart(2, '0');
const hm = m => (m % 60 === 0 ? `${m / 60} h` : m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`);

/**
 * Generate a procedural question for a given world
 */
export function makeQuestion(worldIndex = 0) {
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  const name = pick(WESTERN_NAMES);
  const diff = world.difficulty;

  const allowed = ['convLength', 'convMass', 'convLength', 'convMass'];
  if (diff >= 2) allowed.push('convCap', 'convCap', 'mixed', 'compare', 'timeConv', 'elapsed');
  if (diff >= 3) allowed.push('area', 'volume', 'speed', 'tiles', 'elapsed');
  if (diff >= 4) allowed.push('speedConv', 'speedConv', 'price', 'price', 'mixed', 'speed');
  const archetype = pick(allowed);

  let prompt = "";
  let correct = 0;
  let distractors = [];
  let diagramData = {};
  let explanation = "";
  let rule = RULES.convert;
  let fmtOpt = v => v;
  let customOptions = null; // [correctLabel, ...3 wrong labels]

  switch (archetype) {
    case 'convLength':
    case 'convMass':
    case 'convCap': {
      const kind = archetype === 'convLength' ? 'length' : archetype === 'convMass' ? 'mass' : 'capacity';
      const c = pick(CONV[kind]);
      const v = r4(niceValue(c));
      correct = r4(v * c.f);
      const thing = pick(CTX[kind][c.from]);
      prompt = `${name}'s ${thing} measures ${formatNum(v)} ${c.from}. What is this in ${c.to}?`;
      diagramData = { type: kind, value: `${formatNum(v)} ${c.from}`, ask: `? ${c.to}` };
      const f10 = c.f >= 1 ? 10 : 0.1;
      distractors = [v / c.f, v * c.f * f10, v * c.f / f10, v * c.f * (c.f >= 1 ? 100 : 0.01)];
      explanation = c.f >= 1
        ? `${c.from} → ${c.to} is a smaller unit, so × ${c.f}: ${formatNum(v)} × ${c.f} = ${formatNum(correct)} ${c.to}.`
        : `${c.from} → ${c.to} is a bigger unit, so ÷ ${Math.round(1 / c.f)}: ${formatNum(v)} ÷ ${Math.round(1 / c.f)} = ${formatNum(correct)} ${c.to}.`;
      rule = c.f >= 1 ? "✦ SMALLER UNIT → MULTIPLY" : "✦ BIGGER UNIT → DIVIDE";
      fmtOpt = x => `${x} ${c.to}`;
      break;
    }

    case 'mixed': {
      const isMass = Math.random() < 0.5;
      const [big, small] = isMass ? ['kg', 'g'] : ['L', 'mL'];
      const a1 = randInt(1, 5), b1 = randInt(1, 19) * 50, a2 = randInt(1, 4), b2 = randInt(1, 19) * 50;
      const totalSmall = (a1 + a2) * 1000 + b1 + b2;
      correct = totalSmall / 1000;
      prompt = isMass
        ? `${name} buys ${a1} kg ${b1} g of apples and ${a2} kg ${b2} g of oranges. What is the total mass in kg?`
        : `${name} mixes ${a1} L ${b1} mL of juice with ${a2} L ${b2} mL of soda. How many litres of punch is that?`;
      diagramData = { type: isMass ? 'mass' : 'capacity', value: `${a1} ${big} ${b1} ${small} + ${a2} ${big} ${b2} ${small}`, ask: `? ${big}` };
      distractors = [a1 + a2 + (b1 + b2) / 100, a1 + a2 + b1 + b2, totalSmall, a1 + a2];
      explanation = `${a1 * 1000 + b1} + ${a2 * 1000 + b2} = ${totalSmall} ${small} = ${formatNum(correct)} ${big}.`;
      rule = RULES.mixed;
      fmtOpt = x => `${x} ${big}`;
      break;
    }

    case 'compare': {
      const isMass = Math.random() < 0.5;
      const base = randInt(12, 48) * 100; // in g or mL
      const uniqVals = [base];
      while (uniqVals.length < 4) {
        const v = base + pick([-1, 1]) * randInt(1, 12) * 30;
        if (v > 50 && !uniqVals.includes(v)) uniqVals.push(v);
      }
      const labels = uniqVals.map((v, i) => (i % 2 === 0 ? `${formatNum(v / 1000)} ${isMass ? 'kg' : 'L'}` : `${v} ${isMass ? 'g' : 'mL'}`));
      const maxI = uniqVals.indexOf(Math.max(...uniqVals));
      correct = uniqVals[maxI];
      prompt = isMass ? `Which parcel is the HEAVIEST?` : `Which container holds the MOST?`;
      diagramData = { type: isMass ? 'mass' : 'capacity', value: isMass ? 'kg and g mixed' : 'L and mL mixed', ask: isMass ? 'Change all to g' : 'Change all to mL' };
      customOptions = [labels[maxI], ...labels.filter((_, i) => i !== maxI)];
      explanation = `In ${isMass ? 'grams' : 'mL'}: ${uniqVals.join(', ')}. The largest is ${labels[maxI]}.`;
      rule = RULES.compare;
      break;
    }

    case 'timeConv': {
      const h = randInt(1, 5), m = randInt(1, 11) * 5;
      if (Math.random() < 0.5) {
        correct = h * 60 + m;
        prompt = `A movie lasts ${h} h ${m} min. How many minutes is that?`;
        diagramData = { type: 'time', value: `${h} h ${m} min`, ask: '? min' };
        distractors = [h * 100 + m, h * 60, h + m, h * 60 + m + 60];
        explanation = `${h} × 60 + ${m} = ${correct} min.`;
        fmtOpt = x => `${x} min`;
      } else {
        const half = pick([0.25, 0.5, 0.75]);
        const hours = h + half;
        correct = hours * 60;
        prompt = `${name} practises piano for ${hours} hours. How many minutes is that?`;
        diagramData = { type: 'time', value: `${hours} h`, ask: '? min' };
        distractors = [h * 60 + half * 100, hours * 100, h * 60 + 30 * (half !== 0.5), hours * 60 + 15];
        explanation = `${hours} × 60 = ${correct} min.`;
        fmtOpt = x => `${x} min`;
      }
      rule = RULES.time;
      break;
    }

    case 'elapsed': {
      const startM = randInt(6 * 12, 14 * 12) * 5;
      const dur = randInt(14, 60) * 5;
      const endM = startM + dur;
      const t = m => `${two(Math.floor(m / 60))}:${two(m % 60)}`;
      correct = dur;
      prompt = `A train leaves at ${t(startM)} and arrives at ${t(endM)}. How long is the journey?`;
      diagramData = { type: 'time', value: `${t(startM)} → ${t(endM)}`, ask: '? h ? min' };
      const wrong = [dur + 40, dur - 40 > 0 ? dur - 40 : dur + 100, dur + 60].map(hm);
      customOptions = [hm(dur), ...wrong];
      explanation = `From ${t(startM)} to ${t(endM)} is ${dur} minutes = ${hm(dur)}.`;
      rule = RULES.time;
      break;
    }

    case 'area': {
      if (Math.random() < 0.5) {
        const v = pick([randInt(2, 9), randInt(2, 9) + 0.5, randInt(11, 40) / 10]);
        correct = r4(v * 10000);
        prompt = `A window has an area of ${formatNum(v)} m². What is this in cm²?`;
        diagramData = { type: 'area', value: `${formatNum(v)} m²`, ask: '? cm²', side: '1 m = 100 cm' };
        distractors = [v * 100, v * 1000, v * 100000, v * 10];
        explanation = `1 m² = 100 × 100 = 10 000 cm², so ${formatNum(v)} × 10 000 = ${formatNum(correct)} cm².`;
        fmtOpt = x => `${x} cm²`;
      } else {
        const v = randInt(2, 60);
        correct = v * 100;
        prompt = `A stamp has an area of ${v} cm². What is this in mm²?`;
        diagramData = { type: 'area', value: `${v} cm²`, ask: '? mm²', side: '1 cm = 10 mm' };
        distractors = [v * 10, v * 1000, v / 10, v * 20];
        explanation = `1 cm² = 10 × 10 = 100 mm², so ${v} × 100 = ${correct} mm².`;
        fmtOpt = x => `${x} mm²`;
      }
      rule = RULES.area;
      break;
    }

    case 'volume': {
      if (Math.random() < 0.5) {
        const L = 10 * randInt(2, 6), W = 10 * randInt(1, 4), H = 5 * randInt(2, 6);
        correct = (L * W * H) / 1000;
        prompt = `A tank is ${L} cm by ${W} cm by ${H} cm. How many litres does it hold? (1000 cm³ = 1 L)`;
        diagramData = { type: 'capacity', value: `${L} × ${W} × ${H} cm`, ask: '? L' };
        distractors = [L * W * H / 100, L * W * H / 10000, L * W * H, L + W + H];
        explanation = `${L} × ${W} × ${H} = ${L * W * H} cm³ = ${formatNum(correct)} L.`;
        fmtOpt = x => `${x} L`;
      } else {
        const v = pick([randInt(2, 30), randInt(1, 9) + 0.5]);
        correct = v * 1000;
        prompt = `A pond holds ${formatNum(v)} m³ of water. How many litres is that? (1 m³ = 1000 L)`;
        diagramData = { type: 'capacity', value: `${formatNum(v)} m³`, ask: '? L' };
        distractors = [v * 100, v * 1000000, v * 10, v * 10000];
        explanation = `${formatNum(v)} × 1000 = ${formatNum(correct)} L.`;
        fmtOpt = x => `${x} L`;
      }
      rule = RULES.volume;
      break;
    }

    case 'speed': {
      const sp = randInt(8, 24) * 5;
      const mins = pick([30, 90, 120, 150, 180, 45, 75]);
      const dist = (sp * mins) / 60;
      if (!Number.isInteger(dist)) { return makeQuestion(worldIndex); }
      correct = sp;
      prompt = `A bus travels ${dist} km in ${hm(mins)}. What is its average speed in km/h?`;
      diagramData = { type: 'speed', value: `${dist} km in ${hm(mins)}`, ask: '? km/h' };
      distractors = [dist / (Math.floor(mins / 60) + (mins % 60) / 100), dist * 60 / mins * 2, dist * mins / 60, sp + 10];
      explanation = `${hm(mins)} = ${formatNum(mins / 60)} h. ${dist} ÷ ${formatNum(mins / 60)} = ${sp} km/h.`;
      rule = RULES.speed;
      fmtOpt = x => `${x} km/h`;
      break;
    }

    case 'speedConv': {
      const k = randInt(2, 8);
      const kmh = 18 * k;
      correct = 5 * k;
      prompt = `A car travels at ${kmh} km/h. What is this speed in metres per second?`;
      diagramData = { type: 'speed', value: `${kmh} km/h`, ask: '? m/s' };
      distractors = [kmh * 1000 / 60, kmh / 60, kmh * 3.6, kmh / 10];
      explanation = `${kmh} km/h = ${kmh * 1000} m ÷ 3600 s = ${correct} m/s.`;
      rule = RULES.speed;
      fmtOpt = x => `${x} m/s`;
      break;
    }

    case 'tiles': {
      const t = pick([20, 25, 50]);
      const a = randInt(2, 6), b = randInt(2, 5);
      const L = (a * 100) / t, W = (b * 100) / t;
      correct = L * W;
      prompt = `A floor is ${a} m by ${b} m. Square tiles are ${t} cm by ${t} cm. How many tiles are needed?`;
      diagramData = { type: 'area', value: `${a} m × ${b} m`, ask: `tiles ${t} cm`, side: `1 m = 100 cm` };
      distractors = [(a * b) / (t * t) * 10000 * 10, a * b, (a * b * 100) / t, L + W];
      explanation = `${a * 100} ÷ ${t} = ${L} and ${b * 100} ÷ ${t} = ${W}; ${L} × ${W} = ${correct} tiles.`;
      rule = RULES.area;
      fmtOpt = x => `${x} tiles`;
      break;
    }

    case 'price': {
      const perKg = randInt(12, 60) / 10 * 2; // $2.40 … $12.00 in 0.20 steps
      const g = pick([250, 500, 750, 1500, 2500, 200, 1250]);
      correct = r4(perKg * g / 1000);
      prompt = `Cheese costs $${perKg.toFixed(2)} per kg. How much does ${name} pay for ${g} g?`;
      diagramData = { type: 'price', value: `$${perKg.toFixed(2)} / kg`, ask: `${g} g = ?` };
      distractors = [perKg * g / 100, perKg * g, perKg * g / 10000, perKg + g / 1000];
      explanation = `${g} g = ${formatNum(g / 1000)} kg. ${formatNum(g / 1000)} × $${perKg.toFixed(2)} = $${correct.toFixed(2)}.`;
      rule = RULES.price;
      fmtOpt = x => `$${Number(x.replace(/,/g, '')).toFixed(2)}`;
      break;
    }

    default:
      break;
  }

  prompt = prompt.replace(/\b([Aa]) (?=[aeiouAEIOU]|(?:8|11|18|8\d)\b)/g, '$1n ');

  let rawOptions;
  if (customOptions) {
    rawOptions = customOptions;
  } else {
    const correctLabel = fmtOpt(formatNum(correct));
    const uniq = [];
    for (const d of distractors) {
      const f = fmtOpt(formatNum(d));
      if (Number.isFinite(d) && d > 0 && f !== correctLabel && !uniq.includes(f)) uniq.push(f);
    }
    const fallbacks = [correct * 10, correct / 10, correct * 2, correct + 1, correct * 100, correct + 5];
    for (const fb of fallbacks) {
      if (uniq.length >= 3) break;
      const f = fmtOpt(formatNum(fb));
      if (fb > 0 && f !== correctLabel && !uniq.includes(f)) uniq.push(f);
    }
    rawOptions = [correctLabel, ...uniq.slice(0, 3)];
  }

  const target = rawOptions[0];
  const options = [...rawOptions];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    world,
    name,
    archetype,
    prompt,
    correctIndex: options.indexOf(target),
    correctValue: correct,
    options,
    diagramData,
    rule,
    explanation
  };
}
