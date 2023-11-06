if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var flash = require('express-flash');
var session = require('express-session');
var passport = require('passport');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var authRouter = require('./routes/auth');
var cartRouter = require('./routes/cart')
var collectionsRouter = require('./routes/collections');
var productRouter = require('./routes/products');
var checkoutRouter = require('./routes/checkout');
var searchRouter = require('./routes/search');
var app = express();
var db = require('./models/db');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//use express ejs layouts
app.disable('view cache')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressLayouts);

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize());

app.use(passport.session());


//Use middlewares
var getHeaderData = require('./middlewares/utility').getHeaderData;
var getCategories = require('./middlewares/utility').getCategories;
var getBrands = require('./middlewares/utility').getBrands;
var getCart = require('./middlewares/utility').getCartDisplay;
var authMiddleware = require('./middlewares/auth')
//Check if authenticated
app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();
  next();
})
//Get header data for each view
app.use(getHeaderData);
app.use(getCart);

app.use('/', indexRouter);
app.use('/user',authMiddleware.enforceAuthentication ,userRouter);
app.use('/auth',authRouter);
app.use('/cart',cartRouter);
app.use('/collections',getCategories,getBrands,collectionsRouter);
app.use('/products',productRouter);
app.use('/checkout',checkoutRouter);
app.use('/search',searchRouter)
app.get('/huongdan',(req,res)=>{
  res.render('shoppingguide')
})

app.get('/lien-he',(req,res)=>{
  res.render('publisher');
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error',{layout:false});
});

module.exports = app;
