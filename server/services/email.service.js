const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const nodeMailer = require('nodemailer');

const templatesPath = path.join(__dirname, '../util/templates/email');

class EmailService {
    static async sendPasswordResetEmail(to, user, resetToken) {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const templatePath = path.join(templatesPath, 'reset-password.html');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);

        const html = template({ user, resetLink: `${process.env.ANGULAR_HOST}/reset-password/${resetToken}` });

        const mailDetails = {
            from: "clinicamedicacoslada@gmail.com",
            to: to,
            subject: "Recuperar contraseña - Clínica Médica Coslada",
            html: html
        }

        try {
            return await transporter.sendMail(mailDetails);
        } catch (err) {
            throw err;
        }
    }

    static async sendContactEmail(contacto) {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const templatePath = path.join(templatesPath, 'contact.handlebars');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);

        const html = template({ contacto });

        const mailDetails = {
            from: process.env.EMAIL_ACCOUNT,
            to: process.env.EMAIL_ACCOUNT,
            subject: `Nuevo mensaje de contacto - ${contacto.nombre}`,
            html: html
        }

        try {
            return await transporter.sendMail(mailDetails);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = EmailService;