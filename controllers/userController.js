import { throws } from "assert"

import user from "../models/user_model.js"

import bcrypt from 'bcrypt'

class Controller{

    static signup_get = (req,res)=>{


        // console.log(req.session)

     //   req.session.isValid = true

     //   req.session.user_name = "Rock"

        // console.log(req.session)

         console.log(req.session.id)

        res.render('signup.ejs',{message:""})
    }


    static signup_post = async (req,res)=>{

        


        try{

            const form_data = req.body
       
            console.log(form_data)
 
         //   res.send(form_data)
 
              const existing_usr = await user.findOne({email:form_data.usr_email})
 
              if(!existing_usr){
                if(form_data.usr_pwd===form_data.rpt_usr_pwd){
                    const hashed_pwd = await bcrypt.hash(form_data.usr_pwd,10)
     
                  const user_to_save = new user({
                     
                    //  name : form_data.usr_name,
                     email : form_data.usr_email,
                     type:form_data.type,
                     pwd : hashed_pwd
     
                  })
     
                  const usr_saved = await user_to_save.save()
                  req.session.message="User Created successfully"
                  res.redirect('/login')
                  //res.render('login.ejs',{message:"User Created successfully"})
    
                  }else{
                    req.session.message="Password does not match"
                    res.redirect('/signup')
                     //res.render('signup.ejs',{message:"Password does not match"})
                    //console.log("Password does not match")
                  }
               
              }else{
                req.session.message="Existing User. Please Login"
                    res.redirect('/login')
                
                //res.render('login.ejs',{message:"Existing User. Please Login"})

              }
              
              
 
            //  res.send(usr_saved)
 
            
 



        }
        catch(err){
            console.log(err)
            res.send(err)
        }

    }

    static login_get = (req,res)=>{
        if(!loggedIn){
            const message= req.session.message
            delete req.session.message
            res.render('login.ejs',{message:message})

        }else{
            if( req.session.user_type=="driver"){
                res.redirect('/g2_test')

            }else if(req.session.user_type=="admin"){
                res.redirect("/appointment")
            }else{
                res.redirect("/examiner")
            }
        }

       
    }

    static login_post = async (req, res) => {
        try {
            const form_data = req.body;

            // Check if the user exists
            const existing_usr = await user.findOne({ email: form_data.usr_email });
            if (existing_usr) {
                // Compare the password with hashed password
                const pwd_match = await bcrypt.compare(form_data.usr_pwd, existing_usr.pwd);

                if (pwd_match) {
                    // Set session variables for logged-in user
                    req.session.isValid = true;
                    req.session.user_id = existing_usr._id;
                    req.session.user_type = existing_usr.type;

                    console.log(req.session);

                    // Set a session message to be displayed after redirection
                    req.session.message = `Welcome ${existing_usr.email}`;

                    // Redirect based on user type
                    if (existing_usr.type === "driver") {
                        return res.redirect('/g2_test');
                    } else if (existing_usr.type === "admin") {
                        return res.redirect("/appointment");
                    } else {
                        return res.redirect("/examiner");
                    }
                } else {
                    // Invalid password case
                    res.render('login.ejs', { message: "Invalid Username/Password" });
                }
            } else {
                // User doesn't exist, redirect to signup page
                res.render('signup.ejs', { message: "Not an existing user. Please Sign Up" });
            }
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }


    static dashboard_get = (req,res)=>{
        const message= req.session.message
        delete req.session.message

        res.render('dashboard.ejs')
    }
    static home_get = (req,res)=>{

        //res.render('home.ejs')
    }

    static logout_post = (req,res)=>{

        req.session.destroy((err)=>{
            
            loggedIn=''
            loggedInType=''
            loggedInId=''
            if (err) throw err
           const message ="Logged Out Successfully";                  
            res.render('login.ejs',{message:message})
        })
    }

}

export default Controller