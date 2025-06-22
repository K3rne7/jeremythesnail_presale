
import { formatISO } from 'date-fns';

const START = new Date('2025-07-01T00:00:00Z');
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000; // Milliseconds in two weeks
const BASE_PRICE = 0.00042;
const PRICE_INCREASE_PERCENTAGE = 0.09; // 9% increase
const TOTAL_STAGES = 13;

export interface PresaleStage {
  index: number;
  price: number;
  start: string; // ISO string
  end: string;   // ISO string
}

export const STAGES: PresaleStage[] = Array.from({ length: TOTAL_STAGES }, (_, i) => {
  const stageStartTime = START.getTime() + i * TWO_WEEKS_MS;
  const stageEndTime = stageStartTime + TWO_WEEKS_MS - 1; // End is 1ms before next stage starts

  const start = new Date(stageStartTime);
  const end = new Date(stageEndTime);
  
  // Price calculation: Base * (1 + increase)^stage_index (0-indexed)
  const price = +(BASE_PRICE * Math.pow(1 + PRICE_INCREASE_PERCENTAGE, i)).toFixed(8);

  return {
    index: i + 1, // 1-indexed for display
    price: price,
    start: formatISO(start),
    end: formatISO(end),
  };
});

export const PRESALE_START_DATE = STAGES[0].start;
export const PRESALE_END_DATE = STAGES[STAGES.length - 1]!.end; // Non-null assertion, as STAGES will have items.

export const TOTAL_SUPPLY = 1_000_000_000; // Example total supply for $JEREMY
export const PRESALE_ALLOCATION_PERCENTAGE = 0.4; // 40% for presale
export const HARD_CAP_TOKENS = TOTAL_SUPPLY * PRESALE_ALLOCATION_PERCENTAGE; // Total tokens available in presale

// console.log("Generated Presale Stages:", STAGES);
// console.log("Presale End Date:", PRESALE_END_DATE);