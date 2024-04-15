class ProvinciaModel {
    static async fetchAll(dbConn) {
        const query =
            'SELECT id as value, nombre as label FROM provincia ' +
            'ORDER BY nombre';

        try {
            const [rows] = await dbConn.execute(query);
            return rows;
        } catch (err) {
            throw new Error('Error al obtener las provincias.');
        }
    }
}

module.exports = ProvinciaModel;