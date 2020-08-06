const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/course')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const User = require('./models/user')

const url = `mongodb+srv://Exortist:5553535@cluster0.od6od.mongodb.net/shop`



app.set('view engine', 'pug');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5f2936fa7064e51d483e1c82')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/',homeRoutes)
app.use('/add',addRoutes)
app.use('/courses',coursesRoutes)
app.use('/card',cardRoutes)
app.use('/orders',ordersRoutes)
app.use('/auth',authRoutes)



const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'megagugl530@gmail.com',
                name: 'Dmitriy',
                cart: {items: []}
            })
            await  user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

