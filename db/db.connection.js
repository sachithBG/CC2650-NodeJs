var firebase = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
var cred = require("./serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://user-31408.firebaseio.com"
});

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: 'https://user-31408.firebaseio.com'
// })
// app = firebase.app()
// app2 = app.database('https://cc2650-ff366.firebaseio.com')

const auth = firebase.auth();
var db = firebase.database();
// var db1 = app2;
// var db1 = app.database("https://cc2650-ff366.firebaseio.com"); 

module.exports = { auth, db };

// function User_db (){
//   return "{ auth, db }"
// }
// (req, res, next) =>{
//   firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount),
//     databaseURL: "https://user-31408.firebaseio.com"
//   });
//   const auth = firebase.auth();
//   var db = firebase.database();

//   return 'auth';
// }
// module.exports.Data_db = (req, res, next) =>{
//   firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount),
//     databaseURL: "https://cc2650-ff366.firebaseio.com"
//   });
//   const auth = firebase.auth();
//   var db = firebase.database();

//   return {auth, db};
// }
// module.exports.Deflt_Data_db = (req, res, next) =>{
//   firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount),
//     databaseURL: "https://user-31408.firebaseio.com"
//   });
//   const auth = firebase.auth();
//   var db = firebase.database();

//   return {auth, db};
// }
