const {body} = require('express-validator/check')
const User = require('../models/user')
exports.registersValidators = [
    body('email')
        .isEmail()
        .withMessage('Введите корректный Email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})

                if (user) {
                    return Promise.reject('Такой email уже занят')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('password', 'Пароль должен содержать минимум 6 символов')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Пароли должны совпадать')
            }
            return true
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Имя должно содержать минимум 3 символа')
        .trim(),
]

exports.courseValidators = [
body('title').isLength({min: 3}).withMessage('Минимальная длинна названия 3 символа'),
body('price').isNumeric().withMessage('Введите корректную цену'),
body('img','Введите корректный URL картинки').isURL()
]