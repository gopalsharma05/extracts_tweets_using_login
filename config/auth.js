// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    // 'facebookAuth' : {
    //     'clientID'        : 'your-secret-clientID-here', // your App ID
    //     'clientSecret'    : 'your-client-secret-here', // your App Secret
    //     'callbackURL'     : 'http://localhost:3000/auth/facebook/callback',
    //     'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    //     'profileFields'   : ['id', 'email', 'name'] // For requesting permissions from Facebook API

    // },

    'twitterAuth' : {
        'consumerKey'        : '4FfVm6Lzzjo3N22sBJJmtnpJC',
        'consumerSecret'     : 'CPpCZbZk72tPZcDRbvLkkeZc1hOrrfnE35eKy8Q9QWSlVQ8pty',
        'callbackURL'        : 'http://localhost:3000/auth/twitter/callback'
    },

    // 'googleAuth' : {
    //     'clientID'         : 'your-secret-clientID-here',
    //     'clientSecret'     : 'your-client-secret-here',
    //     'callbackURL'      : 'http://localhost:3000/auth/google/callback'
    // }

};
