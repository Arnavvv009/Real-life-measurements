/* =========================================================================
   LESSON SCRIPT — single source of truth for every spoken line.
   ---------------------------------------------------------------------------
   • UI components DISPLAY these exact strings.
   • src/utils/narration.js wraps them in styled segments for playback.
   • scripts/generate_audio.js reads ALL_PHRASES to pre-generate the MP3s.
   Because all three read the same strings, on-screen text and audio can
   never drift apart (1:1 parity).

   CONTENT POLICY: only paragraphs and questions are narrated.
   Titles, headings and labels live in the components and are NEVER spoken.
   Plain ESM (no Vite-only APIs) so Node scripts can import it too.
   ========================================================================= */

export const WONDER = {
  paragraph:
    "Leo's airline allows 20 kilograms of luggage. He packs a 4.5 kilogram suitcase, 8750 grams of clothes and 6800 grams of gifts. At the airport the scale shows 20.05 kilograms. He is 50 grams over!",
  question:
    "How can we compare and add measurements when they are written in different units?"
};

export const STORY = [
  {
    body: "Every day we measure things: how long a road is, how heavy a bag is, how much juice is in a bottle, and how long a journey takes. Length, mass, capacity and time each have their own units.",
    style: 'statement',
    bubble: "Every measurement needs a number AND a unit!"
  },
  {
    body: "The metric system works in steps of 10. Kilo means a thousand, centi means one hundredth and milli means one thousandth. Moving to a smaller unit, we multiply. Moving to a bigger unit, we divide.",
    style: 'emphasis',
    bubble: "kilo = 1000, centi = 1/100, milli = 1/1000"
  },
  {
    body: "For length, 1 kilometre is 1000 metres, 1 metre is 100 centimetres and 1 centimetre is 10 millimetres. So a 2.5 kilometre walk is 2500 metres.",
    style: 'statement',
    bubble: "1 m = 100 cm and 1 cm = 10 mm!"
  },
  {
    body: "For mass, 1 kilogram is 1000 grams and 1 tonne is 1000 kilograms. For capacity, 1 litre is 1000 millilitres. So 4750 grams is 4.75 kilograms, and 350 millilitres is 0.35 litres.",
    style: 'statement',
    bubble: "1 kg = 1000 g and 1 L = 1000 mL!"
  },
  {
    body: "Area and volume units grow faster! Since 1 metre is 100 centimetres, 1 square metre is 100 times 100, which is 10,000 square centimetres. And 1 cubic centimetre holds exactly 1 millilitre.",
    style: 'thinking',
    bubble: "Square the factor for area, cube it for volume!"
  },
  {
    body: "Time is different. It works in sixties: 60 seconds make a minute and 60 minutes make an hour. Speed is distance divided by time. A car travelling 72 kilometres per hour covers 20 metres every second.",
    style: 'emphasis',
    bubble: "Time works in 60s, not 10s!"
  },
  {
    body: "Leo changed everything into grams: 4500 plus 8750 plus 6800 is 20,050 grams, which is 20.05 kilograms. To fly, he took out a 50 gram chocolate bar and ate it!",
    style: 'encouragement',
    bubble: "Same units first, then add!"
  },
  {
    body: "Fantastic! You can now convert units of length, mass, capacity, area and time, and use them to solve real problems. Step into the lab to climb the unit ladder, weigh and pour, and plan real journeys!",
    style: 'celebration',
    bubble: "Click below to enter the interactive lab!"
  }
];

export const SIMULATE = {
  1: "Move the number up or down the unit ladder and watch the decimal point slide. Then type the converted measurement!",
  2: "Add weights, cups or pieces until you match the target exactly. Then write the amount in both units!",
  3: "Solve a real-life problem one step at a time. Convert the units first, then calculate!"
};

/** Activity descriptions shown and narrated inside each simulation station. */
export const SIMULATE_ACTIVITIES = {
  1: [
    "Leo's walk to school is 2.5 km. His fitness app counts in metres. Move down the ladder from km to m, pick the rule, then write the distance in metres.",
    "A watermelon has a mass of 4750 g. The price label needs kilograms. Move UP the ladder from g to kg, pick the rule, then write the mass in kg.",
    "A bottle holds 1.25 L of juice. A recipe asks for millilitres. Move from L to mL, pick the rule, then write the amount in mL."
  ],
  2: [
    "A pumpkin has a mass of 3 kg 250 g. Add weights to the scale until it balances exactly. Then write the mass in grams and in kilograms.",
    "The punch bowl needs exactly 1 L 750 mL of juice. Pour from the measuring cups until you hit the line. Then write the amount in mL and in L.",
    "Chloe needs 2 m 35 cm of ribbon. Join pieces along the measuring tape until you reach the mark. Then write the length in cm and in m."
  ],
  3: [
    "A train travels 180 km in 2 hours 30 minutes. Find its average speed in km/h, then change it into metres per second.",
    "A kitchen floor is 3 m by 2 m. Square tiles are 20 cm by 20 cm. How many tiles cover the floor? Convert to the same unit first!",
    "A water cooler bottle holds 18.9 L. Each paper cup holds 350 mL. How many cups can be filled, and how many people get 2 cups each?"
  ]
};

/** Activity hints shown when the user clicks 💡 Hint inside each simulation activity. */
export const SIMULATE_HINTS = {
  1: [
    "From km down to m is 3 steps. Each step down multiplies by 10: 10 times 10 times 10 equals 1000.",
    "Going up to a bigger unit divides. g to kg is 3 steps up: divide by 1000.",
    "L down to mL is 3 steps: times 1000. The decimal point jumps 3 places right."
  ],
  2: [
    "1 kg equals 1000 g. You need 3 times 1 kg, then 250 g more: 200 g plus 50 g.",
    "1 L equals 1000 mL. 500 plus 500 plus 500 plus 250 equals 1750 mL works!",
    "1 m equals 100 cm. Two 1 m pieces, then 35 cm more: 20 plus 5 plus 5 plus 5."
  ],
  3: [
    "30 minutes is half an hour. 1 hour equals 60 times 60 which is 3600 seconds.",
    "Change metres to centimetres by multiplying by 100, then see how many 20 cm tiles fit each way.",
    "L to mL: times 1000. Then share the mL equally into 350 mL cups."
  ]
};

export const REFLECT = {
  question:
    "How do you change a measurement from one unit to another? Explain it to Robo with a real-life example!"
};

export const FEEDBACK = {
  splitDone: "Awesome! That conversion is spot on!",
  buildDone: "Great measuring! You hit the target exactly!",
  reverseDone: "Brilliant problem solving!",
  tryAgain: "Not quite. Try again!",
  practiceCorrect: "Correct! Excellent measuring!",
  practiceWrong: "Not quite!",
  lessonDone: "Outstanding reflection! Lesson complete!",
  outOfHearts: "No worries! Let's practice some more. Try again to master this world!",
  celebration: "Congratulations! You've mastered converting length, mass, capacity, area and time units, and solving real-life measurement problems!"
};

/** Every phrase that should exist as a pre-generated MP3, with its voice style. */
export const ALL_PHRASES = [
  { text: WONDER.paragraph, style: 'statement' },
  { text: WONDER.question, style: 'question' },
  ...STORY.map(s => ({ text: s.body, style: s.style })),
  ...STORY.filter(s => s.bubble).map(s => ({ text: s.bubble, style: 'emphasis' })),
  { text: SIMULATE[1], style: 'instruction' },
  { text: SIMULATE[2], style: 'instruction' },
  { text: SIMULATE[3], style: 'question' },
  ...Object.values(SIMULATE_ACTIVITIES).flat().map(t => ({ text: t, style: 'instruction' })),
  ...Object.values(SIMULATE_HINTS).flat().map(t => ({ text: t, style: 'thinking' })),
  { text: REFLECT.question, style: 'thinking' },
  { text: FEEDBACK.splitDone, style: 'celebration' },
  { text: FEEDBACK.buildDone, style: 'celebration' },
  { text: FEEDBACK.reverseDone, style: 'celebration' },
  { text: FEEDBACK.tryAgain, style: 'encouragement' },
  { text: FEEDBACK.practiceCorrect, style: 'celebration' },
  { text: FEEDBACK.practiceWrong, style: 'encouragement' },
  { text: FEEDBACK.lessonDone, style: 'celebration' },
  { text: FEEDBACK.outOfHearts, style: 'encouragement' },
  { text: FEEDBACK.celebration, style: 'celebration' }
];
