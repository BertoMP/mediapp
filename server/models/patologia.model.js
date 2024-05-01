/**
 * @class PatologiaModel
 * @description Clase que contiene los métodos para interactuar con la tabla de patologías.
 */
class PatologiaModel {
  /**
   * @method fetchAllInforme
   * @description Método para obtener todas las patologías.
   * @static
   * @async
   * @memberof PatologiaModel
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de patologías.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async fetchAllInforme(dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre ' +
      'FROM ' +
      '   patologia';

    try {
      const [rows] = await dbConn.execute(query);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener las patologías.');
    }
  }

  /**
   * @method fetchAll
   * @description Método para obtener todas las patologías con paginación.
   * @static
   * @async
   * @memberof PatologiaModel
   * @param {number} page - La página actual.
   * @param {number} limit - El número de patologías por página.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto con las patologías y la información de la paginación.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async fetchAll(page, limit, dbConn) {
    const offset = ((page - 1) * limit);

    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   patologia ' +
      'LIMIT ? OFFSET ?';

    try {
      const [rows] =
        await dbConn.execute(query, [`${limit}`, `${offset}`]);
      const [count] =
        await dbConn.execute(
          'SELECT ' +
          '   COUNT(*) AS count ' +
          'FROM ' +
          '   patologia'
        );
      const total = count[0].count;
      const actualPage = page;
      const totalPages = Math.ceil(total / limit);

      return {rows, total, actualPage, totalPages};
    } catch (err) {
      throw new Error('Error al obtener las patologías.');
    }
  }

  /**
   * @method findById
   * @description Método para obtener una patología por su ID.
   * @static
   * @async
   * @memberof PatologiaModel
   * @param {number} id - El ID de la patología.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} La patología.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async findById(id, dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   patologia ' +
      'WHERE ' +
      '   id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el patologia.');
    }
  }

  /**
   * @method findByNombre
   * @description Método para obtener una patología por su nombre.
   * @static
   * @async
   * @memberof PatologiaModel
   * @param {string} nombre - El nombre de la patología.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} La patología.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async findByNombre(nombre, dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   patologia ' +
      'WHERE ' +
      '   nombre = ?';

    try {
      const [rows] = await dbConn.execute(query, [nombre]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener la patología.');
    }
  }

  /**
   * @method save
   * @description Método para guardar una nueva patología.
   * @static
   * @async
   * @memberof PatologiaModel
   * @param {Object} patologia - El objeto de la nueva patología.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async save(patologia, dbConn) {
    const nombre      = patologia.nombre;
    const descripcion = patologia.descripcion;

    const query =
      'INSERT INTO patologia (nombre, descripcion) ' +
      '   VALUES (?, ?)';

    try {
      await dbConn.execute(query, [nombre, descripcion]);
    } catch (err) {
      throw new Error('Error al guardar la patología.');
    }
  }

  /**
   * @method updateById
   * @description Método para actualizar una patología por su ID.
   * @static
   * @async
   * @memberof PatologiaModel
   * @param {number} id - El ID de la patología.
   * @param {Object} patologia - El objeto de la patología con los datos actualizados.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async updateById(id, patologia, dbConn) {
    const nombre      = patologia.nombre;
    const descripcion = patologia.descripcion;

    const query =
      'UPDATE ' +
      '   patologia ' +
      'SET ' +
      '   nombre = ?, ' +
      '   descripcion = ? ' +
      'WHERE ' +
      '   id = ?';

    try {
      await dbConn.execute(query, [nombre, descripcion, id]);
    } catch (err) {
      throw new Error('Error al actualizar la patología.');
    }
  }
}

// Exportación del modelo
module.exports = PatologiaModel