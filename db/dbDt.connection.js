var firebase = require("firebase");
// var firebase_n = require("firebase");

const app1 = firebase.initializeApp({
    databaseURL: "https://cc2650-ff366.firebaseio.com/"
});
const app2 = firebase.initializeApp({
    databaseURL: "https://user-31408.firebaseio.com/"
}, "secondary");
var dbRef_n = firebase.database(app1).ref("/");
var dbRef = firebase.database(app2).ref("/");

module.exports = {dbRef_n, dbRef};
