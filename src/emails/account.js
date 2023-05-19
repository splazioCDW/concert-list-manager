//code to send a test email

//requires npm install
const sgMail = require('@sendgrid/mail')

//personal API key removed
// const sendgridAPIKey = ''
//sgMail.setApiKey(sendgridAPIKey)

//replaced API key
//naming convention for environment variables is all caps
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//Ch 15 - Environment Variables
// Goal: Pull JWT secret and database URL into env vars //
// 1. Create two new env vars: JWTJBECRET and MONGODBJJRL 
// 2. Setup values for each in the development env files 
// 3. Swap out three hardcoded values
// 4. Test your work. Create new user and get their profile|



// sgMail.send({
//     to: 'sarah.plazio@cdw.com',
//     from: 'sarah.plazio@cdw.com',
//     subject: 'This is my first creation with SendGrid Email.',
//     text: 'I hope this one actually reaches you.'
// })

//function that will be exported
const sendWelcomeEmail = (email, name) => {
    
    sgMail.send({
        to: email,
        from: 'sarah.plazio@cdw.com',
        subject: 'Thanks for joining in!',
        //using backticks where a variable can be interjected
        text: `Welcome to  the app, ${name}. Let me know how you get along with the app.`,
        //can add html elements and features if you want
        //html: ''
    })
}

// Ch 15 - Sending Welcome and Cancelation Emails
// Goal: Send email to user on cancelation //
// 1. Setup a new function for sending an email on cancelation //	- email and name as args
// 2. Include their name in the email and ask why they canceled 
// 3. Call it just after the account is removed 
// 4. Run the request and check your inbox
const sendCancellationEmail = (email, name) => {
    console.log('start sendCancellationEmail')
    sgMail.send({
        to: email,
        from: 'sarah.plazio@cdw.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}, I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

