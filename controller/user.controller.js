const bcrypt = require('bcrypt')
const initializePassport = require('../passport-config')
const passport = require('passport')
var Promise = require('promise')

const { auth, db } = require('../db/db.connection')
const { dbRef_n, dbRef } = require('../db/dbDt.connection')
const { userSchema, users } = require('../db/user.model')
var fs = require('fs')
// var recipes = [
//     { sensName: 'Bloody Mary', id: 3 },
//     { sensName: 'Bloody', id: 4 }
// ];
// var recipes_cont = JSON.stringify(recipes)
module.exports.register = async (req, res, next) => {

  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  userSchema.uid = hashedPassword
  userSchema.email = req.body.email
  userSchema.emailVerified = true
  userSchema.displayName = req.body.name

  auth.createUser(userSchema).then(function (userRecord) {
    console.log('Successfully created new user:', userRecord.uid)
    res.redirect('/login')
  }).catch(function (error) {
    console.log('Error creating new user:', error)
    res.redirect('/register')
  })
}

module.exports.passportAuth = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})

function loadDt (callback) {
  var Sen_Data_raw = []
  dbRef_n.on('value', snap => {
    var AllData = snap.val()
    for (var k in AllData) {
      if (k == 'State') { continue }
      for (var v in AllData[k]) {
        for (var d in AllData[k][v]) {
          var tempDt = AllData[k][v][d]
          //   var temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity,
          //     tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]

          Sen_Data_raw.push(tempDt)
        }
      }
    }
    callback(Sen_Data_raw)
  })
}
var p2 = new Promise(function (resolve, reject) {
  resolve(dbRef_n)
})
function rejectLater (resolve, reject) {
  reject(new Error('Error'))
}
module.exports.userProfile = (req, res, next) => {
  Sen_Data_raw = []
  var Sen_Data_cont = ''
  try {
    p2.then(function (value) {
      value.on('value', snap => {
        var AllData = snap.val()
        for (var k in AllData) {
          if (k == 'State') { continue }
          for (var v in AllData[k]) {
            for (var d in AllData[k][v]) {
              tempDt = AllData[k][v][d]
              temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity,
                tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]

              Sen_Data_raw.push(tempDt)
            }
          }
        }
      })
      setTimeout(function () {
        Sen_Data_cont = JSON.stringify(Sen_Data_raw)
        return res.render('data_view.ejs', { name: userSchema.displayName, recipes: Sen_Data_raw, recipes_cont: Sen_Data_cont })
      }, 2000)
    }).then(function () {
      return new Promise(rejectLater)
    })
    // loadDt(function(x){
    //     // console.log(x);
    //     Sen_Data_raw = x;
    //     Sen_Data_cont = JSON.stringify(Sen_Data_raw);
    //     res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    //     res.header("Pragma", "no-cache");
    //     res.header("Expires", 0);
    //     return res.render('data_view.ejs', { name: userSchema.displayName, recipes: Sen_Data_raw , recipes_cont: Sen_Data_cont});
    // });
  } catch (error) {
    console.log(error)
  }
}

module.exports.updateUser = (req, res, next) => {
  console.log('user updated')
  // User.findOne({ _id: req._id },
  //     (err, user) => {
  //         if (!user)
  //             return res.status(404).json({ status: false, message: 'User record not found.' });
  //         else
  //         res.render('index.ejs', { name: 'req.user.name' });
  //     }
  // );
  // return res.render('index.ejs', { name: 'req.user.name' });
}

module.exports.deleteUser = (req, res, next) => {
  console.log('user deleted')
  // User.findOne({ _id: req._id },
  //     (err, user) => {
  //         if (!user)
  //             return res.status(404).json({ status: false, message: 'User record not found.' });
  //         else
  //         res.render('index.ejs', { name: 'req.user.name' });
  //     }
  // );
  // return res.render('index.ejs', { name: 'req.user.name' });
}
