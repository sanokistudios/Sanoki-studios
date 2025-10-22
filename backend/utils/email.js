const nodemailer = require('nodemailer');

// Configuration du transporteur Nodemailer
const createTransporter = () => {
  // En développement : Mailtrap
  if (process.env.NODE_ENV !== 'production' || process.env.MAILTRAP_USER) {
    return nodemailer.createTransporter({
      host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.MAILTRAP_PORT || 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }
  
  // En production : SMTP réel (à configurer plus tard)
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Envoyer un email
 * @param {Object} options - Options de l'email
 * @param {string} options.to - Destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.text - Version texte
 * @param {string} options.html - Version HTML
 */
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Boutique T-shirts" <noreply@example.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email envoyé:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
};

/**
 * Envoyer un email de commande au client
 */
exports.sendOrderConfirmation = async (order) => {
  const itemsList = order.items
    .map(item => `- ${item.name} (Taille: ${item.size || 'N/A'}) x ${item.quantity} = ${item.price * item.quantity} TND`)
    .join('\n');
  
  const subject = `Confirmation de commande #${order.orderNumber}`;
  
  const text = `Bonjour ${order.customer.name},

Votre commande a bien été enregistrée !

Numéro de commande : ${order.orderNumber}
Date : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}

ARTICLES :
${itemsList}

TOTAL : ${order.totalAmount} TND

LIVRAISON :
${order.customer.address.line1}
${order.customer.address.line2 || ''}
${order.customer.address.city}, ${order.customer.address.governorate}
${order.customer.address.postalCode || ''}

PAIEMENT : À la livraison (Cash on Delivery)

Votre commande sera expédiée sous 2-3 jours ouvrés.

Merci de votre confiance !`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #000; margin: 0;">Sanoki Studios</h1>
        <p style="color: #666; margin: 5px 0 0;">Confirmation de commande</p>
      </div>
      
      <p>Bonjour <strong>${order.customer.name}</strong>,</p>
      <p>Votre commande a bien été enregistrée ! 🎉</p>
      
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr style="background: #f3f4f6;">
          <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Numéro de commande</strong></td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Date</strong></td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Statut</strong></td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">En attente de traitement</td>
        </tr>
      </table>
      
      <h3 style="color: #000; margin-top: 30px;">Articles commandés</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Produit</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb;">Taille</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb;">Qté</th>
            <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${item.size || 'N/A'}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">${(item.price * item.quantity).toFixed(3)} TND</td>
            </tr>
          `).join('')}
          <tr style="background: #f3f4f6;">
            <td colspan="3" style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;"><strong>TOTAL</strong></td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;"><strong>${order.totalAmount.toFixed(3)} TND</strong></td>
          </tr>
        </tbody>
      </table>
      
      <h3 style="color: #000; margin-top: 30px;">Adresse de livraison</h3>
      <div style="background: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
        <p style="margin: 5px 0;">
          <strong>${order.customer.name} ${order.customer.surname || ''}</strong><br>
          ${order.customer.phone}<br>
          ${order.customer.address.line1}<br>
          ${order.customer.address.line2 ? order.customer.address.line2 + '<br>' : ''}
          ${order.customer.address.city}, ${order.customer.address.governorate}<br>
          ${order.customer.address.postalCode || ''} ${order.customer.address.country || 'Tunisie'}
        </p>
      </div>
      
      <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <strong style="color: #1e40af;">💰 Paiement à la livraison (Cash on Delivery)</strong>
        <p style="margin: 5px 0 0; color: #1e40af;">Vous paierez en espèces lors de la réception de votre colis.</p>
      </div>
      
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <strong style="color: #166534;">🚚 Livraison</strong>
        <p style="margin: 5px 0 0; color: #166534;">Votre commande sera expédiée sous <strong>2-3 jours ouvrés</strong>.</p>
      </div>
      
      ${order.notes ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <strong style="color: #92400e;">📝 Note</strong>
          <p style="margin: 5px 0 0; color: #92400e;">${order.notes}</p>
        </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #666; font-size: 14px;">Merci de votre confiance ! ❤️</p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Sanoki Studios - Vêtements modernes tunisiens<br>
          Tunis, Tunisie
        </p>
      </div>
    </div>
  `;
  
  return exports.sendEmail({
    to: order.customer.email,
    subject,
    text,
    html
  });
};

/**
 * Envoyer un email de contact à l'admin
 */
exports.sendContactNotification = async (contact) => {
  const subject = `Nouveau message de ${contact.name} ${contact.surname}`;
  
  const text = `Nouveau message de contact :

Nom : ${contact.name} ${contact.surname}
Email : ${contact.email}
Message :
${contact.message}

Date : ${new Date(contact.createdAt).toLocaleDateString('fr-FR')} ${new Date(contact.createdAt).toLocaleTimeString('fr-FR')}`;

  const html = `
    <h2>Nouveau message de contact</h2>
    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f3f4f6;"><strong>Nom</strong></td>
        <td style="padding: 10px; border: 1px solid #e5e7eb;">${contact.name} ${contact.surname}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f3f4f6;"><strong>Email</strong></td>
        <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="mailto:${contact.email}">${contact.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f3f4f6;"><strong>Date</strong></td>
        <td style="padding: 10px; border: 1px solid #e5e7eb;">${new Date(contact.createdAt).toLocaleDateString('fr-FR')} ${new Date(contact.createdAt).toLocaleTimeString('fr-FR')}</td>
      </tr>
    </table>
    
    <h3>Message :</h3>
    <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
${contact.message}
    </div>
    
    <p style="margin-top: 20px;">
      <a href="mailto:${contact.email}?subject=Re: Votre message" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Répondre par email</a>
    </p>
  `;
  
  return exports.sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject,
    text,
    html
  });
};

