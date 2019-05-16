const sendEmail = require('./helpers/sendEmail')

const html = `
<div>
    <a href="https://shopee.co.th/-1-แถม-1-Sabina-เสื้อชั้นใน-Wireless-Shape-(ไม่มีโครง)-SBK256BK-SBK256CD-สีเนื้อเข้ม-สีดำ-i.12455213.1090262385">
        <div><img src="https://cf.shopee.co.th/file/7ff987fb95da70cb276eec05c392ce5f" alt="-Sabina" width="200" height="200"></div>
        <div>Sabina</div>
    </a>
</div>`
sendEmail('Hello', html)