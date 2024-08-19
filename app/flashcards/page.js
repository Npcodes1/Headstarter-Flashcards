'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, Typography, CircularProgress, Box } from "@mui/material";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch flashcard sets when the component mounts or user changes
  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;

      try {
        const docRef = doc(collection(db, "users"), user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setFlashcards(collections);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    }

    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Your Flashcard Sets</Typography>
      {flashcards.length > 0 ? (
        <Grid container spacing={3}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h6">{flashcard.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6">You have no flashcard sets yet.</Typography>
      )}
    </Container>
  );
}

/*'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  //fetch flashcard sets using useEffect for when the component mounts or user changes
  useEffect(() => {
    async function getFlashcards() {
      //to check if user object exists. if it doesn't, do nothing.
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id); //creates a reference to the document and specifies what collection being targeted.
      const docSnap = await getDoc(docRef); //retrieves document snapshot from Firestore asynchronously. Fetches document data using getDoc() and uses await (since it's returning a promise)  to wait for the promise to resolve before proceeding.

      //if user document exists, set the flashcards state with the user's flashcard collections
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);

        //if document doesn't exist, create one with an empty flashcards array
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  
  if(!isLoaded || !isSignedIn){
    return <></>
}

const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
}


return(
  <Container maxWidth = "100vw">
      <Grid container spacing={3} sx={{mt:4}}>
          {flashcards.map((flashcard,index)=>(
              <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                      <CardActionArea onClick={()=>{handleCardClick(flashcard.name)}}>
                          <CardContent>
                              <Typography variant="h6">{flashcard.name}</Typography>
                          </CardContent>
                      </CardActionArea>
                  </Card>
              </Grid>
          ))}
      </Grid>
  </Container>
)
};
*/
