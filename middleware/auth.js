// public/middleware/auth.js
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // user is logged in
  }
  res.redirect('/'); // redirect to login page if not logged in
}

module.exports = requireLogin;