// Importación del modelo del servicio
const TokenModel = require('../models/token.model');

// Importación de las utilidades necesarias
const dbConn = require('../util/database/database');

/**
 * @class TokenService
 * @description Clase que contiene los métodos para interactuar con el modelo de Token.
 */
class TokenService {
  /**
   * @method createToken
   * @description Método para crear un nuevo token.
   * @static
   * @async
   * @memberof TokenService
   * @param {number} idUser - El ID del usuario.
   * @param {string} token - El token.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El nuevo token creado.
   */
  static async createToken(idUser, token, conn = dbConn) {
    return await TokenModel.create(idUser, token, conn);
  }

  /**
   * @method deleteToken
   * @description Método para eliminar un token por su ID de usuario.
   * @static
   * @async
   * @memberof TokenService
   * @param {number} idUser - El ID del usuario.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de eliminación.
   */
  static async deleteToken(idUser, conn = dbConn) {
    return await TokenModel.deleteTokensByUserId(idUser, conn);
  }
}

// Exportación del servicio
module.exports = TokenService;