const { param, validationResult } = require('express-validator');

exports.validateProvinciaIdParam = [
    param('provincia_id')
        .isNumeric().withMessage('El ID de la provincia debe ser un valor numérico.')
        .custom(value => {
            if (value < 1) {
                throw new Error('El ID de la provincia debe ser un valor positivo.');
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