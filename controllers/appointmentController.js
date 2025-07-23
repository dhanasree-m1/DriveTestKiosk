import { throws } from "assert"
import mongoose from "mongoose"
import appointments from "../models/appointment_model.js"
import user from "../models/user_model.js"
class Controller{
    static appointment_get =  (req,res)=>{
           
        const message= req.session.message
        delete req.session.message
        res.render("appointment.ejs",{message:message});       
        
        
    }
//Admin appointment creation
    static appointment_post = async (req,res)=>{

        try {
                 
            const form_data = req.body;
                     
             if(  Array.isArray(form_data.timeslots)){
                for (const timeslot of form_data.timeslots) {
                    const appointment = new appointments({
                    Date: form_data.date,
                    Time: timeslot,
                    isTimeSlotAvailable:true
                });
                const data_saved =  await appointment.save();
            }

             }else{
                const appointment = new appointments({
                    Date: form_data.date,
                    Time: form_data.timeslots,
                    isTimeSlotAvailable:true
                });
                const data_saved =  await appointment.save();

             }
               //console.log(timeslot)
             
       
           req.session.message="Appointment(s) Created"
           res.redirect('/appointment')
          
          } catch (err) {
            res.send(`Appointment Not Saved in Db ${err}`);
          }
           
      
            
        
        
    }

    static getAvailableTimeSlots = async (req,res)=>{
        const { date } = req.body; 
        if (!date) {
            req.session.message="Please select a Date"
            res.redirect('/appointment')
        }
        try {
            
            const existingAppointments = await appointments.find({ Date: date });
             console.log(existingAppointments)        
            const occupiedTimeSlots = existingAppointments.map(appointment => appointment.Time);
            const allTimeSlots = [
                "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
                "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
                "1:00 PM", "1:30 PM", "2:00 PM"
            ];
    
             const availableTimeSlots = allTimeSlots.filter(timeSlot => !occupiedTimeSlots.includes(timeSlot));
    //res.json(existingAppointments,availableTimeSlots)
            res.json({availableTimeSlots:availableTimeSlots,occupiedTimeSlots:occupiedTimeSlots}); 
        } catch (err) {
            console.error('Error fetching available time slots:', err);
           
        }


    }
static getAvailableTimeSlotsForDrivers = async(req,res) =>{
    const { date } = req.body; 
        if (!date) {
            req.session.message="Please select a Date"
            res.redirect('/appointment')
        }
        try {
          console.log("inside")
            const existingAppointments = await appointments.find({ Date: date,isTimeSlotAvailable:true });
             console.log(existingAppointments)
             const occupiedTimeSlots = existingAppointments.map(appointment => appointment.Time);
    
            res.json(occupiedTimeSlots); 
        } catch (err) {
            console.log('Error fetching available time slots for drivers:', err);
            
        }

}
//G2 booking by driver
static appointmentBookDriver = async(req,res)=>{
    const form_data = req.body; 
    if (!form_data.date || !form_data.timeslots) {
        req.session.message="Please select a Date and time"
        res.redirect('/g2_test')
    }
    try {
        // Find existing appointments for the selected date
        const existingAppointments = await appointments.find({ Date: form_data.date ,Time:form_data.timeslots});
         if(existingAppointments){
            console.log(existingAppointments)
            const appointment_id=existingAppointments[0]._id;
            const existing_ap = await appointments.findOne({_id:appointment_id})
            //console.log("hiiii")
            console.log(existing_ap._id)
             //update user  appointment id 
            const updated_user_from_db = await user.findOneAndUpdate(
                { _id: loggedInId },
                {
                appointment_id:existing_ap._id,
                // TestType:"G2"
                },
                { new: true }
              );
              //update availability of appointment slot as false
              const updated_appintment_from_db = await appointments.findOneAndUpdate(
                { _id: existing_ap._id },
                {
                    
                    isTimeSlotAvailable:false,
                    TestType:"G2",
                    user_id: new mongoose.Types.ObjectId(loggedInId)
                },
                { new: true }
              );
              req.session.message="G2 Test Booked Successfully"
           res.redirect('/g2_test')

         }else{
            req.session.message="Something went wrong"
           res.redirect('/g2_test')
         }
        
     
    } catch (err) {
        console.error('Error booking G2 test drivers:', err);
        
    }

}
//G booking by driver
static appointmentBookDriverGTest = async(req,res)=>{
    const form_data = req.body; 
    if (!form_data.date && !form_data.timeslots) {
        req.session.message="Please select a Date and time"
        res.redirect('/g_test')
    }
    try {
        // Find existing appointments for the selected date
        const existingAppointments = await appointments.find({ Date: form_data.date ,Time:form_data.timeslots});
         if(existingAppointments){
            console.log(existingAppointments)
            const appointment_id=existingAppointments[0]._id;
            const existing_ap = await appointments.findOne({_id:appointment_id})
            
            console.log(existing_ap._id)
             //update user  appointment id 
            const updated_user_from_db = await user.findOneAndUpdate(
                { _id: loggedInId },
                {
                appointment_id:existing_ap._id,
                //TestType:"G"
                },
                { new: true }
              );
              //update availability of appointment slot as false
              const updated_appintment_from_db = await appointments.findOneAndUpdate(
                { _id: existing_ap._id },
                {
                    isTimeSlotAvailable:false,
                    TestType:"G",
                    user_id: new mongoose.Types.ObjectId(loggedInId)
                },
                { new: true }
              );
              req.session.message="G Test slot Booked Successfully"
           res.redirect('/g_test')

         }else{
            req.session.message="Something went wrong"
           res.redirect('/g_test')
         }
        
     
    } catch (err) {
        console.error('Error booking G test time slots for drivers:', err);
        
    }

}
static getAllexams= async(req,res)=>{
    const existingAppointments =  await appointments.find({ user_id: { $ne: null } })
    .populate('user_id')
    .then(appointments => {
        console.log("========")
     console.log(appointments)
     // res.json({existingAppointments:appointments}); 
    })
    .catch(err => {
      console.error(err);
    });
    const message= req.session.message
    delete req.session.message
     res.render("allexams.ejs",{message:message,existingAppointments:appointments}); 

}

}
export default Controller