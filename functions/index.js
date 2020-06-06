const functions = require('firebase-functions');
const {client} = require('../index')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.func1 = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
