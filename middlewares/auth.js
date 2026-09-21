const User = require('../models/userSchema');

const userAuth = async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        const userId = (typeof req.session.user === 'object' && req.session.user._id)
            ? req.session.user._id
            : req.session.user;
        const user = await User.findById(userId);
        if (!user || user.isBlocked) {
            delete req.session.user;
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        console.error('Error in userAuth middleware:', error);
        res.redirect('/login');
    }
};

const guestAuth = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

const adminAuth = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    next();
};

module.exports = {
    userAuth,
    guestAuth,
    adminAuth
};