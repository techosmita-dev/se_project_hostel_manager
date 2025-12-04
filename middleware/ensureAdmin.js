module.exports = function ensureAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ error: "Admin privileges required to perform this action." });
  }
  return next();
};

