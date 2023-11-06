module.exports = {
    enforceAuthentication: function (req,res,next){
        if(req.isAuthenticated()==false)
        {
           res.redirect('/auth/login')
        }
        next();
    },
    forwardAuthentication: function (req,res,next){
        if(req.isAuthenticated())
        {
            res.redirect('/')
        }
        next()
    }
}