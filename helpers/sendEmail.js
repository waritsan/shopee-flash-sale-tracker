const nodemailer = require('nodemailer')

function sendEmail(text, html) {
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
        text: text,
        html: html
    }
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return console.log(err)
        console.log('Message sent: ' + info.response);
    })
}

module.exports = sendEmail