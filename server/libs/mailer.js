var merge,
    transporter,
    xoauth2;

merge = require('merge');
xoauth2 = require('xoauth2');

/**
*  reference for this functionality: http://masashi-k.blogspot.com/2013/06/sending-mail-with-gmail-using-xoauth2.html
*/

/**
*  This defines our transporter from nodemailer, in order to access these secrets and ids, you must have them
*  stored in your config.env file to make them run locally.   These variables can be found in the team trello, or
*  you can set up your own email account to send emails from.  Instructions for creating your own google oath Credentials
*  can be found in the link above.
*/
transporter = require('nodemailer').createTransport({
    service: "gmail",
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: process.env.EMAIL_USER,
            clientId: process.env.EMAIL_CLIENT_ID,
            clientSecret: process.env.EMAIL_CLIENT_SECRET,
            refreshToken: process.env.EMAIL_REFRESH_TOKEN,
            accessToken: process.env.EMAIL_ACCESS_TOKEN
        })
    }
});

/**
 * This is our entry point to sending emails, it recieves the host the email was sent from (localHost:PORT etc.),
 * the emailAddress it's being sent to, and the unique token for that user.   It formats the configs, and passes the config
 * object to our template/mailer to be compiled and sent out.
 */
function sendEmail(options) {

    var defaults,
        send,
        settings;

    defaults = {
        body: '',
        from: '"Service Catalog" <service.catalog.usered@gmail.com>',
        inject: {},
        subject: 'Service Catalog',
        to: null
    };

    settings = merge.recursive({}, defaults, options);

    send = transporter.templateSender({
        subject: settings.subject,
        html: settings.body
    }, {
        from: settings.from
    });

    return send({
        to: settings.to
    }, settings.inject).then(function () {
        transporter.close();
        return Promise.resolve(true);
    });
}

module.exports = {
    sendEmail: sendEmail
};
