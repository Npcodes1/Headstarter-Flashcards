"use client";

import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  CardActionArea,
} from "@mui/material";

import { getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);

  //add state for flashcard set name and dialog open state
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    //check if the input text is empty. If it is, alert that it is.
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      //send a POST request to our api/generate route with the input text
      fetch("/generate", {
        method: "POST",
        body: text,
      })
        .then((res) => res.json())
        .then((data) => setFlashcards(data));

      //if response not successful => show error
      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }
      //if response successful => update flashcards with the generated data.
      // const data = await response.json();
      // setFlashcards(data);
      // console.log(data);

      //if error, log error and alert user.
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  //to handle flipping the flashcards => toggles flip state of flashcard when clicked
  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //functions to open/close dialog
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  //add function to save flashcards to Firebase
  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const batch = writeBatch(db);
      const userDocRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data().flashcards || [];
        if (userData.find((f) => f.name === name)) {
          alert("Flashcard collection with the same name already exists.");
        } else {
          //   userData.push({ name });
          //   batch.set(userDocRef, { flashcards: collections }, { merge: true });
        }

        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name }] });
      }

      const setDocRef = collection(userDocRef, name);
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(setDocRef);
        batch.set(cardDocRef, { flashcard });
      });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Generate Flashcards
        </Typography>
        <Paper sx={{ p: 4, width: "100%" }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Paper>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{
            bgcolor: "#F5C6C6",
            color: "#000",
            "&:hover": {
              backgroundColor: "#000",
              color: "#F5C6C6",
            },
          }}
        >
          Generate Flashcards
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <CardActionArea
                onClick={() => {
                  handleCardClick(index);
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0 0.2",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      },
                      "& > div >": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        p: 2,
                        boxSizing: "border-box",
                      },
                      "& > div > div:nth-of-type(2)": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <div>
                      <div>
                        <Typography variant="h5">{flashcard.front}</Typography>
                      </div>
                      <div>
                        <Typography variant="h5" sx={{ mt: 2 }}>
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            ))}
          </Grid>
        </Box>
      )}

      {/* Save flashcards button */}
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Save Flashcards
          </Button>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
