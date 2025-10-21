const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe requis' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'user'
    });

    // Générer le token
    const token = generateToken(user._id);

    // Envoyer email de bienvenue (optionnel)
    try {
      await sendEmail({
        to: user.email,
        subject: 'Bienvenue sur notre boutique !',
        text: `Bonjour ${user.name},\n\nMerci de vous être inscrit sur notre boutique de t-shirts tunisienne !\n\nVous pouvez maintenant passer vos commandes et profiter du chat en direct.\n\nÀ bientôt !`,
        html: `<p>Bonjour <strong>${user.name}</strong>,</p>
               <p>Merci de vous être inscrit sur notre boutique de t-shirts tunisienne !</p>
               <p>Vous pouvez maintenant passer vos commandes et profiter du chat en direct.</p>
               <p>À bientôt !</p>`
      });
    } catch (emailError) {
      console.error('Erreur envoi email bienvenue:', emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Connexion utilisateur/admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Déconnexion
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  // Avec JWT stateless, la déconnexion se fait côté client (supprimer le token)
  // Cette route existe surtout pour la cohérence de l'API
  res.json({ success: true, message: 'Déconnexion réussie' });
};

// @desc    Obtenir l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour le profil
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (addresses) user.addresses = addresses;
    
    await user.save();
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Demander un reset de mot de passe
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // Pour des raisons de sécurité, on renvoie le même message
      return res.json({ 
        success: true, 
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation' 
      });
    }
    
    // Générer le token de reset
    const resetToken = user.generateResetPasswordToken();
    await user.save();
    
    // URL de reset (frontend)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // Envoyer l'email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Réinitialisation de mot de passe',
        text: `Bonjour ${user.name},\n\nVous avez demandé à réinitialiser votre mot de passe.\n\nCliquez sur ce lien (valable 1 heure) :\n${resetUrl}\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`,
        html: `<p>Bonjour <strong>${user.name}</strong>,</p>
               <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
               <p><a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Réinitialiser mon mot de passe</a></p>
               <p><small>Ce lien est valable 1 heure.</small></p>
               <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>`
      });
      
      res.json({ 
        success: true, 
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation' 
      });
    } catch (emailError) {
      console.error('Erreur envoi email reset:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
    }
  } catch (error) {
    console.error('Erreur forgot password:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Réinitialiser le mot de passe
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    
    if (!password) {
      return res.status(400).json({ message: 'Mot de passe requis' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }
    
    // Hasher le token reçu pour le comparer
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Trouver l'utilisateur avec ce token et vérifier l'expiration
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }
    
    // Mettre à jour le mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    // Envoyer email de confirmation
    try {
      await sendEmail({
        to: user.email,
        subject: 'Mot de passe modifié',
        text: `Bonjour ${user.name},\n\nVotre mot de passe a été modifié avec succès.\n\nSi vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement.`,
        html: `<p>Bonjour <strong>${user.name}</strong>,</p>
               <p>Votre mot de passe a été modifié avec succès.</p>
               <p>Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement.</p>`
      });
    } catch (emailError) {
      console.error('Erreur envoi email confirmation reset:', emailError);
    }
    
    // Générer un nouveau token de connexion
    const authToken = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur reset password:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Créer un admin (à protéger en production!)
// @route   POST /api/auth/create-admin
// @access  Public (À SÉCURISER !)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe requis' });
    }

    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
