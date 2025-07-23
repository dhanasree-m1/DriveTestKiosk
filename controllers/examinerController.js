import { throws } from "assert"

import appointments from "../models/appointment_model.js"
import user from "../models/user_model.js"
class Controller{
    static examiner_get =  async(req,res)=>{
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
         res.render("examiner.ejs",{message:message,existingAppointments:appointments});       
        
        
    }

   

    static fetchAppointmentType = async (req,res)=>{
        const { ttype } = req.body; 
        if (!ttype) {
            req.session.message="Please select a Type"
            res.redirect('/examiner')
        }
        try {
            
           // const existingAppointments = await appointments.find({ TestType: ttype });
           if(ttype=="all"){
            await appointments.find({ user_id: { $ne: null } })
           .populate('user_id')
           .then(appointments => {
            console.log(appointments)
             res.json({existingAppointments:appointments}); 
           })
           .catch(err => {
             console.error(err);
           });
           }
           if(ttype=="G" ||ttype=="G2"){
            const existingAppointments =  await appointments.find({ TestType: ttype })
           .populate('user_id')
           .then(appointments => {
            console.log(appointments)
             res.json({existingAppointments:appointments}); 
           })
           .catch(err => {
             console.error(err);
           });

           } 
     
           
           
           
        } catch (err) {
            console.error('Error fetching booked appointments:', err);
           
        }


    }

static viewAppointment = async(req,res) =>{

    try {
        const ap_id = req.params.ap_id;
    
        await appointments.findOne({ _id: ap_id })
        .populate('user_id')
        .then(appointments => {
         console.log(appointments)
         res.render("viewAppointment.ejs", { data: appointments });
          
        })
        .catch(err => {
          console.error(err);
        });
    
        
      } catch (err) {
        res.send(`Not Found to Edit Employee \n${err}`);
      }
  

}

static updateAppointment = async(req,res)=>{
    const form_data = req.body; 
    const ap_id = req.params.ap_id;
    if (!form_data.status && !form_data.comment) {
        req.session.message="Please select a status and enter comments"
        //res.redirect('/g2_test')
    }
    try {
        // Find existing appointments for the selected date
        const existingAppointments = await appointments.findOne({ _id:ap_id});
         if(existingAppointments){
            console.log(existingAppointments)
            
            const existing_ap = await appointments.findOne({_id:ap_id})
             const updated_appointment = await appointments.findOneAndUpdate(
                { _id: ap_id },
                {
                status:form_data.status,
                comment:form_data.comment
                },
                { new: true }
              );
              
              req.session.message="Appointment Updated Successfully"
           res.redirect('/examiner')

         }else{
            req.session.message="Something went wrong"
           res.redirect('/examiner')
         }
        
     
    } catch (err) {
        console.error('Error updating appointments:', err);
        
    }

}

}
export default Controller