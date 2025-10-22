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

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email - Mailtrap (Développement)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=votre_username_mailtrap
MAILTRAP_PASS=votre_password_mailtrap

# Email - SMTP Production (optionnel)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=apikey
# SMTP_PASS=votre_api_key_sendgrid

# Email - Informations
EMAIL_FROM="Sanoki Studios <noreply@sanokistudios.com>"
ADMIN_EMAIL=admin@sanokistudios.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

