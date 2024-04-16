const { body, validationResult } = require('express-validator');

exports.validateTensionArterial = [
    body('sistolica')
        .trim()
        .notEmpty().withMessage('La medición sistólica es requerida.')
        .isNumeric().withMessage('La medición sistólica debe ser un valor numérico.')
        .custom(value => {
            if (value < 0) {
                throw new Error('La medición sistólica no puede ser un valor negativo.');
            }

            const regex = /^\d{2,3}$/;
            if (!regex.test(value)) {
                throw new Error('La medición sistólica debe tener entre 2 y 3 dígitos.');
            }

            return true;
        }),
    body('diastolica')
        .trim()
        .notEmpty().withMessage('La medición diastólica es requerida.')
        .isNumeric().withMessage('La medición diastólica debe ser un valor numérico.')
        .custom(value => {
            if (value < 0) {
                throw new Error('La medición diastólica no puede ser un valor negativo.');
            }

            const regex = /^\d{2,3}$/;
            if (!regex.test(value)) {
                throw new Error('La medición diastólica debe tener entre 2 y 3 dígitos.');
            }

            return true;
        }),
    body('pulsaciones')
        .trim()
        .notEmpty().withMessage('Las pulsaciones por minuto son requeridas.')
        .isNumeric().withMessage('Las pulsaciones por minuto deben ser un valor numérico.')
        .custom(value => {
            if (value < 0) {
                throw new Error('Las pulsaciones por minuto no pueden ser un valor negativo.');
            }

            const regex = /^\d{2,3}$/;
            if (!regex.test(value)) {
                throw new Error('Las pulsaciones por minuto deben tener entre 2 y 3 dígitos.');
            }

            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
];