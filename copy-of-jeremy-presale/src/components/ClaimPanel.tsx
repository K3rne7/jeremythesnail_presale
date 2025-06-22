
import React, { useState, useEffect } from 'react';
import { useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import usePresaleStore from '../hooks/usePresaleStore';
import { PRESALE_END_DATE } from '../data/stages';
import PresaleABI from '../abi/Presale.json';
import { PRESALE_CONTRACT_ADDRESS, TARGET_CHAIN_ID } from '../constants';

const ClaimPanel: React.FC = () => {
  const { address, isConnected, chainId } = useAccount();
  const { presaleEnded: storePresaleEnded } = usePresaleStore(); // Use store's knowledge of presale end
  
  const [isClaimable, setIsClaimable] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

  useEffect(() => {
    const checkClaimable = () => {
      const now = new Date();
      const endDate = new Date(PRESALE_END_DATE);
      // Add a small buffer (e.g., 5 minutes) after presale end to ensure contract state is updated
      const claimBufferMs = 5 * 60 * 1000; 
      setIsClaimable(now.getTime() > endDate.getTime() + claimBufferMs || storePresaleEnded);
    };

    checkClaimable();
    const interval = setInterval(checkClaimable, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [storePresaleEnded]);

  const { data: claimConfig } = useSimulateContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: PresaleABI,
    functionName: 'claim',
    args: [],
    query: { enabled: isConnected && isClaimable && !isWrongNetwork },
  });

  const { writeContract: claimTokens, data: claimTxHash, isPending: isClaiming } = useWriteContract();
  const { isLoading: isConfirmingClaim, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ 
      hash: claimTxHash,
      onReplaced: (replacement) => {
        if (replacement.reason === 'cancelled') console.log('Claim Tx cancelled');
        else if (replacement.reason === 'replaced') console.log('Claim Tx replaced');
     }
  });

  const handleClaim = async () => {
    if (!claimConfig?.request) {
      setError("Claim preparation failed. Are you eligible or has the claim period started?");
      console.error("Claim config error:", claimConfig);
      return;
    }
    setError(null);
    try {
      claimTokens(claimConfig.request);
    } catch (e: any) {
      setError(e.shortMessage || e.message || 'Claim failed.');
      console.error(e);
    }
  };

  const effectiveIsLoading = isClaiming || isConfirmingClaim;

  return (
    <section id="claim" className="py-12 md:py-16 bg-neutral-800">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <div className="bg-neutral-700/50 p-6 md:p-10 rounded-xl shadow-2xl border border-primary-DEFAULT">
          <h3 className="text-3xl font-display font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-secondary-light to-accent-light">
            Claim Your $JEREMY
          </h3>

          {!isConnected ? (
            <p className="text-lg text-neutral-300 py-6">Please connect your wallet to claim tokens.</p>
          ) : isWrongNetwork ? (
             <p className="text-center text-lg text-red-500 py-8">Please switch to Binance Smart Chain (ID: {TARGET_CHAIN_ID}) to claim.</p>
          ) : !isClaimable ? (
            <p className="text-lg text-neutral-300 py-6">
              Token claiming will be available after the presale concludes on {new Date(PRESALE_END_DATE).toLocaleString()}.
            </p>
          ) : (
            <>
              <p className="text-neutral-300 mb-6">
                The presale has ended! You can now claim your purchased $JEREMY tokens.
              </p>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button
                onClick={handleClaim}
                disabled={!claimConfig?.request || effectiveIsLoading}
                className="w-full max-w-xs mx-auto bg-gradient-to-r from-jsnail-gold to-accent-DEFAULT hover:from-accent-DEFAULT hover:to-jsnail-gold text-neutral-900 font-bold py-4 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:transform-none disabled:shadow-none flex items-center justify-center"
              >
                {effectiveIsLoading ? 'Processing Claim...' : 'Claim Tokens'}
                {effectiveIsLoading && <Spinner />}
              </button>

              {claimTxHash && (
                <div className="mt-4 text-sm">
                  {isConfirmingClaim && <p className="text-yellow-400">Claim transaction processing... <a href={`https://bscscan.com/tx/${claimTxHash}`} target="_blank" rel="noopener noreferrer" className="underline">View on BscScan</a></p>}
                  {isClaimSuccess && <p className="text-green-400">Claim successful! <a href={`https://bscscan.com/tx/${claimTxHash}`} target="_blank" rel="noopener noreferrer" className="underline">View on BscScan</a></p>}
                  {!isConfirmingClaim && !isClaimSuccess && claimTxHash && <p className="text-neutral-400">Claim submitted. <a href={`https://bscscan.com/tx/${claimTxHash}`} target="_blank" rel="noopener noreferrer" className="underline">View on BscScan</a></p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const Spinner: React.FC = () => (
  <svg className="animate-spin ml-2 h-5 w-5 text-neutral-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


export default ClaimPanel;
