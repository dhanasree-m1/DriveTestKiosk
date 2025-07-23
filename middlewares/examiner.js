const isExaminer = (req,res,next)=>{

    if(req.session.isValid && loggedInType=='examiner'){
        next()
    }
    else{
        console.log("You are not a Validated User !!!")
        res.redirect('/')
    }



}

export default isExaminer