export interface PresaleStage {
  index: number;
  price: number; // Price in USD
  start: string; // ISO date string
  end: string;   // ISO date string
}

export enum PurchaseCurrency {
  BNB = 'BNB',
  USDT = 'USDT',
  BUSD = 'BUSD', // BUSD is being phased out, consider alternatives like USDC if this is a new project
}

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PresaleState {
  currentStageIndex: number; // 0-indexed internal
  currentPrice: number; // USD
  nextPrice: number | null;
  tokensSold: number; // Amount of $JEREMY tokens sold
  hardCap: number; // Total $JEREMY tokens for presale
  presaleEnded: boolean;
  presaleActive: boolean;
  timeLeftInStage: CountdownValues;
  totalTimeLeft: CountdownValues;
  setCurrentStage: (stage: PresaleStage | null, nextStage: PresaleStage | null) => void;
  setTokensSold: (sold: number) => void;
  setPresaleStatus: (isActive: boolean, hasEnded: boolean) => void;
  setTimeLeftInStage: (time: CountdownValues) => void;
  setTotalTimeLeft: (time: CountdownValues) => void;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string; // URL to image
  bio: string;
}

export interface RoadmapItem {
  quarter: string; // e.g., "Q3 2025"
  title: string;
  description: string;
  completed: boolean;
}

// Ensure environment variables are typed if accessed directly outside wagmi config
declare global {
  interface ImportMetaEnv {
    readonly VITE_PRESALE_CONTRACT_ADDRESS: string;
    readonly VITE_TOKEN_CONTRACT_ADDRESS: string; // For $JEREMY token
    readonly VITE_USDT_CONTRACT_ADDRESS: string; // Example stablecoin
    readonly VITE_BUSD_CONTRACT_ADDRESS: string; // Example stablecoin
    readonly VITE_CHAIN_ID: string;
    readonly VITE_ALCHEMY_ID?: string; // Optional if using Alchemy
    readonly VITE_WALLETCONNECT_PROJECT_ID: string;
    // DEV is a built-in Vite type, no need to redeclare here if augmenting
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
