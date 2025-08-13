const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const Task = require("../models/taches.models");

// Fonction pour générer les tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member'
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
   try {
    const { email, password } = req.body; // req.body.email

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Email ou mot de passe invalide.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe invalide.' });

    const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie('accessToken', accessToken, {
    httpOnly: false,
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000 // 15 min
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: false,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
  });


    // 🔽 On récupère les tâches assignées à cet utilisateur
    const tasks = await Task.find({ assignedTo: user._id })
      .populate('createdBy', 'name email')
      // .populate('assignedTo', 'name email');
      
       let taches
        if(tasks==""){
           taches=`vous n'avez aucune tâche a effectué ${user.name} alors profiter bien du moment`
        }else{
            taches=tasks
        }

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tâches:taches  // 🔥 On renvoie directement les tâches assignées
    });



  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginget = async (req, res) => {
   try {
    const  email="fode2561@gmail.com", password="22222"

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Email ou mot de passe invalide.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe invalide.' });

    const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie('accessToken', accessToken, {
    httpOnly: false,
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000 // 15 min
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: false,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
  });


    // 🔽 On récupère les tâches assignées à cet utilisateur
    const tasks = await Task.find({ assignedTo: user._id })
      .populate('createdBy', 'name email')
      // .populate('assignedTo', 'name email');
      
       let taches
        if(tasks==""){
           taches=`vous n'avez aucune tâche a effectué ${user.name} alors profiter bien du moment`
        }else{
            taches=tasks
        }

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tâches:taches  // 🔥 On renvoie directement les tâches assignées
    });



  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken=async (req, res) =>{
    const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Aucun refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.id);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: 'Token renouvelé' });
  } catch (err) {
    return res.status(403).json({ message: 'Refresh token invalide ou expiré' });
  }
}

exports.logout= async (req,res)=>{
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'Strict'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'Strict'
  });

  res.status(200).json({ message: 'Déconnecté avec succès' });
}
exports.logoute= async (req,res)=>{
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'Strict'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'Strict'
  });

  res.status(200).json({ message: 'Déconnecté avec succès' });
}

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;    // page actuelle (par défaut 1)
    const limit = parseInt(req.query.limit) || 5;  // nb User par page (par défaut 5)
    const skip = (page - 1) * limit;

    const totalBooks = await User.countDocuments();
    const books = await User.find().skip(skip).limit(limit);

    res.json({
      page,
      limit,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      books,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }

};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


