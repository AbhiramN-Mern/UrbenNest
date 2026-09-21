const express=require('express')
const app=express()
const morgan = require('morgan');
// const router=require('express.router')
const path=require('path')
const env=require("dotenv").config()
const session=require('express-session')
const db =require('./config/db')
const userRouter=require('./routes/userRouter')
const adminRouter=require('./routes/adminRouter')
const User = require('./models/userSchema');
db()

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000
    }
}))

app.use(async (req, res, next) => {
    res.locals.user = null;
    res.locals.currentPage = 'default';
    if (req.session && req.session.user) {
        try {
            const userId = (typeof req.session.user === 'object' && req.session.user._id) 
                ? req.session.user._id 
                : req.session.user;
            const userData = await User.findById(userId).select('-password');
            if (userData && !userData.isBlocked) {
                res.locals.user = userData;
            } else if (userData && userData.isBlocked) {
                delete req.session.user;
                res.locals.user = null;
            }
        } catch (err) {
            console.error("Error setting res.locals.user:", err.message);
        }
    }
    next();
});

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.set('view engine','ejs')
app.set('views', [path.join(__dirname, 'views'),path.join(__dirname, 'views/admin'),path.join(__dirname, 'views/user')
]);
app.use(express.static(path.join(__dirname,'public')));
app.use('/user-assets', express.static(path.join(__dirname, 'public')));
app.use('/admin-assets', express.static(path.join(__dirname, 'public')));
app.use('/js/vendors', express.static(path.join(__dirname, 'public/js/vendor')));
app.use('/admin-assets/js/vendors', express.static(path.join(__dirname, 'public/js/vendor')));
app.use('/user-assets/js/vendors', express.static(path.join(__dirname, 'public/js/vendor')));
app.use('/assets/js/vendors', express.static(path.join(__dirname, 'public/js/vendor')));

app.use('/',userRouter)
app.use('/admin',adminRouter)

// app.use(morgan('dev', {
//     skip: function (req, res) {
//       return req.url.startsWith('/js') ||
//              req.url.startsWith('/css') ||
//              req.url.startsWith('/images') ||
//              req.url.startsWith('/user-assets') ||
//              req.url.startsWith('/assets') ||
//              req.url.endsWith('.ico') ||
//              req.url.endsWith('.png');
//     }
//   }));
  
app.use((req, res, next) => {
    res.status(404).render('page-404');
});

// Global Error Handler 
app.use((err, req, res, next) => {
    if (err.name === 'CastError') {
        return res.status(400).render('page-404', { 
            errorMessage: 'Invalid ID provided' 
        });
    }

    // Generic server error
    res.status(500).render('page-404', { 
        errorMessage: 'Something went wrong on the server' 
    });
});

app.listen(process.env.PORT,()=>console.log(`Server started at http://localhost:${process.env.PORT}`))

module.exports=app
