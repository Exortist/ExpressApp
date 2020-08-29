const {Router} = require('express')
const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail');
const User = require('../models/user')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const router = Router()

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
    auth: {
        // api_user: 'SENDGRID_USERNAME',
        api_key: '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'
    }
}
const client = nodemailer.createTransport(sgTransport(options));


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }


})

router.post('/register', async (req, res) => {

    try {
        const {email, password, repeat, name} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            await client.sendMail(regEmail(email), (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.message);
                }
            })
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log("Ошибка", e)
    }
})

module.exports = router