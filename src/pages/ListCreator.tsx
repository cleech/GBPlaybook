import React, { useEffect, useState } from "react";
import { Box, Typography, Container, List, ListItem, ListItemText, TextField, Button, Grid, Divider, Paper } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import type { AppBarContent } from "../components/AppBar";
import { useGBData } from "../hooks/useGBData";
import { useData } from "../hooks/useData";
import { GBModelDoc, GBDatabase, GBSavedList, GBSavedListDoc } from "../models/gbdbTypes"; // Added GBSavedListDoc
import { v4 as uuidv4 } from 'uuid';

const ListCreator: React.FC = () => {
  const { setAppBarContent } = useOutletContext<AppBarContent>();
  const { gbdb } = useData();
  const [allModels, setAllModels] = useState<GBModelDoc[] | undefined>(undefined);
  const [currentListName, setCurrentListName] = useState<string>("");
  const [currentSelectedModels, setCurrentSelectedModels] = useState<GBModelDoc[]>([]);
  const [savedLists, setSavedLists] = useState<GBSavedListDoc[]>([]); // Added

  useEffect(() => {
    setAppBarContent("Create Custom List", [{ name: "List Creator" }]);
  }, [setAppBarContent]);

  const fetchedModels = useGBData<GBModelDoc[]>(
    async (db: GBDatabase) => {
      const modelsQuery = db.models.find();
      return await modelsQuery.exec();
    },
    [] // dependencies array for useGBData
  );

  // Fetch saved lists
  const fetchedSavedLists = useGBData<GBSavedListDoc[]>(
    async (db: GBDatabase) => db.saved_lists.find().exec(),
    [] // Dependencies for useGBData, might need adjustment if re-fetch is complex
  );

  useEffect(() => {
    if (fetchedModels) {
      setAllModels(fetchedModels);
    }
  }, [fetchedModels]);

  useEffect(() => {
    if (fetchedSavedLists) {
      setSavedLists(fetchedSavedLists);
    }
  }, [fetchedSavedLists]);

  const handleAddSelectedModel = (model: GBModelDoc) => {
    if (!currentSelectedModels.find(m => m.id === model.id)) {
      setCurrentSelectedModels([...currentSelectedModels, model]);
    }
  };

  const handleRemoveSelectedModel = (modelId: string) => {
    setCurrentSelectedModels(currentSelectedModels.filter(m => m.id !== modelId));
  };

  const isModelSelected = (modelId: string) => {
    return !!currentSelectedModels.find(m => m.id === modelId);
  };

  const handleSaveList = async () => {
    if (!currentListName.trim()) {
      alert("List name cannot be empty.");
      return;
    }
    if (currentSelectedModels.length === 0) {
      alert("Please select at least one model.");
      return;
    }

    if (!gbdb) {
      console.error("Database not available.");
      alert("Database not available. Cannot save list.");
      return;
    }

    const listId = uuidv4();
    const savedListObject: GBSavedList = {
      id: listId,
      name: currentListName.trim(),
      modelIds: currentSelectedModels.map(model => model.id),
    };

    try {
      await gbdb.saved_lists.insert(savedListObject);
      alert('List saved successfully!');
      setCurrentListName('');
      setCurrentSelectedModels([]);
    } catch (error) {
      console.error('Error saving list:', error);
      alert('Failed to save list. See console for details.');
    }
  };

  const handleLoadList = async (listToLoad: GBSavedListDoc) => {
    if (!gbdb) {
      console.error("Database not available.");
      alert("Database not available. Cannot load list.");
      return;
    }
    setCurrentListName(listToLoad.name);
    try {
      const modelDocsMap = await gbdb.models.findByIds(listToLoad.modelIds).exec();
      const modelsArray = Array.from(modelDocsMap.values()).filter(Boolean) as GBModelDoc[];
      setCurrentSelectedModels(modelsArray);
      alert(`List "${listToLoad.name}" loaded.`);
    } catch (error) {
      console.error('Error loading models for the list:', error);
      alert('Failed to load models for the list.');
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;

    if (!gbdb) {
      console.error("Database not available.");
      alert("Database not available. Cannot delete list.");
      return;
    }

    try {
      const listDoc = await gbdb.saved_lists.findOne(listId).exec();
      if (listDoc) {
        await listDoc.remove();
        alert('List deleted successfully.');
        setSavedLists(prevLists => prevLists.filter(l => l.id !== listId));
      } else {
        alert('List not found for deletion.');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete list.');
    }
  };


  if (!allModels) {
    return (
      <Container>
        <Typography>Loading models and lists...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          label="List Name"
          value={currentListName}
          onChange={(e) => setCurrentListName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2" gutterBottom>
              Available Models
            </Typography>
            <List sx={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}>
              {allModels.map((model) => (
                <ListItem
                  key={model.id}
                  secondaryAction={
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddSelectedModel(model)}
                      disabled={isModelSelected(model.id)}
                    >
                      Add
                    </Button>
                  }
                >
                  <ListItemText primary={model.name} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h2" gutterBottom>
              Selected Models ({currentSelectedModels.length})
            </Typography>
            <List sx={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}>
              {currentSelectedModels.map((model) => (
                <ListItem
                  key={model.id}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleRemoveSelectedModel(model.id)}
                    >
                      Remove
                    </Button>
                  }
                >
                  <ListItemText primary={model.name} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveList}
            disabled={!gbdb} // Disable if db is not available
          >
            Save List
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Saved Lists
          </Typography>
          {savedLists.length === 0 ? (
            <Typography>No saved lists yet.</Typography>
          ) : (
            <Paper elevation={2} sx={{ maxHeight: '400px', overflow: 'auto' }}>
              <List>
                {savedLists.map((list) => (
                  <ListItem
                    key={list.id}
                    secondaryAction={
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleLoadList(list)}
                          sx={{ mr: 1 }}
                        >
                          Load
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleDeleteList(list.id)}
                        >
                          Delete
                        </Button>
                      </>
                    }
                  >
                    <ListItemText primary={list.name} secondary={`ID: ${list.id} - Models: ${list.modelIds.length}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ListCreator;
