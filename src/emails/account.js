//requires npm install
const sgMail = require('@sendgrid/mail')

//replaced API key
//naming convention for environment variables is all caps
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//function that will be exported
const sendWelcomeEmail = (email, name) => {
    
    sgMail.send({
        to: email,
        from: 'sarah.plazio@cdw.com',
        subject: 'Thanks for joining in!',
        //using backticks where a variable can be interjected
        text: `Welcome to the Concert Guru app, ${name}. We are stocked and thrilled that you joined the community where you can experience live music magic.`,
        //can add html elements and features if you want
        //html: ''
    })
    console.log('email sent to ', email)
}

const sendCancellationEmail = (email, name) => {
    
    sgMail.send({
        to: email,
        from: 'sarah.plazio@cdw.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}, I hope to see you back sometime soon.`
    })
    console.log('sendCancellationEmail')
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

