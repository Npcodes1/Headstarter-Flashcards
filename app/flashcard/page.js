import { useUser } from "@clerk/nextjs"; //for authentication
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation"; //to get flashcard set ID from the url

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  //to get all flashcards in a specific set and update the flashcard state.
  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDocs(docRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
    }
    getFlashcard();
  }, [user]);

  //to handle flipping the flashcards => toggles flip state of flashcard when clicked
  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }
  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box
                    sx={
                      {
                        /* Styling for flip animation using CSS transforms and transitions */
                      }
                    }
                  >
                    <div>
                      <div>
                        <Typography variant="h5">{flashcard.front}</Typography>
                      </div>
                      <div>
                        <Typography variant="h5">{flashcard.back}</Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
