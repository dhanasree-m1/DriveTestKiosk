import mongoose from "mongoose";

const uri="mongodb+srv://dhanasree01:Mongo123@cluster0.umw1frd.mongodb.net/Drive_Test?retryWrites=true&w=majority"
mongoose.connect(uri).then(()=>console.log("Connected to Mongodb Successfully !!"))
.catch((err)=>{console.log(`Connection Failed due to the Error below...\n${err}`)})

const appointment_schema = mongoose.Schema({
    Date:{type:String,required:true},
    Time : {type:String,required:true},
    isTimeSlotAvailable : {type:Boolean,required:true},
    TestType:{type:String,default:''},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users',default:null },
    status:{type:Boolean,default:null},
    comment:{type:String,default:''}

})


const appointment_model = mongoose.model('appointment',appointment_schema)
export default appointment_model
