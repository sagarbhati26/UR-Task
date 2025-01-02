import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger:true,
      debug:true,
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,      // Use parameters passed to the function
      subject,  // Use parameters passed to the function
      text,     // Use parameters passed to the function
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent :${error}');
  }
};

export { sendEmail };
