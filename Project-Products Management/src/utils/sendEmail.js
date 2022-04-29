const nodeMailer = require("nodemailer");


const sendEmail = async (options) => {
  try {


    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });


// mj029044@gmail.com , 
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email, // 'mousmirahangdale23@gmail.com', //options.email, //” user1@gmail.com, user2@gmail.com, user3@yahoo.in “,
      subject: options.subject,
      text: options.message,
    };



    await transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err)
        return false
      }
      console.log("sendMessageData : ", data)
    });

    return true



  }
  catch (err) {
    console.log(err)
    return false
  }
};


module.exports = sendEmail;

