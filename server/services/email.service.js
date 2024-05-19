// Importación de librerías necesarias
import pkg from 'handlebars';
const { compile } = pkg;
import { readFileSync } from 'fs';
import { join } from 'path';
import { createTransport } from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

// Definición de las constantes __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta de los templates de email
const templatesPath = join(__dirname, '../helpers/templates/email');

/**
 * @class EmailService
 * @description Clase que contiene los métodos para enviar emails.
 */
class EmailService {
	/**
	 * @method sendWelcomeEmail
	 * @description Método para enviar un correo electrónico de bienvenida.
	 * @static
	 * @async
	 * @memberof EmailService
	 * @param {string} to - La dirección de correo electrónico del destinatario.
	 * @param {string} name - El nombre del destinatario.
	 * @returns {Promise<Object>} El resultado de la operación de envío de correo.
	 * @throws {Error} Si ocurre un error durante el envío del correo, se lanza un error.
	 */
	static async sendWelcomeEmail(to, name) {
		const transporter = EmailService.#createTransporter();
		const compiledTemplate = EmailService.#compileTemplate(
			'welcome.handlebars', { name });

		const mailDetails = EmailService.#createMailDetails(
			process.env.EMAIL_ACCOUNT,
			to,
			'Bienvenido a Clínica Médica Coslada',
			compiledTemplate,
		);

		try {
			return await transporter.sendMail(mailDetails);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method sendPasswordResetEmail
	 * @description Método para enviar un correo electrónico de restablecimiento de contraseña.
	 * @static
	 * @async
	 * @memberof EmailService
	 * @param {string} to - La dirección de correo electrónico del destinatario.
	 * @param {Object} user - El objeto de usuario.
	 * @param {string} resetToken - El token de restablecimiento de contraseña.
	 * @returns {Promise<Object>} El resultado de la operación de envío de correo.
	 * @throws {Error} Si ocurre un error durante el envío del correo, se lanza un error.
	 */
	static async sendPasswordResetEmail(to, user, resetToken) {
		const transporter = EmailService.#createTransporter();
		const compiledTemplate = EmailService.#compileTemplate(
			'reset-password.handlebars', {
			user,
			resetLink:
				`${process.env.ANGULAR_HOST}:${process.env.ANGULAR_PORT}/auth/reset-password/${resetToken}`,
		});

		const mailDetails = EmailService.#createMailDetails(
			'clinicamedicacoslada@gmail.com',
			to,
			'Recuperar contraseña - Clínica Médica Coslada',
			compiledTemplate,
		);

		try {
			return await transporter.sendMail(mailDetails);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method sendContactEmail
	 * @description Método para enviar un correo electrónico de contacto.
	 * @static
	 * @async
	 * @memberof EmailService
	 * @param {Object} contacto - El objeto de contacto.
	 * @returns {Promise<Object>} El resultado de la operación de envío de correo.
	 * @throws {Error} Si ocurre un error durante el envío del correo, se lanza un error.
	 */
	static async sendContactEmail(contacto) {
		const transporter = EmailService.#createTransporter();

		const compiledTemplate = EmailService.#compileTemplate('contact.handlebars', { contacto });

		const mailDetails = EmailService.#createMailDetails(
			process.env.EMAIL_ACCOUNT,
			process.env.EMAIL_ACCOUNT,
			`${contacto.descripcion}`,
			compiledTemplate,
		);

		try {
			return await transporter.sendMail(mailDetails);
		} catch (err) {
			throw err;
		}
	}

	static async sendEmailCitaEliminada(cita, emailPaciente) {
		const transporter = EmailService.#createTransporter();
		const compiledTemplate = EmailService.#compileTemplate('citaCancelada.handlebars', { cita });

		const mailDetails = EmailService.#createMailDetails(
			process.env.EMAIL_ACCOUNT,
			emailPaciente,
			'Cancelación de cita',
			compiledTemplate,
		);

		try {
			return await transporter.sendMail(mailDetails);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method sendPdfCita
	 * @description Método para enviar un correo electrónico con un PDF de cita adjunto.
	 * @static
	 * @async
	 * @memberof EmailService
	 * @param {Object} newCita - El objeto de la nueva cita.
	 * @param {string} emailPaciente - La dirección de correo electrónico del paciente.
	 * @param {string} pdf - La ruta al archivo PDF de la cita.
	 * @returns {Promise<Object>} El resultado de la operación de envío de correo.
	 * @throws {Error} Si ocurre un error durante el envío del correo, se lanza un error.
	 */
	static async sendPdfCita(newCita, emailPaciente, pdf) {
		const transporter = EmailService.#createTransporter();

		const compiledTemplate = EmailService.#compileTemplate('cita.handlebars', { newCita });

		const mailDetails = EmailService.#createMailDetails(
			process.env.EMAIL_ACCOUNT,
			emailPaciente,
			'Confirmación de cita',
			compiledTemplate,
			[
				{
					filename: `cita_${newCita.datos_paciente.nombre}_${newCita.datos_paciente.primer_apellido}_${newCita.datos_cita.fecha}.pdf`,
					path: pdf,
				},
			],
		);

		try {
			return await transporter.sendMail(mailDetails);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method createTransporter
	 * @description Método privado para crear un transportador de correo con NodeMailer.
	 * @static
	 * @private
	 * @memberof EmailService
	 * @returns {Object} Un transportador de correo configurado con el servicio de Gmail y las credenciales de autenticación.
	 */
	static #createTransporter() {
		return createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_ACCOUNT,
				pass: process.env.EMAIL_PASS,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});
	}

	/**
	 * @method compileTemplate
	 * @description Método privado para compilar una plantilla de Handlebars.
	 * @static
	 * @private
	 * @memberof EmailService
	 * @param {string} templateName - El nombre de la plantilla a compilar.
	 * @param {Object} data - Los datos a insertar en la plantilla.
	 * @returns {string} La plantilla compilada con los datos insertados.
	 */
	static #compileTemplate(templateName, data) {
		const templatePath = join(templatesPath, templateName);
		const source = readFileSync(templatePath, 'utf8');
		const template = compile(source);

		return template(data);
	}

	/**
	 * @method createMailDetails
	 * @description Método privado para crear los detalles de un correo electrónico.
	 * @static
	 * @private
	 * @memberof EmailService
	 * @param {string} from - La dirección de correo electrónico del remitente.
	 * @param {string} to - La dirección de correo electrónico del destinatario.
	 * @param {string} subject - El asunto del correo electrónico.
	 * @param {string} html - El contenido HTML del correo electrónico.
	 * @param {Array} [attachments=[]] - Los archivos adjuntos del correo electrónico.
	 * @returns {Object} Un objeto con los detalles del correo electrónico.
	 */
	static #createMailDetails(from, to, subject, html, attachments = []) {
		return {
			from: from,
			to: to,
			subject: subject,
			html: html,
			attachments: attachments,
		};
	}
}

// Exportación del servicio
export default EmailService;
