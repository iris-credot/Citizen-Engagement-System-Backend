const checkSuperAdmin = (req, res, next) => {
    if (req.role !== 'super-admin') {
      return res.status(403).json({ message: 'Forbidden: Only super-admins can create admin users' });
    }
    next();
  };
  module.exports=checkSuperAdmin;