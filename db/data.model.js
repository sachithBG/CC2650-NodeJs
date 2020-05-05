var dataSchema = {
    name:{
        type:String,
        required: 'Full name can\'t be empty'
    },
    email:{
        type:String,
        required: 'Email can\'t be empty',
        unique:true
    },
    password:{
        type:String
    }
};

module.exports = dataSchema;