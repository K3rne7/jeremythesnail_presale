import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import { PRESALE_END_DATE } from '../constants';
import { WalletIcon } from './icons/WalletIcon';
import { SnailIcon } from './icons/SnailIcon';
import { MushroomIcon } from './icons/MushroomIcon';
import { EyeballIcon } from './icons/EyeballIcon';
import { BnbIcon } from './icons/BnbIcon';
import { EthIcon } from './icons/EthIcon';
import { BtcIcon } from './icons/BtcIcon';
import { SolIcon } from './icons/SolIcon';
import { UsdcIcon } from './icons/UsdcIcon';
import { UsdtIcon } from './icons/UsdtIcon';


const PsychedelicConfetti: React.FC = () => {
    const particles = Array.from({ length: 30 }); // 30 particles for the explosion
    const icons = [
        <SnailIcon className="w-full h-full text-pink-500" />,
        <MushroomIcon className="w-full h-full text-green-500" />,
        <EyeballIcon className="w-full h-full text-cyan-400" />,
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((_, i) => {
                const size = Math.random() * 2 + 1; // size between 1rem and 3rem
                const animationDuration = Math.random() * 2 + 3; // 3s to 5s
                const animationDelay = Math.random() * 0.5;
                const startX = Math.random() * 100;
                const endX = startX + (Math.random() - 0.5) * 200;
                const keyframes = `
                    @keyframes confetti-fall-${i} {
                        0% { transform: translate(${startX}vw, -20vh) rotate(0deg); opacity: 1; }
                        100% { transform: translate(${endX}vw, 120vh) rotate(720deg); opacity: 0; }
                    }
                `;
                return (
                    <React.Fragment key={i}>
                        <style>{keyframes}</style>
                        <div
                            className="absolute top-0 left-0"
                            style={{
                                width: `${size}rem`,
                                height: `${size}rem`,
                                animation: `confetti-fall-${i} ${animationDuration}s linear ${animationDelay}s forwards`,
                            }}
                        >
                            {icons[i % icons.length]}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const paymentCurrencies = [
  { name: 'BNB', icon: <BnbIcon className="w-6 h-6" />, rate: 5_000_000, placeholder: '1.0', usdRate: 580 },
  { name: 'ETH', icon: <EthIcon className="w-6 h-6" />, rate: 90_540_000, placeholder: '0.05', usdRate: 3500 },
  { name: 'WBTC', displayName: 'BTC', icon: <BtcIcon className="w-6 h-6" />, rate: 1_750_000_000, placeholder: '0.001', usdRate: 68000 },
  { name: 'SOL', icon: <SolIcon className="w-6 h-6" />, rate: 4_200_000, placeholder: '1.5', usdRate: 165 },
  { name: 'USDC', icon: <UsdcIcon className="w-6 h-6" />, rate: 250_000, placeholder: '100', usdRate: 1 },
  { name: 'USDT', icon: <UsdtIcon className="w-6 h-6" />, rate: 250_000, placeholder: '100', usdRate: 1 },
];

const HARD_CAP = 2_000_000;
const INITIAL_RAISED = 1_500_000;

const PresaleCard: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(paymentCurrencies[0]);
  const [payAmount, setPayAmount] = useState(paymentCurrencies[0].placeholder);
  const [jeremyAmount, setJeremyAmount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [raisedAmount, setRaisedAmount] = useState(INITIAL_RAISED);


  const progressPercent = Math.min((raisedAmount / HARD_CAP) * 100, 100);

  const handleCurrencySelect = (currency: typeof paymentCurrencies[0]) => {
    setSelectedCurrency(currency);
    setPayAmount(currency.placeholder);
  };

  useEffect(() => {
    const pay = parseFloat(payAmount);
    if (!isNaN(pay) && pay > 0) {
      setJeremyAmount(pay * selectedCurrency.rate);
    } else {
      setJeremyAmount(0);
    }
  }, [payAmount, selectedCurrency]);
  
  const handleConnectWallet = () => {
    setIsLoading(true);
    setTimeout(() => {
      setWalletConnected(true);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleBuy = () => {
    setIsLoading(true);
    
    const pay = parseFloat(payAmount);
    if (isNaN(pay) || pay <= 0) {
        setIsLoading(false);
        return;
    }
    
    const usdValue = pay * selectedCurrency.usdRate;
    
    setTimeout(() => {
      setRaisedAmount(prev => Math.min(prev + usdValue, HARD_CAP));
      setPurchaseComplete(true);
      setIsLoading(false);
    }, 2000);
  };

  if (purchaseComplete) {
    return (
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center border-2 border-purple-500/50 shadow-purple-500/30 relative">
        <PsychedelicConfetti />
        <h3 className="text-3xl font-bold text-white mb-4">YOU'RE ON THE TRIP!</h3>
        <p className="text-[#A9A9D5] mb-6">Welcome to the snail trail, you magnificent degen.</p>
        <div className="text-2xl font-black bg-gradient-to-r from-pink-500 to-cyan-400 p-4 rounded-xl text-white">
          You scored {jeremyAmount.toLocaleString()} $JEREMY!
        </div>
        <button 
          onClick={() => {
            setPurchaseComplete(false);
            setWalletConnected(true); // Keep wallet connected
          }} 
          className="mt-6 w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg hover:shadow-cyan-400/40 transition-all transform hover:scale-105"
        >
          Get More Slime
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-purple-500/50 shadow-purple-500/30">
      <h3 className="text-center text-3xl font-bold text-white mb-2">The Trip is On!</h3>
      <p className="text-center text-[#A9A9D5] mb-6">The portal closes in:</p>
      
      <CountdownTimer targetDate={PRESALE_END_DATE} />

      <div className="mt-6">
        <div className="w-full bg-gray-900/70 rounded-full h-4 mb-2 shadow-inner relative overflow-hidden">
            <div className="absolute bg-gradient-to-r from-[#FF00E5] to-[#00F2FF] h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
             {/* Little snail on the progress bar */}
            <div className="absolute top-1/2 -mt-3.5 transition-all duration-500 ease-out" style={{ left: `calc(${progressPercent}% - 14px)` }}>
                <SnailIcon className="w-7 h-7 text-[#00F2FF] transform -scale-x-100 snail-progress-glow" />
            </div>
        </div>
        <div className="flex justify-between text-sm font-bold text-[#A9A9D5]">
          <span>Soft Cap</span>
          <span>Hard Cap</span>
        </div>
        <p className="text-center font-bold mt-1 text-white">Raised: {raisedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })} / {HARD_CAP.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
            <label className="font-bold text-sm text-center block text-[#A9A9D5] mb-2">Pay With</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {paymentCurrencies.map((currency) => (
                    <button
                        key={currency.name}
                        onClick={() => handleCurrencySelect(currency)}
                        className={`w-full p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border-2 ${selectedCurrency.name === currency.name ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/20' : 'bg-black/30 border-transparent hover:bg-white/10 hover:border-white/20'}`}
                    >
                        {currency.icon}
                        <span className="text-xs font-bold text-white">{currency.displayName || currency.name}</span>
                    </button>
                ))}
            </div>
        </div>

        <div>
          <label className="font-bold text-sm text-[#A9A9D5]">{`You pay (${selectedCurrency.displayName || selectedCurrency.name})`}</label>
          <input 
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-full p-3 mt-1 bg-black/50 border-2 border-purple-500/50 rounded-xl focus:ring-2 focus:ring-[#00F2FF] focus:border-[#00F2FF] outline-none transition text-white placeholder:text-gray-500"
            placeholder={selectedCurrency.placeholder}
          />
        </div>
        <div>
          <label className="font-bold text-sm text-[#A9A9D5]">You get ($JEREMY)</label>
          <div className="w-full p-3 mt-1 bg-black/30 border-2 border-purple-500/30 rounded-xl font-bold text-white">
            {jeremyAmount.toLocaleString()}
          </div>
        </div>
        
        {!walletConnected ? (
          <button 
            onClick={handleConnectWallet}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 relative overflow-hidden shimmer-button"
          >
            {isLoading ? 'Connecting...' : <> <WalletIcon className="w-5 h-5" /> Connect Wallet </>}
          </button>
        ) : (
          <button 
            onClick={handleBuy}
            disabled={isLoading || !payAmount || parseFloat(payAmount) <= 0}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 relative overflow-hidden shimmer-button"
          >
            {isLoading ? 'Processing...' : 'Secure the Slime'}
          </button>
        )}
        {walletConnected && !isLoading && <p className="text-center text-xs text-cyan-400 font-bold">Wallet Connected: 0x...a1b2</p>}
      </div>
    </div>
  );
};

export default PresaleCard;