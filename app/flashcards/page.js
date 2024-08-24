import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/router";

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
}

//navigate to the individual flashcard sets
const handleCardClick = (id) => {
  router.push(`/flashcard?id=${id}`); //navigates to flashcard page with the selected flashcard set's ID as a query parameter
};

return (
  <Container maxWidth="md">
    <Grid container spacing={3} sx={{ mt: 4 }}>
      {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {flashcard.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);
