const nodemailer = require('nodemailer')

function sendEmail(text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_FROM,
            pass: process.env.PASSWORD
        }
    })
    
    var mailOptions = {
        from: `"Mail Bot " <${process.env.MAIL_FROM}>`,
        to: process.env.MAIL_TO,
        subject: 'Shoppe Flash-Sale Alert ',
        text: text
    }
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return console.log(error)
        console.log('Message sent: ' + info.response);
    })
}

module.exports = sendEmail