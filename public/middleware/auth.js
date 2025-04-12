export function isLoggedIn(req, res, next) {
  if (req.session?.user) {
    next();
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
}
