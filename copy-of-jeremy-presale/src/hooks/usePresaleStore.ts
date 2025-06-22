
import {create} from 'zustand';
import { STAGES, PRESALE_START_DATE, PRESALE_END_DATE, HARD_CAP_TOKENS } from '../data/stages';
import type { PresaleStage as DataPresaleStage } from '../data/stages';
import type { PresaleState, CountdownValues } from '../types';

const initialCountdownValues: CountdownValues = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const usePresaleStore = create<PresaleState>((set, get) => ({
  currentStageIndex: -1, // -1 means presale hasn't started or no stage found
  currentPrice: STAGES[0]?.price || 0,
  nextPrice: STAGES[1]?.price || null,
  tokensSold: 0,
  hardCap: HARD_CAP_TOKENS,
  presaleEnded: new Date().toISOString() > PRESALE_END_DATE,
  presaleActive: new Date().toISOString() >= PRESALE_START_DATE && new Date().toISOString() <= PRESALE_END_DATE,
  timeLeftInStage: initialCountdownValues,
  totalTimeLeft: initialCountdownValues,

  setCurrentStage: (stage: DataPresaleStage | null, nextStage: DataPresaleStage | null) => {
    if (stage) {
      set({
        currentStageIndex: stage.index - 1, // Store 0-indexed
        currentPrice: stage.price,
        nextPrice: nextStage ? nextStage.price : null,
      });
    } else {
      // Handle case where presale might be over or not yet started
      const now = new Date().toISOString();
      if (now < PRESALE_START_DATE) {
        set({ currentStageIndex: -1, currentPrice: STAGES[0].price, nextPrice: STAGES[0].price });
      } else if (now > PRESALE_END_DATE) {
        set({ currentStageIndex: STAGES.length, currentPrice: STAGES[STAGES.length-1].price, nextPrice: null });
      }
    }
  },
  
  setTokensSold: (sold: number) => set({ tokensSold: sold }),
  
  setPresaleStatus: (isActive: boolean, hasEnded: boolean) => set({ presaleActive: isActive, presaleEnded: hasEnded }),

  setTimeLeftInStage: (time: CountdownValues) => set({ timeLeftInStage: time }),
  setTotalTimeLeft: (time: CountdownValues) => set({ totalTimeLeft: time }),
}));

// Function to find current stage based on current time
export const findCurrentPresaleStage = (): { current: DataPresaleStage | null; next: DataPresaleStage | null } => {
  const now = new Date();
  let currentStage: DataPresaleStage | null = null;
  let nextStage: DataPresaleStage | null = null;

  for (let i = 0; i < STAGES.length; i++) {
    const stage = STAGES[i];
    const stageStart = new Date(stage.start);
    const stageEnd = new Date(stage.end);

    if (now >= stageStart && now <= stageEnd) {
      currentStage = stage;
      if (i + 1 < STAGES.length) {
        nextStage = STAGES[i+1];
      }
      break;
    }
  }
  // If no current stage found, and presale hasn't started, currentStage is null.
  // If presale has ended, currentStage might be the last stage or null depending on exact timing.
  // This logic could be refined based on how "ended" state is visually presented.
  return { current: currentStage, next: nextStage };
};

// Update store based on current time - could be called periodically or on specific events
export const updatePresaleStoreWithCurrentStage = () => {
  const { current, next } = findCurrentPresaleStage();
  const now = new Date();
  const presaleIsActive = now >= new Date(PRESALE_START_DATE) && now <= new Date(PRESALE_END_DATE);
  const presaleHasEnded = now > new Date(PRESALE_END_DATE);
  
  usePresaleStore.getState().setCurrentStage(current, next);
  usePresaleStore.getState().setPresaleStatus(presaleIsActive, presaleHasEnded);
};

// Initialize store state
updatePresaleStoreWithCurrentStage();
// Optionally, set an interval to auto-update stage info if app is long-lived
// setInterval(updatePresaleStoreWithCurrentStage, 60000); // Update every minute

export default usePresaleStore;
