console.log(firebase)

const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');

// Set up authentication
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Event handlers
signInButton.onclick = () => auth.signInWithPopup(provider);
signOutButton.onclick = () => auth.signOut();

const signedIn = document.getElementById('signedIn');
const signedOut = document.getElementById('signedOut');
const userDetails = document.getElementById('userDetails');

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        signedIn.hidden = false;
        signedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        signedIn.hidden = true;
        signedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

const exerciseName = document.getElementById('exerciseName');
const createExercise = document.getElementById('createExercise');
const exercisesList = document.getElementById('exercisesList');

const db = firebase.firestore();
let exercisesReference;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        exercisesReference = db.collection('exercises')

        createExercise.onclick = () => {

        const { serverTimestamp } = firebase.firestore.FieldValue;

        exercisesReference.add({
            uid: user.uid,
            name: exerciseName.value,
            createdAt: serverTimestamp()
        });

        }

        // Query
        unsubscribe = exercisesReference.where('uid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                
                // Map results to an array of li elements

                const items = querySnapshot.docs.map(doc => {

                    return `<li>${doc.data().name}</li>`

                });

                exercisesList.innerHTML = items.join('');

            });

    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
});
