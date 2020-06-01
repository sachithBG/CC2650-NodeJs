const {dbRef_n, dbRef} = require('../db/dbDt.connection')
var Promise = require('promise');
var assert = require('assert');

const { userSchema, users} = require('../db/user.model')
var fs = require('fs');
// var recipes = [
//     { sensName: 'Bloody Mary', id: 3 },
//     { sensName: 'Bloody', id: 4 }
// ];

// var recipes_cont = JSON.stringify(recipes)

// const passport = require('passport');

// JSON.stringify(array[k][i][j])


var p1 = new Promise(function(resolve, reject) {
    resolve(dbRef_n);
});
var p2 = new Promise(function(resolve, reject) {
    resolve(dbRef);
});

// function rejectLater(resolve, reject) {
//     reject(new Error('Error'));
// }

function crud(path, dta, typ, callback) {
    p1.then(function(db_n) {
        if(typ == 'update'){
            db_n.child(path).update(dta, function () {
                callback("data has been updated ");
            }).catch(function(error) {
                throw Error('Unable to update data.'+error);
            });
        }else if(typ == 'delete'){
            db_n.child(path).remove(function () {
                callback("data has been removed");
            }).catch(function(error) {
                throw Error('Unable to delete data.'+error);
            });
        }
    }).catch((error) => {
        console.log('promise err');
    });

}

var stp = new Promise(function(resolve, reject) {
    resolve('stop');
});
module.exports.saveData = async (req, res, next) =>{
    array = Object.assign({}, req.body.data);
    state = array;
    for(var k  in  array){
        // const userRef = dbRef_n.child('/');
        // userRef.remove().then(function () {
        //     console.log("data has been removed");
        // });
        
        for(var i in array[k]){
            for(var j in array[k][i]){
                for(var l in array[k][i][j]){
                    try {
                        // console.log(typeof state[0].sens_tag_day == "undefined")
                        if(state[0] == 'stop' || typeof state[0] == "undefined" || state[0] == []){
                            await stp.then(async function(stt) {
                                if(state[0] == stt || typeof state[0].sens_tag_day == "undefined"){
                                    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                                    res.header("Pragma", "no-cache");
                                    res.header("Expires", 0);
                                    await res.status(200).send('Stopped');
                                 }
                            });
                        }
                        
                        if(typeof state[0] != "undefined" && state[0] != []){
                            console.log(state[0]);
                        await p2.then(async function(db_a) {
                            var er = 'Ok';
                            await db_a.child(i+'/'+j+'/'+l+'/').update(array[k][i][j][l], function () {
                                console.log("data has been inserted");
                                er = 'No'
                                next();
                            }).catch(function(error) {
                                er = 'Ok';
                                throw Error('Unable to insert data. '+error);
                            });
                            return er;
                        }).then( async function(stt){
                            if(stt == 'No'){
                                await p1.then(async function(db_n) {
                                    await db_n.child(i+'/'+j+'/'+l).remove(function () {
                                        console.log("data has been removed");
                                        next();
                                    }).catch(function(error) {
                                        throw Error('Unable to remove data. '+error);
                                    });
                                });
                            };
                        }).catch((error) => {
                            console.log('promise err');
                        }); 
                    }
                    }catch(err) {
                        // console.log('promise err1');
                    }    
                     
                    // console.log("data has been removed"+ JSON.stringify(array[k][i][j]));
                }
            }
            // 
            // console.log("data has been removed"+i);
            // dbRef_n.update(Object.assign({}, array[k]), function () {
            //     console.log("data has been inserted");
            //     const userRef = dbRef_n.child('/'+ i);
            //     userRef.remove().then(function () {
            //         console.log("data has been removed"+i);
            //     });
            // }).catch(error => {
            //     console.log("error".error+"sdsdsdsd");
            // });
        }
    };  
}

module.exports.updateData = async (req, res, next) =>{
    console.log("update..")
    array = Object.assign({}, req.body.data);
    
    for(var k  in  array){
        for(var i in array[k]){
            for(var j in array[k][i]){
                var path = k+'/'+i+'/'+j;
                var dta = array[k][i][j];
                var typ = 'update';
                try {
                    crud(path, dta, typ, function(x){
                        console.log(x);
                        res.status(200).send('OK')
                        });
                    // dbRef_n.child(path).update(dta, function () {
                    //     console.log("data has been updated ");
                    // }).catch(function(error) {
                    //     throw Error('Unable to save user.'+error);
                    // });
                }catch(err) {
                    console.log('err'); 
                    throw err;
                }
            }
        }
    }
    // for(var k  in  array){
    //     for(var i in array[k]){
    //         for(var j in array[k][i]){
    //             // for(var l in array[k][i][j]){
    //                 //  console.log(array[k][i]+"  data has been updated  "+k+'/'+i+'/'+j+'/'+l);
    //                 var path = k+'/'+i+'/'+j;
    //                 var dta = array[k][i][j];
    //                 var typ = 'update';
    //                 try {
    //                     // await Promise.all(crudt(path, dta, typ)).then(data => {
    //                     //     console.log('k');
    //                     // });
    //                     crud(path, dta, typ, function(x){
    //                         console.log(x);
    //                         });
    //                     // dbRef_n.child(k+'/'+i+'/'+j).update(array[k][i][j], function () {
    //                     //     console.log("data has been updated ");
    //                     // });
    //                 }catch(err) {
    //                     console.log('err'); 
    //                     throw err;
    //                 }
    //             // }
    //         }
    //     }
    // }
}

module.exports.deleteData = (req, res, next) =>{
    console.log("delete..")
    array = Object.assign({}, req.body.data);
    for(var k  in  array){
        for(var i in array[k]){
            for(var j in array[k][i]){
                // for(var l in array[k][i][j]){
                    try {
                        var path = k+'/'+i+'/'+j;
                        var dta = '';
                        var typ = 'delete';
                        crud(path, dta, typ, function(x){
                            console.log(x);
                            res.status(200).send('OK')
                            });
                        // dbRef_n.child(k+'/'+i+'/'+j).remove(function () {
                        //     console.log("data has been removed");
                        //     res.end();
                        //     return next();
                        // });
                    }catch(err) {
                        console.log('err');
                    }
                // }
            }
        }
    }
}
// var Sen_Data_raw1 = [];
// function promise1(){
//     var AllData = { }
//     dbRef_n.on("value", snap => {
//         AllData = snap.val()
//         var sens_tag_day_ = []
//         var values = []
//         var time_ = []
//         var time_values_ = []
//         var Sen_Id = []
//         var Sen_Data = []
//         Sen_Data_raw1 = [];
    
//         for(var k in AllData){
//             sens_tag_day_.push(k);
//             values.push(AllData[k]);
//             if('State' == k){continue}
//             for(var v in AllData[k]){
//                 // console.log(v); //time
//                 // console.log(AllData[k][v]); //data with outer id
//                 time_.push(v);
//                 time_values_.push(AllData[k][v]);
//                 for(var d in AllData[k][v]){
//                     // console.log(d); //outer id
//                     // console.log(AllData[k][v][d]); // data
//                     Sen_Id.push(d);
//                     Sen_Data.push(AllData[k][v][d]);
//                     tempDt = AllData[k][v][d]
//                     // for(var sd in Sen_Data){
//                         // console.log(tempDt.Accelerometer);
//                     // console.log(tempDt.ID+"|"+tempDt.SenName+"|"+tempDt.Date+"|"+tempDt.Time+"|"+tempDt.Temp
//                     // +"|"+tempDt.Humidity+"|"+tempDt.Barometer+"|"+tempDt.Accelerometer+"|"+tempDt.Magnetometer
//                     // +"|"+tempDt.Gyroscope+"|"+tempDt.Light+"|"+tempDt.Battery)
//                     temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity, 
//                         tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]
                        
//                         Sen_Data_raw1.push(tempDt)
//                     // }
//                 }
//             }
//         }
//         // dbRef_n.onDisconnect();
//         // dbRef_n.off();
//         return Sen_Data_raw1;
//         // resolve(Sen_Data_raw1);
//     });
// };
function loadDt_n(callback){
    var Sen_Data_raw = [];
    dbRef_n.on("value", snap => {
        var AllData = snap.val();
        for(var k in AllData){
            if('State' == k){continue}
            for(var v in AllData[k]){
                for(var d in AllData[k][v]){
                    tempDt = AllData[k][v][d]
                    temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity, 
                        tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]
                        
                    Sen_Data_raw.push(tempDt)
                }
            }
        }
        callback(Sen_Data_raw);
    });
}

module.exports.tbleRefresh = (req, res, next) =>{
    // console.log("OK");
    var Sen_Data_raw = [];
    var Sen_Data_cont = '';
    {
        try {
            p1.then(function(value) {
                value.on("value", snap => {
                    var AllData = snap.val();
                    for(var k in AllData){
                        if('State' == k){continue}
                        for(var v in AllData[k]){
                            for(var d in AllData[k][v]){
                                tempDt = AllData[k][v][d]
                                temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity, 
                                    tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]
                                    
                                Sen_Data_raw.push(tempDt)
                            }
                        }
                    }
                });
                // Sen_Data_raw = value;
                Sen_Data_cont = Object.keys(Sen_Data_raw).length;
                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);
                res.send({count: Sen_Data_cont, dta: Sen_Data_raw});
             }).catch((error) => {
                console.log('promise err');
            });
            // loadDt_n(function(x){
            //     // console.log(x);
            //     Sen_Data_raw = x;
            //     Sen_Data_cont = Object.keys(Sen_Data_raw).length;
            //     res.send({count: Sen_Data_cont, dta: Sen_Data_raw});
            //     res.end();
            //     return next();
            //     });
        } catch (error) {
            console.log(error);
        }
    };
    // Sen_Data_raw1 = [];
    // var Sen_Data_cont = '';
    // var stt = false;
    // const get_data = () => {
    //     try {
    //         promise1(function(){
    //             Sen_Data_cont = Object.keys(Sen_Data_raw1).length;
    //             stt = true;
    //         });
    //         while(true){
    //             if(stt){
    //                 res.send({count: Sen_Data_cont, dta: Sen_Data_raw1});
    //                 res.end();
    //                 return next();
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // get_data();
};
// ////////////////////////////////////////////////for all data tbl

// module.exports.passportAuth = passport.authenticate('local', {
//     successRedirect: '/data/all_data',
//     failureRedirect: '/login',
//     failureFlash: true
// })


// var Sen_Data_raw2 = [];
function promise2(callback){
    var AllData = { }
    var Sen_Data_raw2 = [];
    {
        dbRef.on("value", snap => {
            AllData = snap.val();
            for(var k in AllData){
                if('State' == k){continue}
                for(var v in AllData[k]){
                    for(var d in AllData[k][v]){
                        tempDt = AllData[k][v][d]
                        temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity, 
                            tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]
                            
                        Sen_Data_raw2.push(tempDt)
                    }
                }
            }
            return callback(Sen_Data_raw2);
        });
    }
};
// promise_ = new Promise((resolve, reject) => {
//     var AllData = { }
//     {
//         dbRef.on("value", snap => {
//             AllData = snap.val();
//             for(var k in AllData){
//                 if('State' == k){continue}
//                 for(var v in AllData[k]){
//                     for(var d in AllData[k][v]){
//                         tempDt = AllData[k][v][d]
//                         temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity, 
//                             tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]
                            
//                         Sen_Data_raw2.push(tempDt)
//                     }
//                 }
//             }
//             // console.log(Sen_Data_raw2)
//             resolve(Sen_Data_raw2);
//         });
//     }
// });
function loadDt(callback){
    var Sen_Data_raw = [];
    dbRef.on("value", snap => {
        var AllData = snap.val();
        for(var k in AllData){
            if('State' == k){continue}
            for(var v in AllData[k]){
                for(var d in AllData[k][v]){
                    tempDt = AllData[k][v][d]
                    temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity, 
                        tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]
                        
                    Sen_Data_raw.push(tempDt)
                }
            }
        }
        callback(Sen_Data_raw);
    });
}

function crud_all(path, dta, typ, callback) {
    p2.then(function(db_a) {
        if(typ == 'update'){
            db_a.child(path).update(dta, function () {
                callback("data has been updated ");
            }).catch(function(error) {
                throw Error('Unable to update data.'+error);
            });
        }else if(typ == 'delete'){
            db_a.child(path).remove(function () {
                callback("data has been removed");
            }).catch(function(error) {
                throw Error('Unable to delete data.'+error);
            });
        }
    }).catch((error) => {
        console.log('promise err');
    });

}

module.exports.all_data = async (req, res, next) =>{
    var Sen_Data_raw = [];
    var Sen_Data_cont = '';
    {
        try {
            await p2.then(async function(value) {
                value.on("value", snap => {
                    var AllData = snap.val();
                    for(var k in AllData){
                        if('State' == k){continue}
                        for(var v in AllData[k]){
                            for(var d in AllData[k][v]){
                                tempDt = AllData[k][v][d]
                                temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity, 
                                    tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]
                                    
                                Sen_Data_raw.push(tempDt)
                            }
                        }
                    }
                });

                Sen_Data_cont = JSON.stringify(Sen_Data_raw);
                await setTimeout(async function(){ 
                    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                    res.header("Pragma", "no-cache");
                    res.header("Expires", 0);
                    return res.render('all_data_view.ejs', { name: userSchema.displayName, recipes: Sen_Data_raw , recipes_cont: Sen_Data_cont});
                }, 2000);
                }).catch((error) => {
                    console.log('promise err');
                });
            // loadDt(function(x){
            //     // console.log(x);
            //     Sen_Data_raw = x;
            //     Sen_Data_cont = JSON.stringify(Sen_Data_raw);
            //     return res.render('all_data_view.ejs', { name: userSchema.displayName, recipes: Sen_Data_raw , recipes_cont: Sen_Data_cont});
            // });
        } catch (error) {
            console.log(error);
        }
    };
    // try {
    //     const get_data = () => {
    //         try {
    //             promise2(function(){
    //                 Sen_Data_cont = Object.keys(Sen_Data_raw2).length;
    //                 console.log(Sen_Data_cont);
    //                 stt = true;
    //                 // res.send({count: Sen_Data_cont, dta: Sen_Data_raw2});
    //             });
    //             while(true){
    //                 if(stt){
    //                     Sen_Data_cont = JSON.stringify(Sen_Data_raw2);
    //                     return res.render('all_data_view.ejs', { name: userSchema.displayName, recipes: Sen_Data_raw2 , recipes_cont: Sen_Data_cont});      
    //                 }
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     get_data();
        // Promise.all(promise_).then(
        //     () => {
        //         console.log(Object.keys(Sen_Data_raw2).length+'dd.');
        //         Sen_Data_cont = JSON.stringify(Sen_Data_raw2);
        //         return res.render('all_data_view.ejs', { name: userSchema.displayName, recipes: Sen_Data_raw2 , recipes_cont: Sen_Data_cont});      
        //     });
    // } catch (error) {
    //     console.log(error);
    // }
}

module.exports.tbleAllRefresh = async (req, res, next) =>{
    var Sen_Data_raw = [];
    var Sen_Data_cont = '';
    {
        try {
            await p2.then(async function(value) {
                value.on("value", snap => {
                    var AllData = snap.val();
                    for(var k in AllData){
                        if('State' == k){continue}
                        for(var v in AllData[k]){
                            for(var d in AllData[k][v]){
                                tempDt = AllData[k][v][d]
                                temp = [tempDt.ID, tempDt.SenName, tempDt.Date, tempDt.Time, tempDt.Temp, tempDt.Humidity, 
                                    tempDt.Barometer, tempDt.Accelerometer, tempDt.Magnetometer, tempDt.Gyroscope, tempDt.Light, tempDt.Battery]
                                    
                                Sen_Data_raw.push(tempDt)
                            }
                        }
                    }
                });
                await setTimeout(async function(){ 
                    Sen_Data_cont = Object.keys(Sen_Data_raw).length;
                    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                    res.header("Pragma", "no-cache");
                    res.header("Expires", 0);
                    res.send({count: Sen_Data_cont, dta: Sen_Data_raw});
                },1000);
             }).catch((error) => {
                console.log('promise err');
            });
            // loadDt(function(x){
                // console.log(x);
                
                // Sen_Data_raw = x;
                // Sen_Data_cont = Object.keys(Sen_Data_raw).length;
                // res.send({count: Sen_Data_cont, dta: Sen_Data_raw});
                // res.end();
                // return next();
                // });
        } catch (error) {
            console.log(error);
        }
    };
    // Sen_Data_raw2 = [];
    // var Sen_Data_cont = '';
    // var stt = false;
    // const get_data = () => {
    //     try {
    //         promise2(function(){
    //             Sen_Data_cont = Object.keys(Sen_Data_raw2).length;
    //             stt = true;
    //         });
    //         while(true){
    //             if(stt){
    //                 res.send({count: Sen_Data_cont, dta: Sen_Data_raw2});
    //                 res.end();
    //                 return next();
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // get_data();
};

module.exports.updateAllData = (req, res, next) =>{
    console.log("update")
    array = Object.assign({}, req.body.data);
    for(var k  in  array){
        for(var i in array[k]){
            for(var j in array[k][i]){
                // for(var l in array[k][i][j]){
                    //  console.log(array[k][i]+"  data has been updated  "+k+'/'+i+'/'+j+'/');
                    var path = k+'/'+i+'/'+j;
                    var dta = array[k][i][j];
                    var typ = 'update';
                    try {
                        crud_all(path, dta, typ, function(x){
                            console.log(x);
                            res.status(200).send('OK')
                            });
                        // dbRef.child(path).update(dta).then(function (){
                        //     console.log("data has been updated ");
                        //     res.end();
                        //     return next();
                        // }).catch(err=>{
                        //     // This catch function is not ever called.
                        //     console.log('caught the error', err);
                        //   });
                    }catch(err) {
                        console.log(err);
                    }
                // }
            }
        }
    }
}

module.exports.deleteAllData = (req, res, next) =>{
    console.log("delete")
    array = Object.assign({}, req.body.data);
    for(var k  in  array){
        for(var i in array[k]){
            for(var j in array[k][i]){
                // for(var l in array[k][i][j]){
                    var path = k+'/'+i+'/'+j;
                    var dta = '';
                    var typ = 'delete';
                    try {
                        crud_all(path, dta, typ, function(x){
                            console.log(x);
                            res.status(200).send('OK')
                            });
                        // dbRef.child(k+'/'+i+'/'+j).remove(function () {
                        //     console.log("data has been removed");
                        //     res.end();
                        //     return next();
                        // });
                    }catch(err) {
                        console.log(err);
                    }
                // }
            }
        }
    }
    // res.send({"message": "Success" });
}

