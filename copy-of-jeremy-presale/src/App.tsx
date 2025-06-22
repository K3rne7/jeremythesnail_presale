
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, bsc, bscTestnet } from 'wagmi/chains'; // Add other chains as needed
import { RainbowKitProvider, connectorsForWallets, darkTheme as rainbowDarkTheme, ConnectButton } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, trustWallet, ledgerWallet, walletConnectWallet, okxWallet } from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

import Hero from './components/Hero';
import CountdownWithPrice from './components/CountdownWithPrice';
import ProgressBar from './components/ProgressBar';
import BuyPanel from './components/BuyPanel';
import ClaimPanel from './components/ClaimPanel';
import LanguageSwitcher from './components/LanguageSwitcher'; // Import LanguageSwitcher
// Lazy load other sections for better initial load time
const SectionTokenomics = lazy(() => import('./components/SectionTokenomics'));
const SectionRoadmap = lazy(() => import('./components/SectionRoadmap'));
const SectionTeam = lazy(() => import('./components/SectionTeam'));
const SectionFAQ = lazy(() => import('./components/SectionFAQ'));

import { TARGET_CHAIN_ID, WALLETCONNECT_PROJECT_ID, SOCIAL_LINKS, WHITEPAPER_URL, AUDIT_REPORT_URL, PRESALE_CONTRACT_ADDRESS, LOGO_URL_SVG } from './constants';
import { Link as ScrollLink } from 'react-scroll';
import { useTranslation } from 'react-i18next';


const projectId = WALLETCONNECT_PROJECT_ID;

// This check is already in constants.ts, but keeping it here as an additional safeguard before RainbowKit init.
if (!projectId) {
  // This will likely be caught by constants.ts first if it throws.
  console.error("VITE_WALLETCONNECT_PROJECT_ID is not defined. WalletConnect may not initialize correctly.");
  // Consider throwing an error or rendering a fallback UI if this is critical path for app load
}

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, trustWallet, walletConnectWallet, okxWallet, ledgerWallet],
    },
  ],
  {
    appName: 'Jeremy Presale',
    projectId: projectId || "fallback_project_id", // Provide a fallback to avoid crash if not set, though constants.ts should catch it
  }
);

// Determine chain based on TARGET_CHAIN_ID from .env
const targetChain = TARGET_CHAIN_ID === 56 ? bsc : 
                    TARGET_CHAIN_ID === 1 ? mainnet :
                    TARGET_CHAIN_ID === 97 ? bscTestnet : bsc; // Default to bsc if unknown

const wagmiConfig = createConfig({
  chains: [targetChain], // The primary chain for the app.
  connectors,
  transports: { // Define transports for all chains that targetChain could be, to satisfy types.
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
  ssr: false, // Important for Vite/React
});

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { t } = useTranslation();

  const navLinks = [
    { to: "hero", label: t("navigation.home") },
    { to: "countdown", label: t("navigation.presale_info") },
    { to: "buy-panel", label: t("navigation.buy_token") },
    { to: "tokenomics", label: t("navigation.tokenomics") },
    { to: "roadmap", label: t("navigation.roadmap") },
    { to: "team", label: t("navigation.team") },
    { to: "faq", label: t("navigation.faq") },
  ];

  return (
      <div className="flex flex-col min-h-screen bg-neutral-dark text-neutral-light scroll-smooth" style={{scrollSnapType: 'y proximity'}}>
        <Header navLinks={navLinks} />
        <main className="flex-grow">
          {/* Wrap sections for scroll snapping behavior */}
          <div style={{scrollSnapAlign: 'start'}}><Hero /></div>
          <div style={{scrollSnapAlign: 'start'}}><CountdownWithPrice /></div>
          <div style={{scrollSnapAlign: 'start'}}><ProgressBar /></div>
          
          <div className="container mx-auto px-4 py-12 md:py-16 grid lg:grid-cols-5 gap-8 items-start">
              <div id="buy-claim-area" className="lg:col-span-3">
                    <div style={{scrollSnapAlign: 'start'}} className="mb-12"><BuyPanel /></div>
              </div>
              <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-24"> {/* Sticky Claim panel */}
                  <div style={{scrollSnapAlign: 'start'}}><ClaimPanel /></div>
                  <SocialBar />
              </div>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <div style={{scrollSnapAlign: 'start'}}><SectionTokenomics /></div>
            <div style={{scrollSnapAlign: 'start'}}><SectionRoadmap /></div>
            <div style={{scrollSnapAlign: 'start'}}><SectionTeam /></div>
            <div style={{scrollSnapAlign: 'start'}}><SectionFAQ /></div>
          </Suspense>
        </main>
        <Footer />
      </div>
  );
}


const App: React.FC = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
            theme={rainbowDarkTheme({
                accentColor: '#5E00BC', // primary.DEFAULT
                accentColorForeground: 'white',
                borderRadius: 'medium',
                fontStack: 'system',
            })}
            modalSize="compact"
        >
          {/* Suspense for i18next loading */}
          <Suspense fallback={<LoadingSpinner />}> 
            <HashRouter>
              <AppContent />
            </HashRouter>
          </Suspense>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

interface HeaderProps {
  navLinks: Array<{ to: string; label: string }>;
}

const Header: React.FC<HeaderProps> = ({ navLinks }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <ScrollLink to="hero" smooth={true} duration={500} className="cursor-pointer">
          <img src={LOGO_URL_SVG} alt="Jeremy Logo" className="h-10 md:h-12 filter drop-shadow-[0_2px_3px_rgba(255,215,0,0.5)]" />
        </ScrollLink>
        <nav className="hidden lg:flex space-x-1 xl:space-x-2 items-center">
          {navLinks.map(link => (
            <ScrollLink
              key={link.to}
              to={link.to}
              smooth={true}
              duration={500}
              offset={-80}
              className="px-2 py-2 text-sm text-neutral-300 hover:text-secondary-light font-medium transition-colors rounded-md hover:bg-neutral-700/50"
              activeClass="text-secondary-light bg-neutral-700/50" 
            >
              {link.label}
            </ScrollLink>
          ))}
        </nav>
        <div className="flex items-center space-x-2 md:space-x-3">
            <LanguageSwitcher />
            <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;
                return (
                <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
                    {(() => {
                    if (!connected) {
                        return <button onClick={openConnectModal} type="button" className="bg-primary-DEFAULT hover:bg-primary-light text-white font-semibold py-2 px-3 md:px-4 rounded-lg shadow-md transition-colors text-xs md:text-sm">{t("navigation.connect_wallet")}</button>;
                    }
                    if (chain.unsupported) {
                        return <button onClick={openChainModal} type="button" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 md:px-4 rounded-lg shadow-md transition-colors text-xs md:text-sm">{t("navigation.wrong_network")}</button>;
                    }
                    return (
                        <div style={{ display: 'flex', gap: '8px' }}> {/* Reduced gap */}
                        <button onClick={openChainModal} style={{ display: 'flex', alignItems: 'center', border: '1px solid #374151', borderRadius: '8px', padding: '6px 8px' }} className="bg-neutral-700 hover:bg-neutral-600 text-xs md:text-sm"> {/* Reduced padding */}
                            {chain.hasIcon && <div style={{ background: chain.iconBackground, width: 14, height: 14, borderRadius: 999, overflow: 'hidden', marginRight: 4 }}>{chain.iconUrl && <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 14, height: 14 }} />}</div>}
                            {chain.name}
                        </button>
                        <button onClick={openAccountModal} type="button" style={{border: '1px solid #374151', borderRadius: '8px', padding: '6px 8px'}} className="bg-neutral-700 hover:bg-neutral-600 text-xs md:text-sm"> {/* Reduced padding */}
                            {account.displayName}
                            {/* {account.displayBalance ? ` (${account.displayBalance})` : ''} Balance display can make it too wide */}
                        </button>
                        </div>
                    );
                    })()}
                </div>
                );
            }}
            </ConnectButton.Custom>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-neutral-200 hover:text-secondary-light">
                {menuOpen ? 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                }
            </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-neutral-800/95 py-2 absolute w-full shadow-xl">
          {navLinks.map(link => (
            <ScrollLink
              key={link.to}
              to={link.to}
              smooth={true}
              duration={500}
              offset={-80} 
              className="block px-4 py-3 text-neutral-300 hover:text-secondary-light hover:bg-neutral-700 transition-colors"
              onClick={() => setMenuOpen(false)} 
              activeClass="text-secondary-light bg-neutral-700"
            >
              {link.label}
            </ScrollLink>
          ))}
        </div>
      )}
    </header>
  );
};

const SocialBar: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-neutral-700/50 p-4 rounded-lg shadow-lg border border-neutral-600">
            <h4 className="text-lg font-semibold text-secondary-light mb-3 text-center">{t("social_bar.title")}</h4>
            <div className="flex justify-around items-center">
            {SOCIAL_LINKS.map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" title={link.name}
                className="text-neutral-400 hover:text-accent-light transform transition-transform hover:scale-125 text-2xl">
                <i className={link.icon}></i>
                </a>
            ))}
            </div>
            {/* Font Awesome CDN for icons - consider SVG icons for better performance/bundling */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        </div>
    );
};

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
  <footer className="bg-neutral-900 border-t border-neutral-700 text-neutral-400 py-10 text-center">
    <div className="container mx-auto px-4">
      <img src={LOGO_URL_SVG} alt="Jeremy Logo" className="h-12 mx-auto mb-4 opacity-70" />
      <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mb-6">
        <a href={WHITEPAPER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-light transition-colors">{t("footer.whitepaper")}</a>
        <a href={AUDIT_REPORT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-light transition-colors">{t("footer.audit_report")}</a>
        <a href={`https://bscscan.com/address/${PRESALE_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-light transition-colors">{t("footer.presale_contract")}</a>
      </div>
      <p className="text-xs mb-2 max-w-2xl mx-auto">
        {t("footer.disclaimer")}
      </p>
      <p className="text-xs">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
    </div>
  </footer>
  );
};

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-neutral-dark fixed inset-0 z-[100]">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-secondary-DEFAULT mb-4"></div>
      <p className="text-lg text-neutral-200">{t("common.loading_spinner_alt")}</p>
    </div>
  );
};

export default App;
