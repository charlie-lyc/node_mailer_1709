const express = require('express')
const { engine } = require('express-handlebars')
const path = require('path')
const nodemailer = require('nodemailer')
require('dotenv').config()


const app = express()

// View Engine
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Static Folder
// app.use('/public', express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))

// Routing
app.get('/', (req, res) => {
    // res.send('Hello World!')
    res.render('contact')
})
/**************************************************************************************************/
// Node Mailer
app.post('/send', async (req, res) => {
    // console.log(req.body)
    const output = `
        <p>You have a new contact request.</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>Message: ${req.body.message}</p>
    `

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        requireTLS: true,
        host: 'smtp.gmail.com',                   // 1. 'mail.DOMAIN.com'
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_ACCOUNT,      // 2. 'EMAIL@DOMAIN.com'
            pass: process.env.GMAIL_APP_PASSWORD, // 3. 'EMAIL PASSWORD'
        },
    })

    try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Node Mailer" <${process.env.GMAIL_ACCOUNT}>`, // sender address
            to: 'ofetwo@gmail.com', // 'bar@example.com, baz@example.com' // list of receivers
            subject: "Contact Request", // Subject line
            text: "Hello world?", // plain text body
            html: output, // html body
        })
        // console.log("Message sent: %s", info.messageId)
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        res.render('contact', { msg: 'Email has been sent!'})
    } catch (err) {
        console.log(err)
    }
})
/**************************************************************************************************/

// Running
const port = 3000
app.listen(port, () => console.log(`App is running on port ${port}`))