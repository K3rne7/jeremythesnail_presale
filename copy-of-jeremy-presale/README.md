
# Jeremy ($JEREMY) Token Presale Website

This project is the official presale website for the $JEREMY BEP-20 token on the Binance Smart Chain.

![Jeremy Presale Hero](https://raw.githubusercontent.com/username-placeholder/jeremy-presale-assets/main/jeremy-presale-1.jpg) 
<!-- Replace with an actual screenshot or relevant image URL -->

## ✨ Features

*   **Multi-Stage Presale:** Countdown timer with automatic price increments per stage.
*   **Real-time Progress:** Progress bar showing collected funds (simulated via polling contract).
*   **Wallet Integration:** Connect with MetaMask, Trust Wallet, WalletConnect v2, Ledger, OKX via RainbowKit.
*   **Buy & Claim:** Securely buy $JEREMY tokens with BNB or USDT (example stablecoin) and claim them after presale.
*   **Responsive Design:** Looks great on all devices, from mobile to desktop.
*   **Animated & Engaging UI:** Smooth animations using GSAP for a cool user experience.
*   **Key Sections:** Hero, Tokenomics (with chart), Roadmap, Team, FAQ.
*   **Dark Theme:** Sleek and modern dark theme.
*   **Internationalization:** Supports English (en) and Italian (it) out of the box (via i18next).

## 🛠️ Tech Stack

*   **Framework:** Vite + React 18 + TypeScript
*   **Styling:** Tailwind CSS (JIT) + Headless UI
*   **State Management:** Zustand
*   **Web3:** wagmi v2, viem, RainbowKit, ethers v6
*   **Animations:** GSAP v3 (GreenSock Animation Platform)
*   **Routing:** React Router v6 (HashRouter for SPA compatibility)
*   **Internationalization:** i18next
*   **Utility:** date-fns

## 🚀 Getting Started

Follow these steps to get the project running locally:

**1. Clone the Repository**

```bash
git clone https://github.com/your-username/jeremy-presale.git 
cd jeremy-presale
```

**2. Install Dependencies**

This project uses `yarn` as the package manager.

```bash
yarn install
```

**3. Set Up Environment Variables**

Copy the example environment file and fill in your contract addresses and API keys:

```bash
cp .env.example .env
```

Open `.env` and update the following variables:

```env
# Required: Smart Contract Addresses (on Binance Smart Chain)
VITE_PRESALE_CONTRACT_ADDRESS="0xYourPresaleContractAddressHere"
VITE_TOKEN_CONTRACT_ADDRESS="0xYourJeremyTokenContractAddressHere" # $JEREMY token
VITE_USDT_CONTRACT_ADDRESS="0xYourUSDTContractAddressHere" # Or other stablecoin you support
VITE_BUSD_CONTRACT_ADDRESS="0xYourBUSDContractAddressHere" # (BUSD is being phased out, consider alternatives)

# Required: Chain ID for the network
VITE_CHAIN_ID="56" # 56 for BSC Mainnet, 97 for BSC Testnet

# Required for WalletConnect v2
VITE_WALLETCONNECT_PROJECT_ID="your_wallet_connect_project_id" # Get from https://cloud.walletconnect.com

# Optional: Alchemy or Infura ID if you want to use a custom RPC endpoint (RainbowKit/wagmi can use public RPCs too)
# VITE_ALCHEMY_ID="your_alchemy_id"
```

**Important:**
*   Ensure the smart contracts (`VITE_PRESALE_CONTRACT_ADDRESS`, `VITE_TOKEN_CONTRACT_ADDRESS`, `VITE_USDT_CONTRACT_ADDRESS`) are deployed on the network specified by `VITE_CHAIN_ID`.
*   The ABI for the Presale contract is located in `src/abi/Presale.json`. Update it if your contract interface changes.
*   The `stages.ts` file (`src/data/stages.ts`) dynamically generates presale stages based on configuration. Adjust dates and prices there if needed.

**4. Run the Development Server**

```bash
yarn dev
```

The application will be available at `http://localhost:5173`.

## 🧪 Running Tests

**Unit Tests (Vitest + React Testing Library)**

```bash
yarn test
```

**End-to-End Tests (Cypress)**

To open the Cypress test runner:

```bash
yarn test:e2e 
# or yarn cy:open (if you prefer that alias)
```

Ensure your development server (`yarn dev`) is running in a separate terminal before starting E2E tests if they target the live dev environment.

## 🏗️ Building for Production

To create a production build:

```bash
yarn build
```

The optimized static assets will be generated in the `dist/` directory.

## ☁️ Deployment

This Vite + React application can be deployed to any static hosting service like Netlify, Vercel, GitHub Pages, etc.

**Example: Deploying to Netlify/Vercel**

1.  Push your code to a GitHub/GitLab/Bitbucket repository.
2.  Connect your repository to Netlify or Vercel.
3.  Configure the build settings:
    *   **Build command:** `yarn build` (or `npm run build`)
    *   **Publish directory:** `dist`
4.  Set up your environment variables (from your `.env` file) in the Netlify/Vercel project settings.
5.  Deploy!

A `yarn deploy` script is a placeholder; you'll typically rely on the CI/CD integration of your hosting provider.

## ⚙️ CI/CD (GitHub Actions)

A basic GitHub Actions workflow is provided in `.github/workflows/ci.yml`. This workflow typically includes:

*   Linting the code (`yarn lint`)
*   Running unit tests (`yarn test`)
*   Building the project (`yarn build`)
*   (Optionally) Deploying to a hosting provider on pushes to the main branch.

Customize this workflow to fit your deployment strategy.

## 🎨 Customization

*   **Branding & Images:** Replace placeholder images in `public/` and `src/assets/`. Update image URLs in `src/constants.ts`.
*   **Tailwind CSS Theme:** Modify colors, fonts, and other theme settings in `tailwind.config.js` and the `<script>` block in `index.html`.
*   **Presale Logic:** Adjust presale stages, dates, and prices in `src/data/stages.ts`.
*   **Smart Contract ABI:** Update `src/abi/Presale.json` and `src/abi/ERC20.json` if your contract interfaces change.
*   **Text & Content:** Modify text content directly in components or through the localization files in `src/locales/`.
*   **Animations:** GSAP animations are defined in `src/components/gsap/animations.ts`.

## 🖼️ Provided Images

This project template includes references to example images that you should replace with your actual project assets. The placeholder URLs point to `https://raw.githubusercontent.com/username-placeholder/jeremy-presale-assets/main/`. You should:
1. Create a public repository (e.g., on GitHub) named `jeremy-presale-assets`.
2. Upload your images (like those provided in the prompt: `jeremy-presale-1.jpg` to `jeremy-presale-6.jpg`) to this repository.
3. Update the `GITHUB_ASSETS_BASE_URL` in `src/constants.ts` to point to your repository's raw content URL, or host your images on a CDN and update the URLs accordingly.
4. Ensure `jeremy-logo.svg` in `src/assets/` is your actual project logo.

## 📜 License

This project is licensed under the MIT License. (Or specify your preferred license).
This project is for demonstration purposes and should be thoroughly audited and tested before use in a live production environment handling real assets.
