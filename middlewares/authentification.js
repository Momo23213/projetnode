const jwt = require('jsonwebtoken');
      
      const User = require('../models/user.models');

// middleware/withRole.js
exports.verifit = (requiredRole)=> {
  return async (req, res, next) => {
    const token = req.cookies.accessToken     /* reqs.header('Authorization').split(" ")[1];*/
    if (!token) return res.status(401).json({ message: 'Token requis.' });

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(401).json({ message: 'Utilisateur introuvable.' });
       if(requiredRole !==" "){
         if (user.role !== requiredRole) {
        return res.status(403).json({ message: `Accès ${requiredRole} requis.` });
         }
       }
     
      req.user = user;
      next();
    } catch (err) {
      res.status(400).json({ message: 'Token invalide.' });
    }
  };
};
