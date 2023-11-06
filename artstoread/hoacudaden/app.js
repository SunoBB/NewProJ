if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
var flash = require('express-flash')
const bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var productRouter = require('./routes/product');
var uploadRouter = require('./routes/upload');
var billRouter = require('./routes/bill');
var cateRouter= require('./routes/category');
var authMiddleware = require('./middleware/auth');
const admin = require('./models/admin')
const initializePassport = require('./passport-config')
var app = express();
var db = require('./models/db');
initializePassport(passport,
  async function (email){
      let user = await admin.findOne({email:email}).exec();return user;},
  async function (id){
      let user = await admin.findById(id).exec();
      return user;
  })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//use express ejs layouts
app.disable('view cache')
app.use(bodyParser.json({limit: '10mb', extended: true})) ;
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize());

app.use(passport.session());


app.use(expressLayouts);
//Set default layout
app.set('layout','./layouts/layout');
app.use('/auth',authRouter);
app.use('/', authMiddleware.enforceAuthentication,indexRouter);
app.use('/users', authMiddleware.enforceAuthentication, usersRouter);
app.use('/product', authMiddleware.enforceAuthentication,productRouter);
app.use('/upload', authMiddleware.enforceAuthentication,uploadRouter);
app.use('/bill', authMiddleware.enforceAuthentication,billRouter);
app.use('/cate', authMiddleware.enforceAuthentication,cateRouter);
// app.use('/upload',uploadRouter)
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
