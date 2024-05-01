// Importación de los servicios necesarios
const TensionArterialService  = require('../services/tensionArterial.service');

// Importación de las librerías necesarias
const momentTz                = require('moment-timezone');

// Importación de las funciones necesarias
const getSearchValues         = require('../util/functions/getSearchValuesByDate');

/**
 * @name getTensionArterial
 * @description Método asíncrono que obtiene las tensiones arteriales de un paciente de la base de datos.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
 *              la página actual, el total de páginas, el total de tensiones arteriales, el rango de resultados,
 *              la fecha de inicio, la fecha de fin, los elementos por página y las tensiones arteriales.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-TensionArterial
 */
exports.getTensionArterial = async (req, res) => {
  const limit = 10;

  try {
    const searchValues = getSearchValues(req);

    const page = searchValues.page;
    const fechaInicio = searchValues.fechaInicio;
    const fechaFin = searchValues.fechaFin;
    const paciente_id = searchValues.paciente_id;

    const {
      rows: resultados,
      total: cantidad_tensionArterial,
      actualPage: pagina_actual,
      totalPages: paginas_totales
    } =
      await TensionArterialService.readTensionArterial(searchValues, limit);

    if (page > 1 && page > paginas_totales) {
      return res.status(404).json({
        errors: ['La página de tensiones arteriales solicitada no existe.']
      });
    }

    const prev = page > 1
      ? `/tensionArterial/${paciente_id}?page=${page - 1}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      : null;
    const next = page < paginas_totales
      ? `/tensionArterial/${paciente_id}?page=${page + 1}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      : null;
    const result_min = (page - 1) * limit + 1;
    const result_max = resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
    const fecha_inicio = fechaInicio;
    const fecha_fin = fechaFin;
    const items_pagina = limit;

    return res.status(200).json({
      prev,
      next,
      result_min,
      result_max,
      cantidad_tensionArterial,
      items_pagina,
      pagina_actual,
      paginas_totales,
      fecha_inicio,
      fecha_fin,
      resultados
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}

/**
 * @name postTensionArterial
 * @description Método asíncrono que registra una nueva tensión arterial en la base de datos.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-TensionArterial
 */
exports.postTensionArterial = async (req, res) => {
  const fecha = momentTz.tz(new Date(), 'Europe/Madrid')
    .format('YYYY-MM-DD');
  const hora = momentTz.tz(new Date(), 'Europe/Madrid')
    .format('HH:mm:ss');
  const paciente_id = req.body.user_id;
  const sistolica = parseInt(req.body.sistolica);
  const diastolica = parseInt(req.body.diastolica);
  const pulsaciones = parseInt(req.body.pulsaciones);

  const tensionArterial = {
    paciente_id: paciente_id,
    sistolica: sistolica,
    diastolica: diastolica,
    pulsaciones: pulsaciones,
    fecha: fecha,
    hora: hora
  };

  try {
    await TensionArterialService.createTensionArterial(tensionArterial);

    return res.status(200).json({message: 'Tensión arterial registrada correctamente.'});
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}