const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')


const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/course')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')


const MONGODB_URI = `mongodb+srv://Exortist:5553535@cluster0.od6od.mongodb.net/shop?retryWrites=true&w=majority`

const app = express()
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI

})


app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

