const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
function initialize(passport, getUserByEmail,getUserById){
    const authenticateUser = async (email,password,done)=>{
        const user = await getUserByEmail(email);
        if(user == null)
        {
            return done(null,false,{message:'No user with that email'})
        }
        try {
            const match = await bcrypt.compare(password,user.password)
            console.log(match)
            if(match)
            {
                return done(null,user);
            } else {
                return done(null,false,{message:'Email or password is incorrect'})
            }
        }
        catch(e)
        {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({usernameField:'email'},authenticateUser))
    passport.serializeUser((user,done)=>{
        return done(null,user._id)
        }
    )
    passport.deserializeUser(async(id,done)=>{
        let user = await getUserById(id);
        return done(null,user)
    })
}
module.exports = initialize