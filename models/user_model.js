import mongoose from "mongoose";

const uri="mongodb+srv://dhanasree01:Mongo123@cluster0.umw1frd.mongodb.net/Drive_Test?retryWrites=true&w=majority"
mongoose.connect(uri).then(()=>console.log("Connected to Mongodb Successfully !!"))
.catch((err)=>{console.log(`Connection Failed due to the Error below...\n${err}`)})

const user_schema = mongoose.Schema({
    email : {type:String,required:true},
    type : {type:String,required:true},
    pwd : {type:String,required:true},
    first_name : {type:String,default:'default'},
    last_name : {type:String,default:'default'},
    age : {type:Number, default:0},
    license :{type:String,default:'default'},
    dob : {type:String,default:'default'},
    appointment_id:{type:String,default:''},

    car_details:{
        cmake: {type:String,default:'default'},
        cmodel: {type:String,default:'default'},
        cyear: {type:Number,default:0},
        cplatno: {type:String,default:'default'}

    },

})

const user_model = mongoose.model('users',user_schema)
export default user_model
