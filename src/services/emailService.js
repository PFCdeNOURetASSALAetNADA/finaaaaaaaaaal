const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function to send verification email
const sendVerificationEmail = async (to, verificationCode) => {
  const subject = 'Verification de votre compte';
  const text = `Votre code de vérification est: ${verificationCode}`;
  const html = `
    <h1>Bienvenue!</h1>
    <p>Votre code de vérification est: <strong>${verificationCode}</strong></p>
    <p>Utilisez ce code pour vérifier votre compte.</p>
  `;

  return sendEmail(to, subject, text, html);
};

// Function to send reclamation status update email
const sendReclamationStatusEmail = async (to, reclamationId, status) => {
  const subject = 'Mise à jour de votre réclamation';
  const text = `Votre réclamation #${reclamationId} a été mise à jour. Nouveau statut: ${status}`;
  const html = `
    <h1>Mise à jour de réclamation</h1>
    <p>Votre réclamation #${reclamationId} a été mise à jour.</p>
    <p>Nouveau statut: <strong>${status}</strong></p>
  `;

  return sendEmail(to, subject, text, html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendReclamationStatusEmail
}; 