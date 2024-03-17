const User = require("../models/user");

 

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs')
}

module.exports.userSignup = async(req,res)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(error)=>{
            if(error){
                return next(error);
            }
            req.flash("success", "Welcome to Wanderlust");
        res.redirect('/listings');
        })
        
    } catch (error) {
         req.flash("error", error.message);
         res.redirect('/signup');
    }
}

module.exports.userLogout = (req,res, next)=>{
    req.logout((error)=>{
        if(error){
           return next(error);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
}

module.exports.userLogin = async (req,res)=>{
    req.flash("success","Welcome, you are logged in...");
    res.redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(res.redirectUrl);
    
}
