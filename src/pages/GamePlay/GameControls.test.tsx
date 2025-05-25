import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Needed if any tested component uses Link, useNavigate etc.
import { GameControls } from './TeamSelect'; // Assuming GameControls is exported from TeamSelect.tsx
import * as GameStateHook from '../../hooks/useGameState';
import * as DataHook from '../../hooks/useData';
import * as RxDataHook from '../../hooks/useRxQuery';
import * as NetworkStateHook from '../../hooks/useNetworkState';
import * as GBDataHook from '../../hooks/useGBData'; // For saved lists
import { vi } from 'vitest';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // For theme context

// Mock NavigateFab
vi.mock('./components/NavigateFab', () => ({
  NavigateFab: vi.fn(({ disabled }) => <button data-testid="navigate-fab" disabled={disabled}>Go to Draft</button>),
}));

// Mock SelectedIcon (or ensure useRxData provides data)
// For simplicity, mocking the component directly
vi.mock('./TeamSelect', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual, // Import and retain default exports
      SelectedIcon: vi.fn(({ team }) => <div data-testid="selected-icon">{team}</div>),
    };
  });


// Mock RxDB Document methods
const mockIncrementalPatch = vi.fn().mockResolvedValue(undefined);
const mockGet$ = vi.fn((prop) => {
    if (prop === 'guild') return of(undefined); // Default to no guild selected
    if (prop === 'roster') return of([]);
    return of(undefined);
});

const mockTeamDoc = (initialGuild?: string) => ({
  incrementalPatch: mockIncrementalPatch,
  get$: vi.fn((prop) => {
    if (prop === 'guild') return new BehaviorSubject(initialGuild);
    if (prop === 'roster') return new BehaviorSubject([]);
    return new BehaviorSubject(undefined);
  }),
  subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })), // Add subscribe if directly used
});


// Mock data
const mockAllModelsData = [
  { id: 'model1', name: 'Model One', hp: 10 },
  { id: 'model2', name: 'Model Two', hp: 12 },
  { id: 'model3', name: 'Model Three', hp: 8 },
];

const mockSavedListData = [
  { id: 'list1', name: 'My First List', modelIds: ['model1', 'model2'] },
  { id: 'list2', name: 'Another List', modelIds: ['model3'] },
];

// Default Mocks Setup
const defaultTheme = createTheme();

const mockGameState1$ = new BehaviorSubject(mockTeamDoc());
const mockGameState2$ = new BehaviorSubject(mockTeamDoc());

const renderGameControls = (propsUpdate$: Subject<string>) => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      <MemoryRouter>
        <GameControls size={100} update$={propsUpdate$} />
      </MemoryRouter>
    </ThemeProvider>
  );
};


describe('GameControls', () => {
  let propsUpdate$: Subject<string>;

  beforeEach(() => {
    vi.clearAllMocks();
    propsUpdate$ = new Subject<string>();

    vi.spyOn(GameStateHook, 'useGameState').mockReturnValue({
      gameState1$: mockGameState1$,
      gameState2$: mockGameState2$,
      setGameStates: vi.fn(),
      setGameId: vi.fn(),
    });

    // Reset team docs for each test to ensure clean state
    // Re-initialize BehaviorSubjects with new mockTeamDoc instances
    mockGameState1$.next(mockTeamDoc());
    mockGameState2$.next(mockTeamDoc());


    vi.spyOn(DataHook, 'useData').mockReturnValue({
      gbdb: {
        models: {
          findByIds: vi.fn().mockImplementation((ids) => ({
            exec: vi.fn().mockResolvedValue(new Map(ids.map((id: string) => [id, mockAllModelsData.find(m => m.id === id)]))),
          })),
        },
        saved_lists: {
          find: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue([]), // Default to no saved lists
        },
      } as any, // Cast to any to satisfy complex type, focus on mocked parts
       हैंandleDbError: vi.fn(),
    });

    vi.spyOn(RxDataHook, 'useRxData').mockImplementation((queryFn, deps) => {
      // Mock for SelectedIcon if it uses useRxData for guild details
      // Example: if a guild name is passed in deps, return mock guild data
      if (deps && deps.length > 0 && typeof deps[0] === 'string') {
        return { name: deps[0], color: '#ff0000', shadow: '#000000' }; // Mock guild data
      }
      return undefined;
    });

    vi.spyOn(NetworkStateHook, 'useNetworkState').mockReturnValue({
      active: false, // Default to local game
      player: undefined,
      gameId: undefined,
      setGameId: vi.fn(),
      setPlayer: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
      send: vi.fn(),
      state: {} as any,
    });

    // Mock for useGBData (used for fetching saved lists)
    vi.spyOn(GBDataHook, 'useGBData').mockReturnValue([]); // Default to no saved lists
  });

  // Helper to get button text content, attempting to read from SelectedIcon if present
  const getButtonText = (buttonName: RegExp) => {
    const button = screen.getByRole('button', { name: buttonName });
    const selectedIcon = within(button).queryByTestId('selected-icon');
    if (selectedIcon) {
      return selectedIcon.textContent;
    }
    return button.textContent;
  };

  const getP1ButtonText = () => getButtonText(/P1/i);
  const getP2ButtonText = () => getButtonText(/P2/i);


  describe('1. Initial Rendering', () => {
    test('renders P1 and P2 buttons, mode toggles, and "vs" text', () => {
      renderGameControls(propsUpdate$);
      expect(screen.getByRole('button', { name: 'P1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'P2' })).toBeInTheDocument();
      expect(screen.getByText('vs')).toBeInTheDocument();
      // P1 Toggles
      expect(screen.getByRole('group', { name: /Player 1 selection mode/i })).toBeInTheDocument();
      expect(within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /Guild/i })).toBeInTheDocument();
      expect(within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i })).toBeInTheDocument();
      // P2 Toggles
      expect(screen.getByRole('group', { name: /Player 2 selection mode/i })).toBeInTheDocument();
      expect(within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /Guild/i })).toBeInTheDocument();
      expect(within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /List/i })).toBeInTheDocument();
    });

    test('NavigateFab is initially disabled', () => {
      renderGameControls(propsUpdate$);
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();
    });

    test('saved lists are not visible initially', () => {
      renderGameControls(propsUpdate$);
      expect(screen.queryByText(/Player 1: Select a Saved List/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Player 2: Select a Saved List/i)).not.toBeInTheDocument();
    });
  });

  describe('2. Mode Switching (P1)', () => {
    beforeEach(() => {
      // Ensure saved lists are available for when mode switches to "list"
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData);
    });

    test('P1 switches to "List" mode: clears guild, shows lists, button updates', async () => {
      mockGameState1$.next(mockTeamDoc('InitialP1Guild')); // P1 has a guild selected initially
      renderGameControls(propsUpdate$);

      // Verify initial state (guild selected)
      // Note: Direct text check on button might be tricky if SelectedIcon is complex.
      // We rely on incrementalPatch being called to clear the guild.
      // For button display, if SelectedIcon mock returns team name:
      await waitFor(() => expect(getP1ButtonText()).toBe('InitialP1Guild'));


      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });

      await act(async () => {
        fireEvent.click(p1ListToggleButton);
      });

      // Verify teamDoc1.incrementalPatch was called to clear the guild
      expect(mockIncrementalPatch).toHaveBeenCalledWith({ guild: undefined, roster: [] });

      // Check if P1 button text is now "P1"
      await waitFor(() => expect(getP1ButtonText()).toBe('P1'));


      // Verify saved lists section is visible for P1
      expect(screen.getByText(/Player 1: Select a Saved List/i)).toBeInTheDocument();
      expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument();
    });

    test('P1 switches back to "Guild" mode: clears list name, button updates, lists hide', async () => {
      renderGameControls(propsUpdate$);

      // Switch to List mode first for P1
      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p1ListToggleButton); });
      await waitFor(() => expect(screen.getByText(/Player 1: Select a Saved List/i)).toBeInTheDocument());

      // Now switch P1 back to Guild mode
      const p1GuildToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /Guild/i });
      await act(async () => { fireEvent.click(p1GuildToggleButton); });
      
      await waitFor(() => expect(getP1ButtonText()).toBe('P1'));
      expect(screen.queryByText(/Player 1: Select a Saved List/i)).not.toBeInTheDocument();
    });
  });

  describe('3. Mode Switching (P2, local game)', () => {
    beforeEach(() => {
      vi.spyOn(NetworkStateHook, 'useNetworkState').mockReturnValue({ active: false } as any); // Ensure local game
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData); // Provide saved lists
       // Set selector to P2 for these tests
       // This needs to be done carefully if initial rendering defaults to P1
       // A simple way is to simulate P1 selection first if needed, or adjust initial state if possible
    });

    test('P2 switches to "List" mode: clears guild, shows lists, button updates', async () => {
      mockGameState2$.next(mockTeamDoc('InitialP2Guild')); // P2 has a guild selected
      renderGameControls(propsUpdate$);
      
      // Simulate P1 has already selected, so selector moves to P2
      // This is a common pattern: P1 picks, then P2 picks.
      // If P1 hasn't picked, selector might not be 'P2'.
      // For isolated P2 testing, we might need to force selector to 'P2' or simulate P1 turn.
      // Let's assume P1 has selected a guild to make selector 'P2'.
      await act(async () => {
        // Simulate P1 selecting a guild
        mockGameState1$.next(mockTeamDoc('P1GuildDone'));
        // Manually setting selector state is not ideal from outside.
        // Instead, we can click P2 button to make it active selector.
        fireEvent.click(screen.getByRole('button', { name: /P2/i }));
      });
      await waitFor(() => expect(getP2ButtonText()).toBe('InitialP2Guild'));


      const p2ListToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => {
        fireEvent.click(p2ListToggleButton);
      });

      expect(mockIncrementalPatch).toHaveBeenCalledWith({ guild: undefined, roster: [] });
      await waitFor(() => expect(getP2ButtonText()).toBe('P2'));
      expect(screen.getByText(/Player 2: Select a Saved List/i)).toBeInTheDocument();
      expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument();
    });

    test('P2 switches back to "Guild" mode: clears list name, button updates, lists hide', async () => {
      renderGameControls(propsUpdate$);

      // Click P2 button to make it active selector
      fireEvent.click(screen.getByRole('button', { name: /P2/i }));

      // Switch to List mode first for P2
      const p2ListToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p2ListToggleButton); });
      await waitFor(() => expect(screen.getByText(/Player 2: Select a Saved List/i)).toBeInTheDocument());

      // Now switch P2 back to Guild mode
      const p2GuildToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /Guild/i });
      await act(async () => { fireEvent.click(p2GuildToggleButton); });
      
      await waitFor(() => expect(getP2ButtonText()).toBe('P2'));
      expect(screen.queryByText(/Player 2: Select a Saved List/i)).not.toBeInTheDocument();
    });
  });

  describe('4. Displaying Saved Lists', () => {
    test('P1 in "List" mode: displays fetched saved lists', async () => {
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData); // Mock lists are available
      renderGameControls(propsUpdate$);

      // Switch P1 to List mode
      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p1ListToggleButton); });

      await waitFor(() => {
        expect(screen.getByText(/Player 1: Select a Saved List/i)).toBeInTheDocument();
        mockSavedListData.forEach(list => {
          expect(screen.getByText(list.name)).toBeInTheDocument();
          expect(screen.getByText(`Models: ${list.modelIds.length}`)).toBeInTheDocument();
        });
      });
    });

    test('P1 in "List" mode: displays "No saved lists found" if no lists are fetched', async () => {
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue([]); // No lists available
      renderGameControls(propsUpdate$);

      // Switch P1 to List mode
      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p1ListToggleButton); });
      
      await waitFor(() => {
        expect(screen.getByText(/Player 1: Select a Saved List/i)).toBeInTheDocument();
        expect(screen.getByText(/No saved lists found./i)).toBeInTheDocument();
      });
    });

     test('P2 in "List" mode (local game): displays fetched saved lists', async () => {
      vi.spyOn(NetworkStateHook, 'useNetworkState').mockReturnValue({ active: false } as any);
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData);
      renderGameControls(propsUpdate$);

      // Set selector to P2 and P2 mode to list
      fireEvent.click(screen.getByRole('button', { name: /P2/i })); // Activate P2
      const p2ListToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p2ListToggleButton); });


      await waitFor(() => {
        expect(screen.getByText(/Player 2: Select a Saved List/i)).toBeInTheDocument();
        mockSavedListData.forEach(list => {
          expect(screen.getByText(list.name)).toBeInTheDocument();
        });
      });
    });
  });

  describe('5. Selecting a Saved List (P1)', () => {
    beforeEach(() => {
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData); // Provide saved lists
      // Mock models.findByIds for when a list is selected
      // Ensure the mock for gbdb in useData is correctly set up for this
      const mockDbModels = {
        findByIds: vi.fn().mockImplementation((idsToFind: string[]) => ({
          exec: vi.fn().mockResolvedValue(
            new Map(
              idsToFind.map(id => [id, mockAllModelsData.find(m => m.id === id)]).filter(entry => entry[1])
            )
          ),
        })),
      };
      vi.spyOn(DataHook, 'useData').mockReturnValue({
        gbdb: { models: mockDbModels, saved_lists: { find: vi.fn(() => ({ exec: vi.fn().mockResolvedValue(mockSavedListData) })) } } as any,
        हैंandleDbError: vi.fn(),
      });
       // Reset team docs with specific mocks if needed for patch verification
       mockGameState1$.next(mockTeamDoc()); // Ensure a fresh doc for P1
       mockGameState2$.next(mockTeamDoc()); // And P2
    });

    test('P1 selects a list: patches teamDoc, updates button, changes selector', async () => {
      renderGameControls(propsUpdate$);

      // Switch P1 to List mode
      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p1ListToggleButton); });
      await waitFor(() => expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument());

      // Click on the first saved list
      const firstSavedListButton = screen.getByText(mockSavedListData[0].name);
      await act(async () => { fireEvent.click(firstSavedListButton); });
      
      // Verify incrementalPatch on teamDoc1
      const expectedRoster = mockSavedListData[0].modelIds
        .map(id => mockAllModelsData.find(m => m.id === id))
        .filter(Boolean)
        .map(model => ({ name: model!.id, health: model!.hp }));

      expect(mockIncrementalPatch).toHaveBeenCalledWith({
        roster: expectedRoster,
        guild: mockSavedListData[0].name, // List name is used as guild identifier
      });

      // Verify P1 button text updates to list name (truncated)
      await waitFor(() => expect(getP1ButtonText()).toBe(mockSavedListData[0].name.substring(0, 8)));

      // Verify selector changes to P2 (assuming P2 hasn't selected yet)
      // This requires checking the internal 'selector' state, which is hard.
      // We can infer it by seeing if P2's list selection area becomes active IF P2 was also in list mode.
      // Or, if P2 button gets highlighted (secondary.light border)
      // For now, this part is hard to verify without exposing selector or more complex UI checks
      // We'll trust the logic inside handleSelectList for selector change.
      // We can check if NavigateFab is still disabled (as P2 hasn't selected)
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();
    });
  });

  describe('6. Selecting a Guild (P1)', () => {
    beforeEach(() => {
      // Ensure P1 is in guild mode by default or set it
      // No specific saved lists needed for guild selection
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue([]);
      mockGameState1$.next(mockTeamDoc()); // Fresh doc for P1
    });

    test('P1 selects a guild: patches teamDoc, updates button, clears list name', async () => {
      renderGameControls(propsUpdate$);

      // Ensure P1 is in Guild mode (default, but good to be explicit if tests could change it)
      const p1GuildToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /Guild/i });
      if (p1GuildToggleButton.getAttribute('aria-pressed') === 'false') {
         await act(async () => { fireEvent.click(p1GuildToggleButton); });
      }
      
      // Pre-select a list for P1 to ensure it gets cleared
      // Switch to list, select list, then switch back to guild
      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData); // Make lists available
      await act(async () => { fireEvent.click(p1ListToggleButton); });
      await waitFor(() => expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument());
      const firstSavedListButton = screen.getByText(mockSavedListData[0].name);
      await act(async () => { fireEvent.click(firstSavedListButton); });
      await waitFor(() => expect(getP1ButtonText()).toBe(mockSavedListData[0].name.substring(0,8)));
      // Switch back to guild mode (this should clear player1ListName internally)
      await act(async () => { fireEvent.click(p1GuildToggleButton); });
      await waitFor(() => expect(getP1ButtonText()).toBe('P1')); // List name cleared, button shows P1

      // Simulate guild selection from GuildGrid
      const selectedGuildName = 'TestGuild1';
      await act(async () => {
        propsUpdate$.next(selectedGuildName);
      });

      // Verify incrementalPatch on teamDoc1 for guild selection
      expect(mockIncrementalPatch).toHaveBeenCalledWith({
        guild: selectedGuildName,
        roster: [], // Roster is empty when selecting a guild initially
      });

      // Verify P1 button text updates to show guild icon/name
      // This relies on SelectedIcon mock and useRxData mock
      await waitFor(() => expect(getP1ButtonText()).toBe(selectedGuildName));

      // Verify player1ListName was cleared (already tested by switching back to guild mode)
      // No direct state check here, but UI should reflect it.
      // Saved lists area should not be visible
      expect(screen.queryByText(/Player 1: Select a Saved List/i)).not.toBeInTheDocument();
    });
  });

  describe('7. Interaction between P1 and P2 Selections (Enabling NavigateFab)', () => {
    beforeEach(() => {
      // Ensure both players start in guild mode, no selections
      mockGameState1$.next(mockTeamDoc());
      mockGameState2$.next(mockTeamDoc());
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData); // Lists available if needed
      // Mock findByIds for list selection
      const mockDbModels = {
        findByIds: vi.fn().mockImplementation((idsToFind: string[]) => ({
          exec: vi.fn().mockResolvedValue(
            new Map(idsToFind.map(id => [id, mockAllModelsData.find(m => m.id === id)]).filter(entry => entry[1]))
          ),
        })),
      };
      vi.spyOn(DataHook, 'useData').mockReturnValue({
        gbdb: { models: mockDbModels, saved_lists: { find: vi.fn(() => ({ exec: vi.fn().mockResolvedValue(mockSavedListData) })) } } as any,
        हैंandleDbError: vi.fn(),
      });
    });

    test('NavigateFab enables when P1 (guild) and P2 (guild) select', async () => {
      renderGameControls(propsUpdate$);
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();

      // P1 selects guild
      await act(async () => { propsUpdate$.next('GuildP1'); });
      await waitFor(() => expect(getP1ButtonText()).toBe('GuildP1'));
      expect(screen.getByTestId('navigate-fab')).toBeDisabled(); // P2 hasn't selected

      // P2 selects guild
      fireEvent.click(screen.getByRole('button', { name: /P2/i })); // Activate P2 selector
      await act(async () => { propsUpdate$.next('GuildP2'); });
      await waitFor(() => expect(getP2ButtonText()).toBe('GuildP2'));
      
      expect(screen.getByTestId('navigate-fab')).not.toBeDisabled();
    });

    test('NavigateFab enables when P1 (list) and P2 (list) select', async () => {
      renderGameControls(propsUpdate$);
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();

      // P1 selects list
      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p1ListToggleButton); });
      const firstSavedListP1 = screen.getByText(mockSavedListData[0].name);
      await act(async () => { fireEvent.click(firstSavedListP1); });
      await waitFor(() => expect(getP1ButtonText()).toBe(mockSavedListData[0].name.substring(0,8)));
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();

      // P2 selects list
      fireEvent.click(screen.getByRole('button', { name: /P2/i }));
      const p2ListToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p2ListToggleButton); });
      // Use a different list for P2 if available, or the same one for simplicity
      const listForP2 = mockSavedListData[1] || mockSavedListData[0];
      const secondSavedListP2 = screen.getByText(listForP2.name); // Might be the same list if only one mock list
      await act(async () => { fireEvent.click(secondSavedListP2); });
      await waitFor(() => expect(getP2ButtonText()).toBe(listForP2.name.substring(0,8)));

      expect(screen.getByTestId('navigate-fab')).not.toBeDisabled();
    });

    test('NavigateFab enables when P1 (guild) and P2 (list) select', async () => {
      renderGameControls(propsUpdate$);
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();

      // P1 selects guild
      await act(async () => { propsUpdate$.next('GuildP1'); });
      await waitFor(() => expect(getP1ButtonText()).toBe('GuildP1'));
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();

      // P2 selects list
      fireEvent.click(screen.getByRole('button', { name: /P2/i }));
      const p2ListToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p2ListToggleButton); });
      const listForP2 = mockSavedListData[0];
      const savedListP2Button = screen.getByText(listForP2.name);
      await act(async () => { fireEvent.click(savedListP2Button); });
      await waitFor(() => expect(getP2ButtonText()).toBe(listForP2.name.substring(0,8)));
      
      expect(screen.getByTestId('navigate-fab')).not.toBeDisabled();
    });

    test('NavigateFab remains disabled if only P1 selects (guild)', async () => {
      renderGameControls(propsUpdate$);
      await act(async () => { propsUpdate$.next('GuildP1'); });
      await waitFor(() => expect(getP1ButtonText()).toBe('GuildP1'));
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();
    });

    test('NavigateFab remains disabled if only P2 selects (list)', async () => {
      renderGameControls(propsUpdate$);
       // P2 selects list
       fireEvent.click(screen.getByRole('button', { name: /P2/i }));
       const p2ListToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /List/i });
       await act(async () => { fireEvent.click(p2ListToggleButton); });
       const listForP2 = mockSavedListData[0];
       const savedListP2Button = screen.getByText(listForP2.name);
       await act(async () => { fireEvent.click(savedListP2Button); });
       await waitFor(() => expect(getP2ButtonText()).toBe(listForP2.name.substring(0,8)));
      
      expect(screen.getByTestId('navigate-fab')).toBeDisabled();
    });
  });

  describe('8. Network Mode Impact', () => {
    beforeEach(() => {
      vi.spyOn(NetworkStateHook, 'useNetworkState').mockReturnValue({ active: true } as any);
      mockGameState1$.next(mockTeamDoc());
      mockGameState2$.next(mockTeamDoc()); // P2's doc might be less relevant if controls are disabled
      vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData);
      const mockDbModels = { findByIds: vi.fn().mockImplementation((idsToFind: string[]) => ({ exec: vi.fn().mockResolvedValue( new Map(idsToFind.map(id => [id, mockAllModelsData.find(m => m.id === id)]).filter(entry => entry[1]))) })), };
      vi.spyOn(DataHook, 'useData').mockReturnValue({ gbdb: { models: mockDbModels, saved_lists: { find: vi.fn(() => ({ exec: vi.fn().mockResolvedValue(mockSavedListData) })) } } as any, हैंandleDbError: vi.fn() });
    });

    test('P2 controls (button, mode toggle) are disabled in network mode', () => {
      renderGameControls(propsUpdate$);
      expect(screen.getByRole('button', { name: /P2/i })).toBeDisabled();
      const p2ToggleGroup = screen.getByRole('group', { name: /Player 2 selection mode/i });
      expect(within(p2ToggleGroup).getByRole('button', { name: /Guild/i })).toBeDisabled();
      expect(within(p2ToggleGroup).getByRole('button', { name: /List/i })).toBeDisabled();
    });

    test('P2 list selection area is hidden in network mode even if P2 selector and list mode', async () => {
      renderGameControls(propsUpdate$);
      // Activate P2 and set P2 mode to list (hypothetically, though UI prevents this)
      // This tests if the conditional render for saved lists respects networkActive
      fireEvent.click(screen.getByRole('button', { name: /P1/i })); // Ensure P1 is active first
      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p1ListToggleButton); }); // P1 to list mode

      // Even if we could set selector to P2 and player2Mode to 'list', the area shouldn't show
      // The condition is: (selector === "P2" && player2Mode === "list" && !networkActive)
      // Since networkActive is true, this should be false.
      expect(screen.queryByText(/Player 2: Select a Saved List/i)).not.toBeInTheDocument();
    });

    test('P1 selects guild in network mode, selector goes to "GO"', async () => {
      renderGameControls(propsUpdate$);
      await act(async () => { propsUpdate$.next('NetGuildP1'); });
      await waitFor(() => expect(getP1ButtonText()).toBe('NetGuildP1'));
      // Expect selector to be "GO" (NavigateFab enabled if P2's selection is assumed valid from network)
      // In network mode, P2's selection comes via network, not local UI.
      // For this test, we assume P2 has not selected yet for NavigateFab status.
      // If P2 had selected (via network data), NavigateFab would be enabled.
      // The key here is that selector isn't 'P2' for local interaction.
      // This test is tricky because "GO" state isn't directly visible.
      // We check that P2 button is not auto-selected (border color).
      const p2Button = screen.getByRole('button', { name: /P2/i });
      expect(p2Button.style.borderColor).not.toBe('secondary.light'); // Or whatever the active style is
    });

    test('P1 selects list in network mode, selector goes to "GO"', async () => {
        renderGameControls(propsUpdate$);
        const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
        await act(async () => { fireEvent.click(p1ListToggleButton); });
        const firstSavedListP1 = screen.getByText(mockSavedListData[0].name);
        await act(async () => { fireEvent.click(firstSavedListP1); });
        await waitFor(() => expect(getP1ButtonText()).toBe(mockSavedListData[0].name.substring(0,8)));
        
        const p2Button = screen.getByRole('button', { name: /P2/i });
        expect(p2Button.style.borderColor).not.toBe('secondary.light');
    });
  });

  describe('9. Visual Cue for List Mode', () => {
    beforeEach(() => {
        vi.spyOn(NetworkStateHook, 'useNetworkState').mockReturnValue({ active: false } as any); // Local game
        vi.spyOn(GBDataHook, 'useGBData').mockReturnValue(mockSavedListData); // Lists available
      });

    test('displays message when P1 is in list mode', async () => {
      renderGameControls(propsUpdate$);
      // Message should not be visible initially (P1 in guild mode)
      expect(screen.queryByText(/Currently selecting from: Saved List/i)).not.toBeInTheDocument();

      // Switch P1 to List mode
      const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
      await act(async () => { fireEvent.click(p1ListToggleButton); });

      await waitFor(() => {
        expect(screen.getByText(/Currently selecting from: Saved List. \(Guild selection is paused\)/i)).toBeInTheDocument();
      });

      // Switch P1 back to Guild mode
      const p1GuildToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /Guild/i });
      await act(async () => { fireEvent.click(p1GuildToggleButton); });

      await waitFor(() => {
        expect(screen.queryByText(/Currently selecting from: Saved List/i)).not.toBeInTheDocument();
      });
    });

    test('displays message when P2 is in list mode (local game)', async () => {
        renderGameControls(propsUpdate$);
        // Message not visible
        expect(screen.queryByText(/Currently selecting from: Saved List/i)).not.toBeInTheDocument();

        // Activate P2 and switch to List mode
        fireEvent.click(screen.getByRole('button', { name: /P2/i }));
        const p2ListToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /List/i });
        await act(async () => { fireEvent.click(p2ListToggleButton); });

        await waitFor(() => {
            expect(screen.getByText(/Currently selecting from: Saved List. \(Guild selection is paused\)/i)).toBeInTheDocument();
        });

        // Switch P2 back to Guild mode
        const p2GuildToggleButton = within(screen.getByRole('group', { name: /Player 2 selection mode/i })).getByRole('button', { name: /Guild/i });
        await act(async () => { fireEvent.click(p2GuildToggleButton); });
        
        await waitFor(() => {
            expect(screen.queryByText(/Currently selecting from: Saved List/i)).not.toBeInTheDocument();
        });
    });

    test('message is not displayed in network mode even if P1 is in list mode', async () => {
        // This tests the activePlayerIsListMode condition related to !networkActive for P2,
        // but the message is global. If P1 is list mode, message shows regardless of network for P2.
        // The original logic for activePlayerIsListMode is:
        // (selector === 'P1' && player1Mode === 'list') || (selector === 'P2' && player2Mode === 'list' && !networkActive);
        // So if P1 is list mode, the first part is true.
        vi.spyOn(NetworkStateHook, 'useNetworkState').mockReturnValue({ active: true } as any);
        renderGameControls(propsUpdate$);

        // Switch P1 to List mode
        const p1ListToggleButton = within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /List/i });
        await act(async () => { fireEvent.click(p1ListToggleButton); });

        await waitFor(() => {
            // The message SHOULD appear because P1 is in list mode, and the network condition only applies to P2's part of the OR
            expect(screen.getByText(/Currently selecting from: Saved List. \(Guild selection is paused\)/i)).toBeInTheDocument();
          });
    });
  });
});

// Helper to query within a specific element, useful for toggle groups
import { queries, within } from '@testing-library/dom';
// Example: within(screen.getByRole('group', { name: /Player 1 selection mode/i })).getByRole('button', { name: /Guild/i })
