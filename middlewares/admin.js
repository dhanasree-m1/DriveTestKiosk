const isAdmin = (req,res,next)=>{

    if(req.session.isValid && loggedInType=='admin'){
        next()
    }
    else{
        console.log("You are not a Validated User !!!")
        res.redirect('/')
    }



}

export default isAdmin