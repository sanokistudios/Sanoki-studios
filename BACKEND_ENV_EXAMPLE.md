# ===================================
# BACKEND - Configuration (.env dans /backend)
# ===================================

# Serveur
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-vetements?retryWrites=true&w=majority

# JWT
JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe
JWT_REFRESH_SECRET=votre_cle_refresh_secrete_tres_longue_et_complexe
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Cloudinary - Remplacez par vos VRAIES valeurs
CLOUDINARY_CLOUD_NAME=remplacer_par_votre_cloud_name
CLOUDINARY_API_KEY=remplacer_par_votre_api_key
CLOUDINARY_API_SECRET=remplacer_par_votre_api_secret

# Email - Mailtrap (Développement) - Remplacez par vos VRAIES valeurs
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=remplacer_par_votre_username
MAILTRAP_PASS=remplacer_par_votre_password

# Email - SMTP Production (optionnel) - Remplacez par vos VRAIES valeurs
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=apikey
# SMTP_PASS=remplacer_par_votre_api_key_sendgrid

# Email - Informations
EMAIL_FROM="Sanoki Studios <noreply@sanokistudios.com>"
ADMIN_EMAIL=admin@sanokistudios.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

