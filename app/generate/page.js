"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, collection, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [setName, setSetName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async()=>{
    fetch('api/generate',{
        method:'POST',
        body: text,
    })
    .then((res)=>res.json())
    .then((data) => setFlashcards(data))
};

  /*const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      const response = await fetch('generate.js', {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };*/

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(setDocRef);
        batch.set(cardDocRef, flashcard);
      });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleClose();
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4">Generate Flashcards</Typography>
        <Paper sx={{ p: 4, width: "100%" }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter Text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
            Submit
          </Button>
        </Paper>
      </Box>
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Flashcards Preview</Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(index)}>
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
                            transform: flipped[index] ? "rotateY(180deg)" : "rotateY(0deg)",
                          },
                          "& > div > div": {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                          },
                          "& > div > div:nth-of-type(2)": {
                            transform: "rotateY(180deg)",
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}



/*"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, collection, getDoc,writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default function Generate() {
  const {isLoaded, isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [setName, setSetName] = useState("");
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async()=>{
    fetch('api/generate',{
        method:'POST',
        body: text,
    })
    .then((res)=>res.json())
    .then((data) => setFlashcards(data))
}

const handleCardClick = (id) =>{
  setFlipped((prev)=>({
      ...prev,
      [id]: !prev[id],
  }))
}

const handleOpen=()=>{
  setOpen(true)
}
const handleClose=()=>{
  setOpen(false)
}
const saveFlashcards= async()=>{
  if(!setName){
      alert('Please enter a name')
      return
  }
  const batch = writeBatch(db)
  const userDocRef = doc(collection(db,'users'))
  const docSnap = await getDoc(userDocRef)

  if (docSnap.exists()){
      const collections = docSnap.data().flashcards || []
      if (collection.find((f)=>f.name === name)){
          alert('Flashcard collection with the same name already exists.')
          return
      }
      else{
          collections.push({name})
          batch.set(userDocRef, {flashcards: collections},{merge:true})
      }
  }
  else{
      batch.set(userDocRef, {flashcards: [{name}]})
  }

  const colRef = collection(userDocRef,name)
  flashcards.forEach((flashcard)=>{
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
  })

  await batch.commit()
  handleClose()
  router.push('/flashcards')
}*/

/*
  //add state for flashcard set name and dialog open state
  const [dialogOpen, setDialogOpen] = useState(false);

  //functions to open/close dialog
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSubmit = async () => {
    //check if the input text is empty. If it is, alert that it is.
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      //send a POST request to our api/generate route with the input text
      const response = await fetch("api/generate", {
        method: "POST",
        body: text,
      });

      //if response not successful => show error
      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }
      //if response successful => update flashcards with the generated data.
      const data = await response.json();
      setFlashcards(data);

      //if error, log error and alert user.
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  //add function to save flashcards to Firebase
  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  }; */

  /*
  return(
    <Container maxWidth="md">
        <Box sx={{mt:4,mb:6,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <Typography variant="h4">Generate Flashcards</Typography>
            <Paper sx={{p:4, width: "100%"}}>
                <TextField value={text}
                onChange={(e)=>setText(e.target.value)}
                label="Enter Text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{
                  mb:2,  
                }}/>
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                    Submit
                </Button>
            </Paper>
        </Box>
        {flashcards.length > 0 && (
            <Box sx={{mt: 4}}>
            <Typography variant="h5">Flashcards Preview</Typography>
            <Grid container spacing={3}>
                {flashcards.map((flashcard, index)=>(
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea
                              onClick={()=>{
                                handleCardClick(index)
                              }}
                            >
                                <CardContent>
                                    <Box sx={{perspective:'1000px',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position:'relative',
                                            width:'100%',
                                            height: '400px',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                            transform: flipped[index]? 'rotateY(180deg)': 'rotateY(0deg)',
                                        },
                                        '& > div > div': {
                                            position: 'absolute',
                                            width:'100%',
                                            height: '100%',
                                            backfaceVisibility: "hidden",
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box'
                                        },
                                        '& > div > div:nth-of-type(2)':{

                                        transform : 'rotateY(180deg)'
                                        },
                                     }}>
                                        <div>
                                        <div>
                                            <Typography variant="h5" component="div">
                                                {flashcard.front}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h5" component="div">
                                                {flashcard.back}
                                            </Typography>
                                        </div>
                                        </div>
                                        </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{mt: 6, display:'flex', justifyContent: 'center'}}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Save
                </Button>
            </Box>
            </Box>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle> 
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection.
                    </DialogContentText>
                    <TextField autoFocus margin="dense" label="Collection Name" type="text" fullWidth value={name} onChange={(e)=>setName(e.target.value)} variant="outlined"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
    </Container>
)
}*/
/*
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Generate Flashcards
        </Typography>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
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
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Front:</Typography>
                    <Typography>{flashcard.front}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Back:
                    </Typography>
                    <Typography>{flashcard.back}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {// Save flashcards button }
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
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
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
*/
