import { useAccount } from 'wagmi';
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { TARGET_CHAIN_ID } from '../constants';

interface UseWalletReturn {
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  address?: `0x${string}`;
  chain?: ReturnType<typeof useAccount>['chain']; // Updated to use useAccount's chain type
  isWrongNetwork: boolean;
  openConnectModal: (() => void) | undefined;
  openAccountModal: (() => void) | undefined;
  openChainModal: (() => void) | undefined;
}

export const useWallet = (): UseWalletReturn => {
  const { address, chain, isConnected, isConnecting, isDisconnected, isReconnecting } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  const isWrongNetwork = !!(isConnected && chain && chain.id !== TARGET_CHAIN_ID);

  return {
    isConnected,
    isConnecting,
    isDisconnected,
    isReconnecting,
    address,
    chain,
    isWrongNetwork,
    openConnectModal,
    openAccountModal,
    openChainModal,
  };
};

export default useWallet;