// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

// This just sends an email when you click the button to test it out
function sendUserEmail(email, path , row) {
    console.log("email script reached")
    const sgMail = require('@sendgrid/mail')
    //sgMail.setApiKey(process.env.SENDGRID_API_KEY) the actually safe one
    sgMail.setApiKey('OUR-EMAIL-API-KEY')
    const msg = {
    to: email,
    from: 'our-email@email.com', // Change to your verified sender
    subject: 'You are now subcsribed to Landsat notifications',
    text: 'Thank you for submitting your email to the Landsat Tracker',
    html: 'You have subscribed to email notifications about the Landsat pixel at Path ' + path+ ' and Row  ' + row + '. You will receive an email notification the next Landsat is coming your way!',
    }
    sgMail
    .send(msg)
    .then(() => {
       console.log('Email sent')
       return true
    })
    .catch((error) => {
       console.error(error)
       return false
    })
}

module.exports = sendUserEmail;