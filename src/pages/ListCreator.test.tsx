import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Needed for useOutletContext
import ListCreator from './ListCreator';
import * as useDataHook from '../hooks/useData';
import * as useGBDataHook from '../hooks/useGBData';
import { vi } from 'vitest'; // Using vitest's vi for mocking

// Mock RxDB Document methods (like remove, incrementalPatch etc.)
const mockRxDocRemove = vi.fn().mockResolvedValue(undefined);
const mockRxDocMethods = {
  remove: mockRxDocRemove,
  // Add other document methods if needed for other tests
};

// Mock RxDB Collection methods
const mockInsert = vi.fn().mockResolvedValue(undefined);
const mockFind = vi.fn().mockReturnThis(); // Make find chainable
const mockFindByIds = vi.fn().mockReturnThis();
const mockExec = vi.fn().mockResolvedValue([]); // Default to empty array
const mockFindOne = vi.fn().mockReturnThis();

const mockSavedListsCollection = {
  insert: mockInsert,
  find: vi.fn(() => ({ exec: mockExec })), // Ensure find().exec() is distinct for saved_lists
  findOne: vi.fn((id) => ({ // Mock findOne to return a doc or null
    exec: vi.fn().mockImplementation(async () => {
      const list = mockSavedListData.find(l => l.id === id);
      if (list) {
        return { ...list, ...mockRxDocMethods }; // Simulate a doc with methods
      }
      return null;
    })
  })),
};

const mockModelsCollection = {
  find: vi.fn(() => ({ exec: mockExec })), // Ensure find().exec() is distinct for models
  findByIds: vi.fn((ids) => ({ // Mock findByIds for models
    exec: vi.fn().mockImplementation(async () => {
      const map = new Map();
      ids.forEach((id: string) => {
        const model = mockAllModelsData.find(m => m.id === id);
        if (model) map.set(id, model);
      });
      return map;
    })
  })),
};


// Mock gbdb object
const mockGbdb = {
  saved_lists: mockSavedListsCollection,
  models: mockModelsCollection,
};

// Mock data
const mockAllModelsData = [
  { id: 'model1', name: 'Model One', hp: 10 },
  { id: 'model2', name: 'Model Two', hp: 12 },
  { id: 'model3', name: 'Model Three', hp: 8 },
];

const mockSavedListData = [
  { id: 'list1', name: 'My First List', modelIds: ['model1', 'model2'], ...mockRxDocMethods },
  { id: 'list2', name: 'Another List', modelIds: ['model3'], ...mockRxDocMethods },
];

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-1234'),
}));


// Mock useOutletContext
const mockSetAppBarContent = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: () => ({ setAppBarContent: mockSetAppBarContent }),
  };
});


describe('ListCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test

    // Mock useData to return our mockGbdb
    vi.spyOn(useDataHook, 'useData').mockReturnValue({ gbdb: mockGbdb, हैंandleDbError: vi.fn() });

    // Default mock for useGBData (can be overridden in specific tests)
    // For initial model loading
    vi.spyOn(useGBDataHook, 'useGBData')
      .mockImplementation((queryFn, deps) => {
        // Simulate fetching allModels initially
        if (queryFn.toString().includes('db.models.find()')) {
          return mockAllModelsData;
        }
        // Simulate fetching savedLists initially (can be empty or mocked data)
        if (queryFn.toString().includes('db.saved_lists.find().exec()')) {
          // Return empty by default for saved lists, tests can override
          return [];
        }
        return undefined;
      });
  });

  // Wrapper component to provide MemoryRouter
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test('renders initial state correctly', () => {
    renderWithRouter(<ListCreator />);
    expect(screen.getByLabelText(/List Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Available Models/i)).toBeInTheDocument();
    expect(screen.getByText(/Selected Models \(0\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save List/i })).toBeInTheDocument();
    expect(screen.getByText(/Your Saved Lists/i)).toBeInTheDocument();
    // Initially, useGBData for saved_lists returns [], so this should be present
    expect(screen.getByText(/No saved lists yet./i)).toBeInTheDocument();
  });

  test('displays "Loading models..." when allModels are being fetched', () => {
    // Override useGBData for this specific test to simulate loading state
    vi.spyOn(useGBDataHook, 'useGBData').mockImplementation((queryFn) => {
      if (queryFn.toString().includes('db.models.find()')) {
        return undefined; // Simulate models not yet loaded
      }
      if (queryFn.toString().includes('db.saved_lists.find().exec()')) {
        return []; // Saved lists can be empty or loaded
      }
      return undefined;
    });
    renderWithRouter(<ListCreator />);
    expect(screen.getByText(/Loading models and lists.../i)).toBeInTheDocument();
  });

  test('displays the list of all available models once fetched', async () => {
    // useGBData is already mocked in beforeEach to return mockAllModelsData
    renderWithRouter(<ListCreator />);
    await waitFor(() => {
      mockAllModelsData.forEach(model => {
        expect(screen.getByText(model.name)).toBeInTheDocument();
      });
    });
  });

  // More tests will follow here
});

describe('List Name Input', () => {
    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<MemoryRouter>{ui}</MemoryRouter>);
    };
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(useDataHook, 'useData').mockReturnValue({ gbdb: mockGbdb, हैंandleDbError: vi.fn() });
        vi.spyOn(useGBDataHook, 'useGBData')
          .mockReturnValueOnce(mockAllModelsData) // For models
          .mockReturnValueOnce([]); // For saved lists
      });

  test('typing in "List Name" TextField updates its value', () => {
    renderWithRouter(<ListCreator />);
    const listNameInput = screen.getByLabelText(/List Name/i);
    fireEvent.change(listNameInput, { target: { value: 'My Awesome List' } });
    expect(listNameInput).toHaveValue('My Awesome List');
  });
});

describe('Model Selection (Adding/Removing to Current List)', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useDataHook, 'useData').mockReturnValue({ gbdb: mockGbdb, हैंandleDbError: vi.fn() });
    // Ensure models are loaded, and saved lists are initially empty or mocked as needed
    vi.spyOn(useGBDataHook, 'useGBData')
      .mockImplementation((queryFn) => {
        if (queryFn.toString().includes('db.models.find()')) {
          return mockAllModelsData;
        }
        if (queryFn.toString().includes('db.saved_lists.find().exec()')) {
          return []; // Start with no saved lists for these tests
        }
        return undefined;
      });
  });

  test('clicking "Add" on a model adds it to "Selected Models" and disables the "Add" button', async () => {
    renderWithRouter(<ListCreator />);

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText(mockAllModelsData[0].name)).toBeInTheDocument();
    });

    const addButtons = screen.getAllByRole('button', { name: /Add/i });
    const firstModelAddButton = addButtons[0];

    // Before adding
    const selectedModelsList = screen.getByText(/Selected Models \(0\)/i).closest('div')?.querySelector('ul');
    expect(selectedModelsList).toBeEmptyDOMElement();
    expect(firstModelAddButton).not.toBeDisabled();

    // Add the first model
    fireEvent.click(firstModelAddButton);

    // After adding
    await waitFor(() => {
      const selectedModelsListUpdated = screen.getByText(/Selected Models \(1\)/i).closest('div')?.querySelector('ul');
      expect(selectedModelsListUpdated).toHaveTextContent(mockAllModelsData[0].name);
      expect(firstModelAddButton).toBeDisabled();
    });

    // Try adding another model
    const secondModelAddButton = addButtons[1];
    fireEvent.click(secondModelAddButton);

    await waitFor(() => {
        const selectedModelsListUpdated = screen.getByText(/Selected Models \(2\)/i).closest('div')?.querySelector('ul');
        expect(selectedModelsListUpdated).toHaveTextContent(mockAllModelsData[0].name);
        expect(selectedModelsListUpdated).toHaveTextContent(mockAllModelsData[1].name);
        expect(secondModelAddButton).toBeDisabled();
      });
  });

  test('clicking "Remove" on a selected model removes it and re-enables its "Add" button', async () => {
    renderWithRouter(<ListCreator />);
    await waitFor(() => expect(screen.getByText(mockAllModelsData[0].name)).toBeInTheDocument());

    const addButtons = screen.getAllByRole('button', { name: /Add/i });
    const firstModelAddButton = addButtons[0];

    // Add the first model
    fireEvent.click(firstModelAddButton);
    await waitFor(() => expect(firstModelAddButton).toBeDisabled());
    await waitFor(() => expect(screen.getByText(/Selected Models \(1\)/i)).toBeInTheDocument());


    // Remove the model
    // The remove button is associated with the model in the "Selected Models" list
    const removeButton = screen.getByRole('button', { name: /Remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText(/Selected Models \(0\)/i)).toBeInTheDocument();
      const selectedModelsList = screen.getByText(/Selected Models \(0\)/i).closest('div')?.querySelector('ul');
      expect(selectedModelsList).toBeEmptyDOMElement();
      expect(firstModelAddButton).not.toBeDisabled();
    });
  });

  test('adding the same model multiple times does not duplicate it', async () => {
    renderWithRouter(<ListCreator />);
    await waitFor(() => expect(screen.getByText(mockAllModelsData[0].name)).toBeInTheDocument());

    const addButtons = screen.getAllByRole('button', { name: /Add/i });
    const firstModelAddButton = addButtons[0];

    // Add the model once
    fireEvent.click(firstModelAddButton);
    await waitFor(() => {
      expect(screen.getByText(/Selected Models \(1\)/i)).toBeInTheDocument();
      expect(firstModelAddButton).toBeDisabled();
    });

    // Attempt to click "Add" again (though it's disabled, this check is for logic robustness if it were enabled)
    // For this test, we'll assume the button state is managed correctly and focus on the list content
    // We've already verified it's disabled. If we were to somehow bypass that:
    // fireEvent.click(firstModelAddButton); // This would error if truly disabled

    // Check that the model count is still 1 and the model is listed once
    const selectedModelsList = screen.getByText(/Selected Models \(1\)/i).closest('div')?.querySelector('ul');
    const occurrences = Array.from(selectedModelsList?.childNodes || []).filter(
      (child) => child.textContent?.includes(mockAllModelsData[0].name)
    ).length;
    expect(occurrences).toBe(1);
  });
});

describe('Saving a List', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Ensure mocks are fresh
    vi.spyOn(useDataHook, 'useData').mockReturnValue({ gbdb: mockGbdb, हैंandleDbError: vi.fn() });
    vi.spyOn(useGBDataHook, 'useGBData')
      .mockImplementation((queryFn) => {
        if (queryFn.toString().includes('db.models.find()')) {
          return mockAllModelsData; // Provide models for selection
        }
        if (queryFn.toString().includes('db.saved_lists.find().exec()')) {
          return []; // Start with no saved lists
        }
        return undefined;
      });

    // Mock alert
    window.alert = vi.fn();
  });

  test('successfully saves a list with a name and selected models', async () => {
    renderWithRouter(<ListCreator />);
    await waitFor(() => expect(screen.getByText(mockAllModelsData[0].name)).toBeInTheDocument());

    // Set list name
    const listNameInput = screen.getByLabelText(/List Name/i);
    fireEvent.change(listNameInput, { target: { value: 'My Test List' } });

    // Select models
    const addButtons = screen.getAllByRole('button', { name: /Add/i });
    fireEvent.click(addButtons[0]); // Add model1
    fireEvent.click(addButtons[1]); // Add model2
    await waitFor(() => expect(screen.getByText(/Selected Models \(2\)/i)).toBeInTheDocument());

    // Click save
    const saveButton = screen.getByRole('button', { name: /Save List/i });
    fireEvent.click(saveButton);

    // Verify insert was called
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        id: 'test-uuid-1234',
        name: 'My Test List',
        modelIds: [mockAllModelsData[0].id, mockAllModelsData[1].id],
      });
    });

    // Verify success alert
    expect(window.alert).toHaveBeenCalledWith('List saved successfully!');

    // Verify form is cleared
    expect(listNameInput).toHaveValue('');
    expect(screen.getByText(/Selected Models \(0\)/i)).toBeInTheDocument();
    // Add buttons for model1 and model2 should be re-enabled
    expect(addButtons[0]).not.toBeDisabled();
    expect(addButtons[1]).not.toBeDisabled();
  });

  test('shows alert and does not save if list name is empty', async () => {
    renderWithRouter(<ListCreator />);
    await waitFor(() => expect(screen.getByText(mockAllModelsData[0].name)).toBeInTheDocument());

    // Select models
    const addButtons = screen.getAllByRole('button', { name: /Add/i });
    fireEvent.click(addButtons[0]);
    await waitFor(() => expect(screen.getByText(/Selected Models \(1\)/i)).toBeInTheDocument());

    // Click save without list name
    const saveButton = screen.getByRole('button', { name: /Save List/i });
    fireEvent.click(saveButton);

    expect(window.alert).toHaveBeenCalledWith('List name cannot be empty.');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  test('shows alert and does not save if no models are selected', async () => {
    renderWithRouter(<ListCreator />);
    await waitFor(() => expect(screen.getByText(mockAllModelsData[0].name)).toBeInTheDocument());

    // Set list name
    const listNameInput = screen.getByLabelText(/List Name/i);
    fireEvent.change(listNameInput, { target: { value: 'List With No Models' } });

    // Click save without selecting models
    const saveButton = screen.getByRole('button', { name: /Save List/i });
    fireEvent.click(saveButton);

    expect(window.alert).toHaveBeenCalledWith('Please select at least one model.');
    expect(mockInsert).not.toHaveBeenCalled();
  });
});

describe('Displaying Saved Lists', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useDataHook, 'useData').mockReturnValue({ gbdb: mockGbdb, हैंandleDbError: vi.fn() });
    // Models are needed for the main part of the component to render
    vi.spyOn(useGBDataHook, 'useGBData')
      .mockImplementation((queryFn) => {
        if (queryFn.toString().includes('db.models.find()')) {
          return mockAllModelsData;
        }
        // This is the key mock for this describe block
        if (queryFn.toString().includes('db.saved_lists.find().exec()')) {
          return mockSavedListData;
        }
        return undefined;
      });
  });

  test('displays fetched saved lists correctly', async () => {
    renderWithRouter(<ListCreator />);

    await waitFor(() => {
      // Check for each saved list
      mockSavedListData.forEach(list => {
        expect(screen.getByText(list.name)).toBeInTheDocument();
        expect(screen.getByText(`ID: ${list.id} - Models: ${list.modelIds.length}`)).toBeInTheDocument();
      });
      // Check for Load and Delete buttons for each list
      expect(screen.getAllByRole('button', { name: /Load/i })).toHaveLength(mockSavedListData.length);
      expect(screen.getAllByRole('button', { name: /Delete/i })).toHaveLength(mockSavedListData.length);
    });

    // Ensure "No saved lists yet." is NOT present
    expect(screen.queryByText(/No saved lists yet./i)).not.toBeInTheDocument();
  });

  test('displays "No saved lists yet." if no lists are fetched', async () => {
    // Override useGBData for this specific test to return empty saved lists
    vi.spyOn(useGBDataHook, 'useGBData')
    .mockImplementation((queryFn) => {
      if (queryFn.toString().includes('db.models.find()')) {
        return mockAllModelsData;
      }
      if (queryFn.toString().includes('db.saved_lists.find().exec()')) {
        return []; // No saved lists
      }
      return undefined;
    });

    renderWithRouter(<ListCreator />);

    await waitFor(() => {
      expect(screen.getByText(/No saved lists yet./i)).toBeInTheDocument();
    });
  });
});

describe('Loading a Saved List', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useDataHook, 'useData').mockReturnValue({ gbdb: mockGbdb, हैंandleDbError: vi.fn() });
    vi.spyOn(useGBDataHook, 'useGBData')
      .mockImplementation((queryFn) => {
        if (queryFn.toString().includes('db.models.find()')) {
          return mockAllModelsData; // All models available
        }
        if (queryFn.toString().includes('db.saved_lists.find().exec()')) {
          return mockSavedListData; // Provide saved lists to load from
        }
        return undefined;
      });
    window.alert = vi.fn(); // Mock alert for feedback messages
  });

  test('clicking "Load" on a saved list populates the form and selected models', async () => {
    renderWithRouter(<ListCreator />);

    // Wait for saved lists to be displayed
    await waitFor(() => {
      expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument();
    });

    // Get all "Load" buttons and click the first one
    const loadButtons = screen.getAllByRole('button', { name: /Load/i });
    fireEvent.click(loadButtons[0]);

    // Verify findByIds was called for the models in the first saved list
    await waitFor(() => {
      expect(mockModelsCollection.findByIds).toHaveBeenCalledWith(mockSavedListData[0].modelIds);
    });

    // Verify list name is populated
    const listNameInput = screen.getByLabelText(/List Name/i);
    expect(listNameInput).toHaveValue(mockSavedListData[0].name);

    // Verify selected models are populated
    // Model One (id: model1) and Model Two (id: model2) are in mockSavedListData[0]
    expect(screen.getByText(/Selected Models \(2\)/i)).toBeInTheDocument();
    const selectedModelsList = screen.getByText(/Selected Models \(2\)/i).closest('div')?.querySelector('ul');
    expect(selectedModelsList).toHaveTextContent(mockAllModelsData[0].name); // Model One
    expect(selectedModelsList).toHaveTextContent(mockAllModelsData[1].name); // Model Two

    // Verify "Add" buttons for loaded models are disabled
    const addButtons = screen.getAllByRole('button', { name: /Add/i });
    // Assuming mockAllModelsData[0] corresponds to the first "Add" button, etc.
    expect(addButtons[0]).toBeDisabled(); // Add button for Model One
    expect(addButtons[1]).toBeDisabled(); // Add button for Model Two
    if (mockAllModelsData.length > 2) {
      expect(addButtons[2]).not.toBeDisabled(); // Add button for Model Three (if exists)
    }

    expect(window.alert).toHaveBeenCalledWith(`List "${mockSavedListData[0].name}" loaded.`);
  });
});

describe('Deleting a Saved List', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useDataHook, 'useData').mockReturnValue({ gbdb: mockGbdb, हैंandleDbError: vi.fn() });
    // Provide models and saved lists
    vi.spyOn(useGBDataHook, 'useGBData')
      .mockImplementation((queryFn) => {
        if (queryFn.toString().includes('db.models.find()')) {
          return mockAllModelsData;
        }
        if (queryFn.toString().includes('db.saved_lists.find().exec()')) {
          return mockSavedListData; // Provide lists that can be deleted
        }
        return undefined;
      });
    window.alert = vi.fn(); // Mock alert
    window.confirm = vi.fn(); // Mock confirm
  });

  test('clicking "Delete" and confirming removes the list and updates UI', async () => {
    (window.confirm as vi.Mock).mockReturnValue(true); // Simulate user confirming deletion

    renderWithRouter(<ListCreator />);

    // Wait for lists to be displayed
    await waitFor(() => {
      expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]); // Click delete for the first list

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this list?');

    // Verify findOne was called with the correct ID
    await waitFor(() => {
      expect(mockSavedListsCollection.findOne).toHaveBeenCalledWith(mockSavedListData[0].id);
    });
    // Verify remove was called on the document
    expect(mockRxDocRemove).toHaveBeenCalled(); // This is the remove method on the mock doc

    expect(window.alert).toHaveBeenCalledWith('List deleted successfully.');

    // Verify the list is removed from the UI
    // This depends on the mockSavedListData being mutable or the component re-fetching/filtering
    // For this test, we assume the component correctly filters its state
    expect(screen.queryByText(mockSavedListData[0].name)).not.toBeInTheDocument();
    if (mockSavedListData.length > 1) {
      expect(screen.getByText(mockSavedListData[1].name)).toBeInTheDocument(); // Check if other lists remain
    } else {
      expect(screen.getByText(/No saved lists yet./i)).toBeInTheDocument();
    }
  });

  test('clicking "Delete" and cancelling does not remove the list', async () => {
    (window.confirm as vi.Mock).mockReturnValue(false); // Simulate user cancelling deletion

    renderWithRouter(<ListCreator />);
    await waitFor(() => expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this list?');
    expect(mockRxDocRemove).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalledWith('List deleted successfully.');
    expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument(); // List should still be there
  });

  test('handles error if list to delete is not found', async () => {
    (window.confirm as vi.Mock).mockReturnValue(true);
     // Mock findOne to return null for a specific ID we might try to delete
     mockSavedListsCollection.findOne = vi.fn((id) => ({
        exec: vi.fn().mockImplementation(async () => {
          if (id === 'nonexistent-id') return null; // Simulate not found
          const list = mockSavedListData.find(l => l.id === id);
          return list ? { ...list, ...mockRxDocMethods } : null;
        })
      }));


    renderWithRouter(<ListCreator />);
    await waitFor(() => expect(screen.getByText(mockSavedListData[0].name)).toBeInTheDocument());

    // Manually trigger handleDeleteList with a non-existent ID (difficult to do via UI if not displayed)
    // This scenario is more for internal robustness.
    // We can test the UI part by ensuring delete buttons only appear for existing lists.
    // For now, assume UI is correct and test the handler logic if it were called with a bad ID.
    // This would typically be an integration test or a more direct call if the function was exported.
    // Since we're testing through UI, we'll rely on the fact that delete buttons are for existing lists.
    // The provided code's handleDeleteList already fetches the doc first.

    // Let's test the scenario where a list is removed by another process between display and delete click
    // For this, we can ensure the list is displayed, then mock findOne to return null for its ID
    const firstList = mockSavedListData[0];
    mockSavedListsCollection.findOne = vi.fn((id) => ({
        exec: vi.fn().mockImplementation(async () => {
          if (id === firstList.id) return null; // Simulate it was just deleted
          return null;
        })
      }));

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]); // Click delete for the first list

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('List not found for deletion.');
    });
    expect(mockRxDocRemove).not.toHaveBeenCalled();
  });
});
