import user from "../models/user_model.js"
import userModel from "../models/user_model.js"
import appointments from "../models/appointment_model.js"
import bcrypt from 'bcrypt'
class Controller{
    static g_get = async(req,res)=>{
      if(loggedIn){
        let exist_ap=''
        const userid = loggedInId;
        const user_from_db_to_edit = await user.findOne({ _id: userid });
        const user_appointment = await appointments.findOne({ user_id: userid });
        if(user_appointment){
          const existing_appointment = await appointments.findOne({ user_id: userid,TestType:'G' });
          exist_ap=existing_appointment;
          console.log("have appointment")
        }else{
          exist_ap=""
          console.log("no appointment")
        }


        const existing_usr = await user.findOne({_id:req.session.user_id})
        const message= `Welcome ${existing_usr.first_name},`
        // let message=""
        // if(req.session.message){
        //    message= `Welcome ${user_from_db_to_edit.first_name} , ${req.session.message}`

        // }else{
        //    message= `Welcome ${existing_usr.first_name},`
        // }
        
        delete req.session.message
        res.render("g_test.ejs", {user_data: existing_usr,message:message,exist_ap:exist_ap });
      }else{
        res.render("g_test.ejs", {user_data: null,message:'' });

      }
        
       

        
    }
    static home = (req,res)=>{
       // res.render("index.ejs",{message:""});
        res.render("dashboard.ejs");
       // res.render('/')
       
        
    }
    static search_post = async (req,res)=>{
        try {
           // const license = req.body.license_no;
            const license=await bcrypt.hash(req.body.license_no,10)
            const pwd_match = await bcrypt.compare(req.body.license_no,existing_usr.pwd)
           console.log(license);
            const user_data_from_db = await userModel.findOne({ license: license });
            console.log(user_data_from_db);
            if (user_data_from_db != null) {
              res.render("g_test.ejs", { user_data: user_data_from_db ,message:""});
            } else {
              res.render("g_test.ejs", { user_data: 1,message:"" });
            }
        
            // res.send(user_data_from_db)
          } catch (err) {
            console.log(`User not found n DB\n${err}`);
          }
    }
}
export default Controller