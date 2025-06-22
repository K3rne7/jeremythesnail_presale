
import { PresaleStage, HARD_CAP_TOKENS as PREDEFINED_HARD_CAP } from './data/stages';
import jeremyLogoPath from './assets/jeremy-logo.svg';

// Environment Variable Checks
if (!import.meta.env.VITE_PRESALE_CONTRACT_ADDRESS) {
  throw new Error("CRITICAL: VITE_PRESALE_CONTRACT_ADDRESS is not defined in your .env file. Application cannot start.");
}
if (!import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS) {
  throw new Error("CRITICAL: VITE_TOKEN_CONTRACT_ADDRESS is not defined in your .env file. Application cannot start.");
}
if (!import.meta.env.VITE_CHAIN_ID) {
  throw new Error("CRITICAL: VITE_CHAIN_ID is not defined in your .env file. Application cannot start.");
}
if (!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID) {
  // This was previously a console.warn, upgrading to an error for consistency as it's critical for wallet connectivity.
  throw new Error("CRITICAL: VITE_WALLETCONNECT_PROJECT_ID is not defined in your .env file. WalletConnect will not work, and the application cannot start correctly.");
}
// Optional but recommended for stablecoin functionality if used
if (!import.meta.env.VITE_USDT_CONTRACT_ADDRESS) {
  console.warn("WARNING: VITE_USDT_CONTRACT_ADDRESS is not defined. USDT purchase functionality will be affected.");
}


export const PRESALE_CONTRACT_ADDRESS = import.meta.env.VITE_PRESALE_CONTRACT_ADDRESS as `0x${string}`;
export const TOKEN_CONTRACT_ADDRESS = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS as `0x${string}`; // JEREMY token
export const USDT_CONTRACT_ADDRESS = (import.meta.env.VITE_USDT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`; // Example USDT, provide a fallback for type safety if not set after warning
export const BUSD_CONTRACT_ADDRESS = (import.meta.env.VITE_BUSD_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`; // Example BUSD

export const TARGET_CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID, 10); 

export const HARD_CAP_TOKENS = PREDEFINED_HARD_CAP; // Use from stages.ts
export const MIN_PURCHASE_BNB = 0.1;
export const MAX_PURCHASE_BNB = 10;
export const MIN_PURCHASE_USD = 50; // Min purchase for stablecoins
export const MAX_PURCHASE_USD = 5000; // Max purchase for stablecoins

export const POLLING_INTERVAL_GENERAL = 15000; // 15 seconds for general data refresh
export const POLLING_INTERVAL_PRICE = 60000; // 1 minute for price (if it can change outside stage progression)

export const JEREMY_TOKEN_SYMBOL = "$JEREMY";
export const JEREMY_TOKEN_DECIMALS = 18; // Standard ERC20 decimals

export const DEFAULT_REFERRER_ADDRESS = "0x0000000000000000000000000000000000000000";

// Use the imported path for the logo
export const LOGO_URL_SVG = jeremyLogoPath;

// Placeholder URLs for images. Replace with actual hosted image URLs or import them.
// Best to host these on a CDN or within your public folder.
const GITHUB_ASSETS_BASE_URL = "https://raw.githubusercontent.com/username-placeholder/jeremy-presale-assets/main/";

export const HERO_BACKGROUND_IMAGE_URL = `${GITHUB_ASSETS_BASE_URL}jeremy-presale-1.jpg`;
export const SNAIL_THRONE_IMAGE_URL = `${GITHUB_ASSETS_BASE_URL}jeremy-presale-2.jpg`;
export const SNAIL_TROPHY_IMAGE_URL = `${GITHUB_ASSETS_BASE_URL}jeremy-presale-3.jpg`;
export const SNAIL_GRAFFITI_IMAGE_URL = `${GITHUB_ASSETS_BASE_URL}jeremy-presale-4.jpg`;
export const SNAIL_COUPLE_IMAGE_URL = `${GITHUB_ASSETS_BASE_URL}jeremy-presale-5.jpg`;
export const SNAIL_HAPPY_IMAGE_URL = `${GITHUB_ASSETS_BASE_URL}jeremy-presale-6.jpg`;

export const TOKENOMICS_CHART_IMAGE_URL = SNAIL_TROPHY_IMAGE_URL; // Re-use an image for placeholder
export const TEAM_MEMBER_PLACEHOLDER_IMAGE_URL = SNAIL_HAPPY_IMAGE_URL;

export const WHITEPAPER_URL = "/Whitepaper.pdf"; // Assume it's in public folder
export const AUDIT_REPORT_URL = "/Audit.pdf";   // Assume it's in public folder

export const SOCIAL_LINKS = [
  { name: "Telegram", url: "https://t.me/jeremycoin", icon: "fab fa-telegram-plane" },
  { name: "X", url: "https://x.com/jeremycoin", icon: "fab fa-twitter" },
  { name: "Instagram", url: "https://instagram.com/jeremycoin", icon: "fab fa-instagram" },
  { name: "TikTok", url: "https://tiktok.com/@jeremycoin", icon: "fab fa-tiktok" },
  { name: "Reddit", url: "https://reddit.com/r/jeremycoin", icon: "fab fa-reddit-alien" },
];

export const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
// The check at the top of the file handles if WALLETCONNECT_PROJECT_ID is missing.
