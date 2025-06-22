import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CountdownWithPrice from '../src/components/CountdownWithPrice';
import usePresaleStore from '../src/hooks/usePresaleStore';
import { STAGES, PRESALE_START_DATE, PRESALE_END_DATE } from '../src/data/stages';

// Mock zustand store
vi.mock('../src/hooks/usePresaleStore');

// Mock useCountdown hook
vi.mock('../src/hooks/useCountdown', () => ({
  default: vi.fn(() => ({ days: 10, hours: 0, minutes: 0, seconds: 0 })),
}));

describe('CountdownWithPrice', () => {
  const mockSetTimeLeftInStage = vi.fn();
  const mockSetTotalTimeLeft = vi.fn();
  const mockSetCurrentStage = vi.fn();
  const mockSetPresaleStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePresaleStore as any).mockReturnValue({
      currentStageIndex: 0,
      currentPrice: STAGES[0].price,
      nextPrice: STAGES[1]?.price || null,
      presaleActive: true,
      presaleEnded: false,
      timeLeftInStage: { days: 10, hours: 0, minutes: 0, seconds: 0 },
      totalTimeLeft: { days: 20, hours: 0, minutes: 0, seconds: 0 },
      setTimeLeftInStage: mockSetTimeLeftInStage,
      setTotalTimeLeft: mockSetTotalTimeLeft,
      setCurrentStage: mockSetCurrentStage,
      setPresaleStatus: mockSetPresaleStatus,
      getState: () => ({ // Mock getState for internal calls within useEffect
        setCurrentStage: mockSetCurrentStage,
        setPresaleStatus: mockSetPresaleStatus,
      }),
    });
  });

  it('renders countdown information when presale is active', () => {
    render(<CountdownWithPrice />);
    expect(screen.getByText(/Stage 1 Ends In/i)).toBeInTheDocument();
    expect(screen.getByText(`$${STAGES[0].price.toFixed(5)}`)).toBeInTheDocument();
    if (STAGES[1]) {
      expect(screen.getByText(`$${STAGES[1].price.toFixed(5)}`)).toBeInTheDocument();
    }
    expect(screen.getByText('10')).toBeInTheDocument(); // Days
  });

  it('renders presale start information when presale is not active and not ended', () => {
    (usePresaleStore as any).mockReturnValue({
      ...usePresaleStore(),
      presaleActive: false,
      presaleEnded: false,
      currentStageIndex: -1,
    });
    // Mock date to be before presale start
    vi.setSystemTime(new Date(new Date(PRESALE_START_DATE).getTime() - 100000));

    render(<CountdownWithPrice />);
    expect(screen.getByText(/Time until Presale Starts/i)).toBeInTheDocument();
    expect(screen.getByText(`$${STAGES[0].price.toFixed(5)}`)).toBeInTheDocument(); // Starting price
    
    vi.useRealTimers(); // Reset system time
  });

  it('renders presale ended message when presale has ended', () => {
    (usePresaleStore as any).mockReturnValue({
      ...usePresaleStore(),
      presaleActive: false,
      presaleEnded: true,
    });
     vi.setSystemTime(new Date(new Date(PRESALE_END_DATE).getTime() + 100000));

    render(<CountdownWithPrice />);
    expect(screen.getByText(/Presale Has Ended/i)).toBeInTheDocument();
    expect(screen.getByText(/Thank you for your participation!/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  // Add more tests for stage transitions, price updates etc.
});
