module.exports = {
    enforceAuthentication: function (req,res,next){
        if(req.isAuthenticated())
        {
          return next()
        }
        res.redirect('/auth/login')
    },
    forwardAuthentication: function (req,res,next){
        if(req.isAuthenticated())
        {
            res.redirect('/')
        }
         next()
    }
}