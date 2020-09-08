const {body} = require('express-validator/check')

exports.registersValidators = [
    body('email').isEmail().withMessage('Введите корректный Email'),
    body('password', 'Пароль должен содержать минимум 6 символов').isLength({min: 6, max: 56}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }
        return true
    }),
    body('name').isLength({min: 3}).withMessage('Имя должно содержать минимум 3 символа')
]