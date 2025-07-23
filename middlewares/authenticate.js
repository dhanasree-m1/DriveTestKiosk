const isAuthenticUser = (req,res,next)=>{

    if(req.session.isValid && loggedInType=='driver'){
        next()
    }
    else{
        console.log("You are not a Validated User !!!")
        res.redirect('/')
    }



}

export default isAuthenticUser