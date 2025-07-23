import { throws } from "assert"

import user from "../models/user_model.js"
import appointments from "../models/appointment_model.js"
import bcrypt from 'bcrypt'
class Controller{
  static g2_get = async (req, res) => {
    if (loggedIn) {
        let exist_ap = '';
        const userid = loggedInId;
        
        // Fetch user details and appointments
        const user_from_db_to_edit = await user.findOne({ _id: userid });
        const user_appointment = await appointments.findOne({ user_id: userid, TestType: "G2" });

        if (user_appointment) {
            exist_ap = user_appointment;
            console.log("Appointment exists");
        } else {
            exist_ap = '';
            console.log("No appointment");
        }

        // Ensure we use the session message, and only fall back to welcome message if it's not available
        let message;
        if (req.session.message) {
            message = req.session.message; // Use the session message first
            delete req.session.message;    // Clear session message after it's used
        } else {
            message = `Welcome ${user_from_db_to_edit.first_name} ,`; // Fallback to the welcome message
        }

        console.log(`Message to display: ${message}`);
        
        // Render the g2_test page with the appropriate message
        res.render("g2_test.ejs", { user_data: user_from_db_to_edit, message: message, exist_ap: exist_ap });
    } else {
        res.redirect('/login');
    }
};
static g2_post = async (req, res) => {
  try {
      const form_data = req.body;
      const userid = req.params.user_id;
      let exist_ap = '';

      // Update user details
      const user_data = await user.findOne({ _id: userid });
      let licenseno;
      if (user_data.license === 'default' && form_data.license !== 'default') {
          licenseno = await bcrypt.hash(form_data.license, 10);
      } else {
          licenseno = user_data.license;
      }

      const updated_user_from_db = await user.findOneAndUpdate(
          { _id: userid },
          {
              first_name: form_data.first_name,
              last_name: form_data.last_name,
              age: form_data.age,
              dob: form_data.dob,
              license: licenseno,
              car_details: {
                  cmake: form_data.cmake,
                  cmodel: form_data.cmodel,
                  cyear: form_data.cyear,
                  cplatno: form_data.cplatno,
              },
          },
          { new: true }
      );

      console.log("Updated user:", updated_user_from_db);

      // Set success message and redirect
      req.session.message = "Details Updated Successfully";
      res.redirect('/g2_test');
  } catch (err) {
      res.send(`User Not Updated in Db: ${err}`);
  }
};

    static edit_g2user_get = async (req,res)=>{
        try {
            const userid = req.params.user_id;
        
            const user_from_db_to_edit = await user.findOne({ _id: userid });
        
            res.render("g2_test_edit.ejs", { user_data: user_from_db_to_edit });
          } catch (err) {
            res.send(`Not Found to Edit Employee \n${err}`);
          }

    }
    static edit_guser_post = async (req,res)=>{
      //Update car details only
        try {
            const userid = req.params.user_id_to_update;
            const user_data = await user.findOne({ _id: userid });
       
            const form_data = req.body;
            const updated_user_from_db = await user.findOneAndUpdate(
              { _id: userid },
              {
               
                car_details: {
                  cmake: form_data.cmake,
                  cmodel: form_data.cmodel,
                  cyear: form_data.cyear,
                  cplatno: form_data.cplatno,
                },
              },
              { new: true }
            );
        console.log(updated_user_from_db.car_details)
            // res.send(updated_user_from_db);
            req.session.message="Details Updated Successfully";
            //res.render("g_test.ejs", {user_data: updated_user_from_db, message:"Details Updated Successfully" });
        
             res.redirect('/g_test')
          } catch (err) {
            res.send(`User Not Updated in Db ${err}`);
          }
    }

}
export default Controller