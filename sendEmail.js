const nodemailer = require('nodemailer')

function sendEmail(text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    
    var mailOptions = {
        from: '"Mail Bot " <mailbot8020@gmail.com>',
        to: 'waritsan@gmail.com',
        subject: 'Shoppe Flash-Sale Alert ',
        text: text
    }
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return console.log(error)
        console.log('Message sent: ' + info.response);
    })
}

module.exports = sendEmail