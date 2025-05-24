const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Vérification de la présence du token dans l'en-tête de la requête
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé' });
    }

    // Vérification de la validité du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_key');
    
    // Ajout des informations de l'utilisateur à la requête
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware; 