
import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useBalance, useSimulateContract, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther, maxUint256, parseUnits, formatUnits } from 'viem';
import { Switch } from '@headlessui/react';
import usePresaleStore from '../hooks/usePresaleStore';
import PresaleABI from '../abi/Presale.json';
import ERC20ABI from '../abi/ERC20.json'; // A standard ERC20 ABI
import { 
  PRESALE_CONTRACT_ADDRESS, 
  USDT_CONTRACT_ADDRESS, // Assuming USDT for stablecoin example
  JEREMY_TOKEN_SYMBOL, 
  DEFAULT_REFERRER_ADDRESS,
  MIN_PURCHASE_BNB, MAX_PURCHASE_BNB, MIN_PURCHASE_USD, MAX_PURCHASE_USD, TARGET_CHAIN_ID
} from '../constants';
import { PurchaseCurrency } from '../types'; 

// Define USD_AMOUNTS for quick selection
const USD_AMOUNTS = [50, 100, 250, 500, 1000, 2500];
// Define BNB_AMOUNTS for quick selection
const BNB_AMOUNTS = [0.1, 0.25, 0.5, 1, 2.5, 5];

const BuyPanel: React.FC = () => {
  const { address, chainId, isConnected } = useAccount();
  const { currentPrice, presaleActive, presaleEnded } = usePresaleStore();
  
  const [purchaseCurrency, setPurchaseCurrency] = useState<PurchaseCurrency>(PurchaseCurrency.BNB);
  const [payAmount, setPayAmount] = useState<string>(''); 
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [referrer, setReferrer] = useState<string>(DEFAULT_REFERRER_ADDRESS);
  const [isLoading, setIsLoading] = useState<boolean>(false); // General loading for UI elements
  const [txMessage, setTxMessage] = useState<string | null>(null); // For general messages
  const [error, setError] = useState<string | null>(null);
  const [bnBPriceUSD, setBnbPriceUSD] = useState<number>(300); 

  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;
  const isStableCoinPurchaseDisabled = purchaseCurrency !== PurchaseCurrency.BNB; // True if USDT/BUSD selected

  useEffect(() => {
    const fetchPrice = async () => {
        await new Promise(resolve => setTimeout(resolve, 100)); 
        setBnbPriceUSD(580); 
    };
    fetchPrice();
  }, []);

  const { data: bnbBalance } = useBalance({ address: address, query: { enabled: isConnected && purchaseCurrency === PurchaseCurrency.BNB } });
  const { data: usdtBalance } = useBalance({ address: address, token: USDT_CONTRACT_ADDRESS, query: { enabled: isConnected && purchaseCurrency === PurchaseCurrency.USDT } });

  const selectedCurrencyBalance = purchaseCurrency === PurchaseCurrency.BNB ? bnbBalance : usdtBalance;
  // Fallback to 18 if decimals not found, though USDT usually has 6 or 18. BUSD has 18.
  const currencyDecimals = purchaseCurrency === PurchaseCurrency.BNB ? 18 : (selectedCurrencyBalance?.decimals || 18); 

  useEffect(() => {
    if (parseFloat(payAmount) > 0 && currentPrice > 0) {
      let jeremyTokens;
      if (purchaseCurrency === PurchaseCurrency.BNB) {
        jeremyTokens = (parseFloat(payAmount) * bnBPriceUSD) / currentPrice;
      } else { 
        jeremyTokens = parseFloat(payAmount) / currentPrice;
      }
      setReceiveAmount(jeremyTokens.toFixed(2));
    } else {
      setReceiveAmount('');
    }
  }, [payAmount, currentPrice, purchaseCurrency, bnBPriceUSD]);

  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
        setPayAmount(value);
    }
  };
  
  const handleSetPayAmount = (amount: number) => {
    setPayAmount(amount.toString());
  };

  const getMinMaxValues = () => {
    return purchaseCurrency === PurchaseCurrency.BNB 
        ? { min: MIN_PURCHASE_BNB, max: MAX_PURCHASE_BNB }
        : { min: MIN_PURCHASE_USD, max: MAX_PURCHASE_USD };
  };
  const {min, max} = getMinMaxValues();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20ABI,
    address: USDT_CONTRACT_ADDRESS, // Assuming USDT, make dynamic if BUSD also supported via same logic
    functionName: 'allowance',
    args: [address as `0x${string}`, PRESALE_CONTRACT_ADDRESS],
    query: { enabled: isConnected && purchaseCurrency === PurchaseCurrency.USDT && !!address },
  });

  const needsApproval = purchaseCurrency === PurchaseCurrency.USDT &&
    allowance !== undefined &&
    parseFloat(payAmount) > 0 &&
    allowance < parseUnits(payAmount, currencyDecimals);

  const { data: approveConfig } = useSimulateContract({
    address: USDT_CONTRACT_ADDRESS,
    abi: ERC20ABI,
    functionName: 'approve',
    args: [PRESALE_CONTRACT_ADDRESS, maxUint256],
    query: { enabled: needsApproval && parseFloat(payAmount) > 0 && !!address && purchaseCurrency === PurchaseCurrency.USDT },
  });
  const { writeContract: approveTokens, data: approveTxHash, isPending: isApproving, reset: resetApprove } = useWriteContract();
  
  const { isLoading: isConfirmingApproval, isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({ 
    hash: approveTxHash,
    onReplaced: (replacement) => {
      setTxMessage(replacement.reason === 'cancelled' ? 'Approval cancelled.' : 'Approval replaced.');
    }
  });

  useEffect(() => {
    if (isApprovalSuccess) {
      refetchAllowance();
      setTxMessage(`Successfully approved ${purchaseCurrency}. You can now proceed to buy.`);
      resetApprove(); 
    }
  }, [isApprovalSuccess, refetchAllowance, purchaseCurrency, resetApprove]);

  const handleApprove = async () => {
    if (!approveConfig?.request) {
      setError("Approval preparation failed. Check console.");
      console.error("Approve config error:", approveConfig);
      return;
    }
    setError(null);
    setTxMessage(null);
    try {
      approveTokens(approveConfig.request);
    } catch (e: any) {
      setError(e.shortMessage || e.message || 'Approval failed.');
      console.error(e);
    }
  };

  // --- Buy Logic ---
  // IMPORTANT: The current 'buyTokens' ABI only supports BNB (payable with _referrer arg).
  // For ERC20 (USDT/BUSD), the contract would need a *different* function that takes token address and amount.
  // The 'args' for 'buyTokens' will mismatch for ERC20 if we use the current ABI.
  const valueToSendForBNB = purchaseCurrency === PurchaseCurrency.BNB && parseFloat(payAmount) > 0 ? parseEther(payAmount) : BigInt(0);
  
  // This simulation will LIKELY FAIL for USDT with current 'buyTokens' ABI
  // as it expects only 'referrer' and 'value' for BNB.
  const { data: buyConfig, error: simulateBuyError } = useSimulateContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PresaleABI,
    functionName: 'buyTokens', 
    // For BNB: args should be [referrer]. For (hypothetical) ERC20: [token_addr, token_amount, referrer]
    // The current ABI for buyTokens only has `_referrer`.
    args: [referrer as `0x${string}`], // This is correct for BNB purchase with current ABI
    value: valueToSendForBNB,
    query: { 
      enabled: presaleActive && !presaleEnded && parseFloat(payAmount) > 0 && 
               !needsApproval && !!address && !isWrongNetwork && 
               purchaseCurrency === PurchaseCurrency.BNB // ONLY enable simulation for BNB
    },
  });

  const { writeContract: buyTokens, data: buyTxHash, isPending: isBuying, reset: resetBuy } = useWriteContract();
  const { isLoading: isConfirmingBuy, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({ 
    hash: buyTxHash,
    onReplaced: (replacement) => {
      setTxMessage(replacement.reason === 'cancelled' ? 'Purchase cancelled.' : 'Purchase replaced.');
    }
  });

  useEffect(() => {
    if (isBuySuccess) {
      setTxMessage(`Successfully purchased ${JEREMY_TOKEN_SYMBOL}!`);
      setPayAmount('');
      setReceiveAmount('');
      resetBuy();
      // Optionally refetch balances or total sold from usePresaleStore if needed
      // usePresaleStore.getState().fetchTotalTokensSold(); // Example if such a function exists
    }
  }, [isBuySuccess, resetBuy]);

  const handleBuy = async () => {
    if (purchaseCurrency !== PurchaseCurrency.BNB) {
        setError(`Purchases with ${purchaseCurrency} are not yet supported with the current smart contract functions. Please use BNB or contact support.`);
        return;
    }
    if (!buyConfig?.request) {
      setError(simulateBuyError?.message || "Buy preparation failed. Insufficient funds, invalid amount, or presale inactive. Check console.");
      console.error("Buy config error:", buyConfig, "Simulation error:", simulateBuyError);
      return;
    }
    if (parseFloat(payAmount) < min || parseFloat(payAmount) > max) {
      setError(`Amount must be between ${min} and ${max} ${purchaseCurrency}.`);
      return;
    }
    setError(null);
    setTxMessage(null);
    try {
      buyTokens(buyConfig.request);
    } catch (e: any) {
      setError(e.shortMessage || e.message || 'Purchase failed.');
      console.error(e);
    }
  };
  
  const effectiveIsLoading = isApproving || isConfirmingApproval || isBuying || isConfirmingBuy;

  if (presaleEnded) {
    return (
      <div id="buy-panel" className="bg-neutral-800 p-6 md:p-10 rounded-xl shadow-2xl border border-primary-DEFAULT text-center">
        <h3 className="text-2xl font-display font-bold text-accent-light mb-4">Presale Has Ended</h3>
        <p className="text-neutral-300">Thank you for your interest! The $JEREMY presale is now closed.</p>
        <p className="text-neutral-300 mt-2">You will be able to claim your tokens soon.</p>
      </div>
    );
  }

  if (!presaleActive) {
     return (
      <div id="buy-panel" className="bg-neutral-800 p-6 md:p-10 rounded-xl shadow-2xl border border-primary-DEFAULT text-center">
        <h3 className="text-2xl font-display font-bold text-accent-light mb-4">Presale Not Yet Active</h3>
        <p className="text-neutral-300">The $JEREMY presale has not started yet. Check the countdown above!</p>
      </div>
    );
  }

  return (
    <div id="buy-panel" className="bg-neutral-800 p-6 md:p-10 rounded-xl shadow-2xl border-2 border-primary-DEFAULT transform hover:scale-[1.01] transition-transform duration-300">
      <h3 className="text-3xl font-display font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-secondary-light to-accent-light">
        Buy {JEREMY_TOKEN_SYMBOL}
      </h3>
      
      {!isConnected ? (
        <p className="text-center text-lg text-neutral-300 py-8">Please connect your wallet to participate.</p>
      ) : isWrongNetwork ? (
        <p className="text-center text-lg text-red-500 py-8">Please switch to Binance Smart Chain (ID: {TARGET_CHAIN_ID}) to participate.</p>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className={`font-medium ${purchaseCurrency === PurchaseCurrency.BNB ? 'text-accent-light' : 'text-neutral-400'}`}>BNB</span>
              <Switch
                checked={purchaseCurrency === PurchaseCurrency.USDT}
                onChange={() => {
                  setPurchaseCurrency(cur => cur === PurchaseCurrency.BNB ? PurchaseCurrency.USDT : PurchaseCurrency.BNB);
                  setError(null); // Clear errors on switch
                  setTxMessage(null);
                  setPayAmount(''); // Reset amount on switch
                }}
                className={`${
                  purchaseCurrency === PurchaseCurrency.USDT ? 'bg-secondary-DEFAULT' : 'bg-neutral-600'
                } relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-light focus:ring-offset-2 focus:ring-offset-neutral-800`}
              >
                <span className={`${
                    purchaseCurrency === PurchaseCurrency.USDT ? 'translate-x-7' : 'translate-x-1'
                  } inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <span className={`font-medium ${purchaseCurrency === PurchaseCurrency.USDT ? 'text-accent-light' : 'text-neutral-400'}`}>USDT</span>
            </div>

            {selectedCurrencyBalance && (
                 <p className="text-xs text-neutral-400 text-center mb-3">
                    Balance: {parseFloat(formatUnits(selectedCurrencyBalance.value, currencyDecimals)).toFixed(4)} {selectedCurrencyBalance.symbol}
                </p>
            )}
            
            <label htmlFor="payAmount" className="block text-sm font-medium text-neutral-300 mb-1">You Pay ({purchaseCurrency})</label>
            <input
              type="text"
              id="payAmount"
              name="payAmount"
              className="w-full bg-neutral-700 border-neutral-600 text-white rounded-lg p-3 focus:ring-secondary-DEFAULT focus:border-secondary-DEFAULT text-lg"
              placeholder={`Amount in ${purchaseCurrency}`}
              value={payAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              disabled={effectiveIsLoading}
            />
             <div className="flex flex-wrap gap-2 mt-2">
                {(purchaseCurrency === PurchaseCurrency.BNB ? BNB_AMOUNTS : USD_AMOUNTS).map(amount => (
                    <button 
                        key={amount}
                        onClick={() => handleSetPayAmount(amount)}
                        className="text-xs bg-neutral-600 hover:bg-neutral-500 text-neutral-200 px-3 py-1 rounded-md transition-colors"
                        disabled={effectiveIsLoading}
                    >
                        {amount} {purchaseCurrency}
                    </button>
                ))}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Min: {min} {purchaseCurrency}, Max: {max} {purchaseCurrency}</p>
          </div>

          <div className="mb-6">
            <label htmlFor="receiveAmount" className="block text-sm font-medium text-neutral-300 mb-1">You Receive ({JEREMY_TOKEN_SYMBOL})</label>
            <input
              type="text"
              id="receiveAmount"
              name="receiveAmount"
              className="w-full bg-neutral-700 border-neutral-600 text-white rounded-lg p-3 focus:ring-secondary-DEFAULT focus:border-secondary-DEFAULT text-lg"
              value={receiveAmount}
              readOnly
              placeholder="Calculated amount"
            />
             <p className="text-xs text-neutral-500 mt-1">Current Price: 1 {JEREMY_TOKEN_SYMBOL} = ${currentPrice.toFixed(5)}</p>
          </div>
          
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          {txMessage && <p className="text-green-400 text-sm mb-4 text-center">{txMessage}</p>}
          
          {isStableCoinPurchaseDisabled && (
            <p className="text-orange-400 text-sm mb-4 text-center">
              Note: Purchases with {purchaseCurrency} require a specific smart contract function not currently available in the ABI. 
              The 'buyTokens' function is for BNB only. You can approve {purchaseCurrency}, but the final buy step for {purchaseCurrency} is disabled.
            </p>
          )}

          {needsApproval && purchaseCurrency === PurchaseCurrency.USDT ? (
            <button
              onClick={handleApprove}
              disabled={!approveConfig?.request || effectiveIsLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
            >
              {isApproving || isConfirmingApproval ? 'Approving...' : `Approve ${purchaseCurrency}`}
              {(isApproving || isConfirmingApproval) && <Spinner />}
            </button>
          ) : (
            <button
              onClick={handleBuy}
              disabled={
                (purchaseCurrency === PurchaseCurrency.BNB && (!buyConfig?.request || !!simulateBuyError)) || 
                isStableCoinPurchaseDisabled || // Disable buy for USDT if it's selected
                effectiveIsLoading || 
                parseFloat(payAmount) < min || 
                parseFloat(payAmount) > max
              }
              className="w-full bg-gradient-to-r from-jsnail-gold to-accent-DEFAULT hover:from-accent-DEFAULT hover:to-jsnail-gold text-neutral-900 font-bold py-4 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isBuying || isConfirmingBuy ? 'Processing Purchase...' : `Buy ${JEREMY_TOKEN_SYMBOL}`}
              {(isBuying || isConfirmingBuy) && <Spinner />}
            </button>
          )}

          {approveTxHash && <TxStatus type="Approval" hash={approveTxHash} isLoading={isConfirmingApproval} isSuccess={isApprovalSuccess} currentError={error}/>}
          {buyTxHash && <TxStatus type="Purchase" hash={buyTxHash} isLoading={isConfirmingBuy} isSuccess={isBuySuccess} currentError={error}/>}
        </>
      )}
    </div>
  );
};

const Spinner: React.FC = () => (
  <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const TxStatus: React.FC<{type: string, hash: string, isLoading: boolean, isSuccess: boolean, currentError: string | null}> = ({type, hash, isLoading, isSuccess, currentError}) => {
    if (!hash) return null;
    // Don't show status if there's a more general error displayed above the buttons
    if (currentError && !isLoading && !isSuccess) return null;

    return (
        <div className="mt-4 text-center text-sm">
            {isLoading && <p className="text-yellow-400">{type} transaction processing... <a href={`https://bscscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-300">View on BscScan</a></p>}
            {isSuccess && <p className="text-green-400">{type} successful! <a href={`https://bscscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">View on BscScan</a></p>}
            {!isLoading && !isSuccess && hash && !currentError && <p className="text-neutral-400">{type} submitted. Waiting for confirmation... <a href={`https://bscscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-300">View on BscScan</a></p>}
        </div>
    );
};

export default BuyPanel;
