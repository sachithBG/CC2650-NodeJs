var userSchema = {
    uid:{
        type:String
    },
    email: {
        type:String
    },
    emailVerified: {
        type:Boolean
    },
    displayName: {
        type:String
    }
};
users = [];
module.exports = {userSchema, users};