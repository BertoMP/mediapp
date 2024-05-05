// Importación de los servicios necesarios
import PacienteTomaMedicamentoService from '../services/pacienteTomaMedicamento.service.js';
import PdfService from '../services/pdf.service.js';
import TomaService from "../services/toma.service.js";

/**
 * @class PacienteTomaMedicamentoController
 * @description Clase estática que implementa la lógica de las recetas de los pacientes de la aplicación.
 */
class PacienteTomaMedicamentoController {
	/**
	 * @name getRecetas
	 * @description Método asíncrono que obtiene las recetas de un paciente específico de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de las recetas.
	 *              Si no hay recetas para el paciente, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PacienteTomaMedicamentoController
	 */
	static async getRecetas(req, res) {
		let paciente_id = 0;

		if (req.user_role === 2) {
			paciente_id = req.user_id;
		} else if (req.user_role === 3) {
			paciente_id = req.params.usuario_id;
		}

		paciente_id = parseInt(paciente_id);

		try {
			const prescripciones = await PacienteTomaMedicamentoService.findPrescripciones(paciente_id);

			if (!prescripciones || prescripciones.length === 0) {
				return res.status(404).json({
					errors: ['No hay recetas para este paciente.'],
				});
			}

			return res.status(200).json(prescripciones);
		} catch (error) {
			return res.status(500).json({
				errors: [error.message],
			});
		}
	}

	/**
	 * @name postReceta
	 * @description Método asíncrono que crea una nueva receta en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PacienteTomaMedicamentoController
	 */
	static async postReceta(req, res) {
		const paciente_id = req.body.paciente_id;
		const prescripcion = req.body.prescripcion;

		try {
			await PacienteTomaMedicamentoService.createPrescripcion(paciente_id, prescripcion);

			return res.status(200).json({
				message: 'Receta guardada correctamente.',
			});
		} catch (error) {
			return res.status(500).json({
				errors: [error.message],
			});
		}
	}

	/**
	 * @name deleteToma
	 * @description Método asíncrono que elimina una toma específica de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la toma no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PacienteTomaMedicamentoController
	 */
	static async deleteToma(req, res) {
		const toma_id = req.params.toma_id;

		try {
			const tomaExists = await TomaService.findToma(toma_id);

			if (!tomaExists) {
				return res.status(404).json({
					errors: ['La toma no existe.'],
				});
			}

			await PacienteTomaMedicamentoService.deleteTomaFromPrescription(toma_id);

			return res.status(200).json({
				message: 'Toma eliminada correctamente.',
			});
		} catch (error) {
			return res.status(500).json({
				errors: [error.message],
			});
		}
	}

	/**
	 * @name deleteMedicamento
	 * @description Método asíncrono que elimina un medicamento específico de la prescripción del paciente utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el medicamento no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PacienteTomaMedicamentoController
	 */
	static async deleteMedicamento(req, res) {
		const paciente_id = req.params.usuario_id;
		const medicamento_id = req.params.medicamento_id;

		try {
			const medicamentoExists = await PacienteTomaMedicamentoService.findMedicamento(
				paciente_id,
				medicamento_id,
			);

			if (!medicamentoExists || medicamentoExists.length === 0) {
				return res.status(404).json({
					errors: ['El medicamento no existe.'],
				});
			}

			await PacienteTomaMedicamentoService.deleteMedicamentoFromPrescription(
				paciente_id,
				medicamento_id,
			);

			return res.status(200).json({
				message: 'Medicamento eliminado correctamente.',
			});
		} catch (error) {
			return res.status(500).json({
				errors: [error.message],
			});
		}
	}

	/**
	 * @name getRecetaPDF
	 * @description Método asíncrono que genera un PDF con las recetas de un paciente específico de la base de datos utilizando su ID.
	 *              Devuelve el archivo PDF para su descarga.
	 *              Si no hay recetas para el paciente, devuelve un error con el mensaje correspondiente.
	 *              Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PacienteTomaMedicamentoController
	 */
	static async getRecetaPDF(req, res) {
		let paciente_id = 0;

		if (req.user_role === 2) {
			paciente_id = req.user_id;
		} else if (req.user_role === 3) {
			paciente_id = req.params.usuario_id;
		}

		paciente_id = parseInt(paciente_id);

		try {
			const prescripciones = await PacienteTomaMedicamentoService.findPrescripciones(paciente_id);

			if (!prescripciones || prescripciones.prescripciones.length === 0) {
				return res.status(404).json({
					errors: ['No hay recetas para este paciente.'],
				});
			}

			const file = await PdfService.generateReceta(prescripciones);

			res.status(200).download(file, async (err) => {
				await PdfService.destroyPDF(file);
				if (err) {
					console.error('Error al descargar el archivo:', err);
				}
			});
		} catch (error) {
			return res.status(500).json({
				errors: [error.message],
			});
		}
	}
}

// Exportación del controlador
export default PacienteTomaMedicamentoController;
