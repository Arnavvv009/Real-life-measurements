/* =========================================================================
   NARRATION SCRIPTS — maps each lesson phase to its spoken segments.
   Only paragraph text and questions are narrated — NEVER titles.
   Every string comes from lessonScript.js, the same source the UI displays.
   ========================================================================= */
import { say, ask, think, instruct, cheer, encourage, emphasize } from './audio.js';
import { WONDER, STORY, SIMULATE, SIMULATE_ACTIVITIES, SIMULATE_HINTS, REFLECT, FEEDBACK } from './lessonScript.js';

export function wonderNarration() {
  return [say(WONDER.paragraph), ask(WONDER.question)];
}

export function getStoryNarration(slideIndex) {
  const slide = STORY[slideIndex];
  if (!slide) return [];
  const segments = [{ text: slide.body, style: slide.style }];
  if (slide.bubble) segments.push(emphasize(slide.bubble));
  return segments;
}

export function simulateStationIntro(station) {
  if (station === 3) return [ask(SIMULATE[3])];
  return [instruct(SIMULATE[station])];
}

export function simulateActivityNarration(station, actIdx) {
  const desc = SIMULATE_ACTIVITIES[station]?.[actIdx];
  return desc ? [instruct(desc)] : [];
}

export function simulateHintNarration(station, actIdx) {
  const hint = SIMULATE_HINTS[station]?.[actIdx];
  return hint ? [think(hint)] : [];
}

export function reflectQuestionNarration() {
  return [think(REFLECT.question)];
}

export const feedbackNarration = {
  splitDone: () => [cheer(FEEDBACK.splitDone)],
  buildDone: () => [cheer(FEEDBACK.buildDone)],
  reverseDone: () => [cheer(FEEDBACK.reverseDone)],
  tryAgain: () => [encourage(FEEDBACK.tryAgain)],
  practiceCorrect: () => [cheer(FEEDBACK.practiceCorrect)],
  practiceWrong: () => [encourage(FEEDBACK.practiceWrong)],
  lessonDone: () => [cheer(FEEDBACK.lessonDone)],
  outOfHearts: () => [encourage(FEEDBACK.outOfHearts)],
  celebration: () => [cheer(FEEDBACK.celebration)]
};
