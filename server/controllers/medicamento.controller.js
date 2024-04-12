const MedicamentoService = require('../services/medicamento.service');

exports.getMedicamentos = async (req, res) => {
    const page = parseInt(req.query.page) || 1;

    try {
        if (isNaN(page)) {
            throw new Error('Número de página inválido.');
        }

        const {
            rows: medicamentos,
            total: cantidad_medicamentos,
            totalPages: paginas_totales
        } =
            await MedicamentoService.readMedicamentos(page);
        const prev = page > 1
            ? `/api/medicamento?page=${page - 1}`
            : null;
        const next = page < paginas_totales
            ? `/api/medicamento?page=${page + 1}`
            : null;
        const result_min = (page - 1) * 10 + 1;
        const result_max = page * 10;

        res.status(200).json({
            prev,
            next,
            paginas_totales,
            cantidad_medicamentos,
            result_min,
            result_max,
            medicamentos
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getMedicamentoById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            throw new Error('Número de identificación inválido.');
        }

        const medicamento = await MedicamentoService.readMedicamentoById(id);
        res.status(200).json(medicamento);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.createMedicamento = async (req, res) => {
    const medicamento = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion
    }

    try {
        await MedicamentoService.createMedicamento(medicamento);

        res.status(200).json({ message: 'Medicamento creado.'});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteMedicamento = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            throw new Error('Número de identificación inválido.');
        }

        const currentMedicamento =
            await MedicamentoService.readMedicamentoById(id);

        if (!currentMedicamento) {
            throw new Error('El medicamento no existe.');
        }

        await MedicamentoService.deleteMedicamento(id);

        res.status(200).json({ message: 'Medicamento eliminado.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.updateMedicamento = async (req, res) => {
    const id = parseInt(req.params.id);
    const medicamento = req.body;

    try {
        if (isNaN(id)) {
            throw new Error('Número de identificación inválido.');
        }

        await MedicamentoService.updateMedicamento(id, medicamento);

        res.status(200).json({ message: 'Medicamento actualizado.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}