const sendConfirmationLinkEmail = (userEmail, userName, userToken) => {
  const mailjet = require('node-mailjet').connect(process.env.mailjetAK.toString(), process.env.mailjetAS.toString());
  const link = `${process.env.URL}profile?confirm=${userToken}`;
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "stainoncarpet@gmail.com",
            "Name": "Pollster"
          },
          "To": [
            {
              "Email": `${userEmail}`,
              "Name": `${userName}`
            }
          ],
          "Subject": "Confirm your email",
          "TextPart": "email confirmation link",
          "HTMLPart": `<h3>Hello ${userName}!</h3>
                                            <p>Thank you for taking your time to register on Pollster.</p>
                                            <p>In order to confirm your email address and getting the right to vote, 
                                            follow this link: ${link}
                                            </p>
                                            <p>The link will expire in ${process.env.MAIL_TOKEN_LIFESPAN_IN_MINUTES} minutes.</p>
                                            `
          ,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    });
  request
    .then((result) => console.log(`Email containing link [${link}] successfully sent to ${userEmail}`))
    .catch((err) => console.log(`Email wasn't sent to ${userEmail}`));
};

const sendSuccessfulConfirmationEmail = (userEmail, userName) => {
  const mailjet = require('node-mailjet').connect(process.env.mailjetAK.toString(), process.env.mailjetAS.toString());
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "stainoncarpet@gmail.com",
            "Name": "Pollster"
          },
          "To": [
            {
              "Email": `${userEmail}`,
              "Name": `${userName}`
            }
          ],
          "Subject": "Your email address has been confirmed",
          "TextPart": "email confirmed",
          "HTMLPart": `<h3>Hello ${userName}!</h3>
                                          <p>Your email address has been confirmed.</p>
                                          <p>Enjoy!</p>
                                          `
          ,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    });
  request
    .then((result) => console.log(`Email successfully sent to ${userEmail}`))
    .catch((err) => console.log(`Email wasn't sent to ${userEmail}`));
};

const sendPasswordResetLink = (userEmail, userName, userToken) => {
  const mailjet = require('node-mailjet').connect(process.env.mailjetAK.toString(), process.env.mailjetAS.toString());
  const link = `${process.env.URL}profile/password-reset?reset=${userToken}`
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "stainoncarpet@gmail.com",
            "Name": "Pollster"
          },
          "To": [
            {
              "Email": `${userEmail}`,
              "Name": `${userName}`
            }
          ],
          "Subject": "Password reset",
          "TextPart": "password reset link",
          "HTMLPart": `<h3>Hello ${userName}!</h3>
                                          <p>Somebody requested password reset for your account on Pollster.</p>
                                          <p>In order to proceed with the reset, 
                                          follow this link: ${link}
                                          </p>
                                          <p>The link will expire in ${process.env.MAIL_TOKEN_LIFESPAN_IN_MINUTES} minutes.</p>
                                          `
          ,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    });
  request
    .then((result) => console.log(`Email containing link [${link}] successfully sent to ${userEmail}`))
    .catch((err) => console.log(`Email wasn't sent to ${userEmail}`));
};

const sendSuccessfulPasswordResetEmail = (userEmail, userName) => {
  const mailjet = require('node-mailjet').connect(process.env.mailjetAK.toString(), process.env.mailjetAS.toString());
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "stainoncarpet@gmail.com",
            "Name": "Pollster"
          },
          "To": [
            {
              "Email": `${userEmail}`,
              "Name": `${userName}`
            }
          ],
          "Subject": "Password reset successful",
          "TextPart": "password reset",
          "HTMLPart": `<h3>Hello ${userName}!</h3>
                                          <p>Your password has been successfully reset.</p>
                                          `
          ,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    });
  request
    .then((result) => console.log(`Email successfully sent to ${userEmail}`))
    .catch((err) => console.log(`Email wasn't sent to ${userEmail}`));
};

module.exports = { sendConfirmationLinkEmail, sendSuccessfulConfirmationEmail, sendPasswordResetLink, sendSuccessfulPasswordResetEmail };