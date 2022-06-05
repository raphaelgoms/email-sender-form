const nodemailer = require('nodemailer');



exports.send = (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "MY_USER_ID",
          pass: "MY_PASSWORD"
        }
      });

    const mailOptions = {
        from: 'to@email.com',
        to: to,
        subject: subject,
        text: message
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}