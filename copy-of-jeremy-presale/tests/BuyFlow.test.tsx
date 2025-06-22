import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BuyPanel from '../src/components/BuyPanel';
import usePresaleStore from '../src/hooks/usePresaleStore';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { bsc } from 'wagmi/chains';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { TARGET_CHAIN_ID } from '../src/constants';

// Mock wagmi hooks and RainbowKit more comprehensively if needed
// For simplicity, we'll mock some high-level interactions or assume a connected state.

vi.mock('wagmi', async () => {
  const actualWagmi = await vi.importActual('wagmi');
  return {
    ...actualWagmi,
    useAccount: vi.fn(() => ({ 
      address: '0x1234567890123456789012345678901234567890', 
      isConnected: true, 
      chainId: TARGET_CHAIN_ID 
    })),
    useBalance: vi.fn(() => ({ data: { formatted: '100', symbol: 'BNB', value: BigInt(100e18) }, isLoading: false })),
    useSimulateContract: vi.fn(() => ({ data: { request: {} }, isLoading: false, error: null })),
    useWriteContract: vi.fn(() => ({ writeContract: vi.fn(), data: '0xTransactionHash', isPending: false, error: null })),
    useWaitForTransactionReceipt: vi.fn(() => ({ isLoading: false, isSuccess: true, error: null })),
    useReadContract: vi.fn(() => ({ data: BigInt(0), isLoading: false, error: null, refetch: vi.fn() })), // For allowance
  };
});

// Mock zustand store
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


describe('BuyPanel - Buy Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePresaleStore as any).mockReturnValue({
      currentPrice: 0.00042,
      presaleActive: true,
      presaleEnded: false,
      // ... any other relevant state for BuyPanel
    });
     // Mock bnbPriceUSD fetching
     global.fetch = vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ /* mock price data if API is called */ }),
            ok: true,
        })
    ) as any;
    // Mock useEffect's setTimeout for BNB price
    vi.spyOn(global, 'setTimeout');

  });

  it('renders buy panel and allows input when presale is active and wallet connected', () => {
    render(<BuyPanel />, { wrapper: TestWrapper });
    expect(screen.getByText(/Buy \$JEREMY/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Amount in BNB/i)).toBeInTheDocument();
  });

  it('calculates receive amount when pay amount is entered', async () => {
    render(<BuyPanel />, { wrapper: TestWrapper });
    const payAmountInput = screen.getByPlaceholderText(/Amount in BNB/i);
    fireEvent.change(payAmountInput, { target: { value: '1' } });
    
    // Wait for useEffect calculation (and mock bnbPriceUSD if needed)
    // For this test, we assume bnbPriceUSD is fetched/set, and currentPrice is available.
    // The exact calculation depends on these values.
    await waitFor(() => {
      const receiveAmountInput = screen.getByPlaceholderText(/Calculated amount/i) as HTMLInputElement;
      // This assertion depends on mocked bnBPriceUSD and currentPrice in store
      // e.g. if bnBPriceUSD is 300 and currentPrice is 0.00042, 1 BNB = (1*300)/0.00042 JEREMY
      expect(parseFloat(receiveAmountInput.value)).toBeGreaterThan(0); 
    });
  });

  it('shows buy button enabled when conditions are met', async () => {
     render(<BuyPanel />, { wrapper: TestWrapper });
    const payAmountInput = screen.getByPlaceholderText(/Amount in BNB/i);
    fireEvent.change(payAmountInput, { target: { value: '0.1' } }); // Min purchase

    await waitFor(() => {
        const buyButton = screen.getByRole('button', { name: /Buy \$JEREMY/i });
        expect(buyButton).not.toBeDisabled();
    });
  });
  
  // Add tests for:
  // - Switching currency (BNB to USDT)
  // - USDT approval flow
  // - Clicking buy button and transaction handling (mocking writeContract)
  // - Error states (insufficient balance, presale inactive, wrong network)
  // - Min/max purchase validation
});
