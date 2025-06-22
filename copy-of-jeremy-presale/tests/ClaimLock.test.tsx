import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ClaimPanel from '../src/components/ClaimPanel';
import usePresaleStore from '../src/hooks/usePresaleStore';
import { PRESALE_END_DATE } from '../src/data/stages';
import { WagmiProvider, createConfig, http, useAccount } from 'wagmi'; // Import useAccount
import { QueryClient, QueryClientProvider } from '@tanstack/query';
import { bsc } from 'wagmi/chains';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { TARGET_CHAIN_ID } from '../src/constants';


vi.mock('wagmi', async () => {
  const actualWagmi = await vi.importActual('wagmi');
  return {
    ...actualWagmi,
    useAccount: vi.fn(() => ({ 
      address: '0x1234567890123456789012345678901234567890', 
      isConnected: true, 
      chainId: TARGET_CHAIN_ID 
    })),
    useSimulateContract: vi.fn(() => ({ data: { request: {} }, isLoading: false, error: null })),
    useWriteContract: vi.fn(() => ({ writeContract: vi.fn(), data: '0xClaimTransactionHash', isPending: false, error: null })),
    useWaitForTransactionReceipt: vi.fn(() => ({ isLoading: false, isSuccess: true, error: null })),
  };
});

vi.mock('../src/hooks/usePresaleStore');

const queryClient = new QueryClient();
const connectors = connectorsForWallets(
  [{ groupName: 'Popular', wallets: [metaMaskWallet] }],
  { appName: 'Jeremy Presale Test', projectId: 'test-project-id' }
);
const wagmiTestConfig = createConfig({
  chains: [bsc],
  connectors,
  transports: { [bsc.id]: http() },
  ssr: false,
});


const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <WagmiProvider config={wagmiTestConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);


describe('ClaimPanel - Claim Lock Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Use fake timers to control Date.now()
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers
    vi.clearAllMocks();
  });

  it('shows "not claimable yet" message and claim button is not present/disabled before presale end', () => {
    (usePresaleStore as any).mockReturnValue({
      presaleEnded: false,
    });
    // Set current time to be before PRESALE_END_DATE
    const presaleEndDate = new Date(PRESALE_END_DATE);
    vi.setSystemTime(new Date(presaleEndDate.getTime() - 100000)); // 100 seconds before end

    render(<ClaimPanel />, { wrapper: TestWrapper });
    expect(screen.getByText(/Token claiming will be available after the presale concludes/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Claim Tokens/i })).toBeNull(); // Button might not even render if not claimable
  });

  it('shows claim button enabled after presale end date (including buffer)', async () => {
    (usePresaleStore as any).mockReturnValue({
      presaleEnded: true, // Assuming store reflects this accurately based on its own logic
    });
    // Set current time to be after PRESALE_END_DATE + buffer
    const presaleEndDate = new Date(PRESALE_END_DATE);
    const claimBufferMs = 5 * 60 * 1000; // 5 minutes buffer as in component
    vi.setSystemTime(new Date(presaleEndDate.getTime() + claimBufferMs + 1000));

    render(<ClaimPanel />, { wrapper: TestWrapper });

    await waitFor(() => {
        expect(screen.getByText(/The presale has ended! You can now claim/i)).toBeInTheDocument();
        const claimButton = screen.getByRole('button', { name: /Claim Tokens/i });
        expect(claimButton).toBeInTheDocument();
        expect(claimButton).not.toBeDisabled();
    });
  });

  it('disables claim button if wallet is not connected', () => {
    // vi.mocked(wagmi.useAccount) was erroring, now useAccount is imported and vi.mocked(useAccount) is used from the global mock
    (vi.mocked(useAccount) as any).mockReturnValue({ isConnected: false, address: undefined, chainId: undefined, isConnecting: false, isDisconnected: true, isReconnecting: false, status: 'disconnected' }); // Ensure full mock shape
     (usePresaleStore as any).mockReturnValue({
      presaleEnded: true,
    });
    const presaleEndDate = new Date(PRESALE_END_DATE);
    const claimBufferMs = 5 * 60 * 1000;
    vi.setSystemTime(new Date(presaleEndDate.getTime() + claimBufferMs + 1000));


    render(<ClaimPanel />, { wrapper: TestWrapper });
    expect(screen.getByText(/Please connect your wallet to claim tokens/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Claim Tokens/i })).toBeNull();
  });

  // Add tests for:
  // - Clicking claim button and transaction handling
  // - Error states during claim
  // - Wrong network scenario
});