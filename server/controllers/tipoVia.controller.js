// Importación de los servicios necesarios
const TipoViaService = require('../services/tipoVia.service');

/**
 * @name getTipoVia
 * @description Método asíncrono que obtiene todos los tipos de vía de la base de datos.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los tipos de vía.
 *              Si no se encuentran tipos de vía, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-TipoVia
 */
exports.getTipoVia = async (req, res) => {
  try {
    const tipoVia = await TipoViaService.readTipoVia();

    if (!tipoVia) {
      return res.status(404).json({
        errors: ['Los tipos de vía no fueron encontrados.']
      });
    }

    return res.status(200).json(tipoVia);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}