var TwitterStrategy = require("passport-twitter").Strategy;
const Twit = require("twit");

var Twitter = require("twitter");
// load up the user model
var { checkdate } = require("./myfunction");

var User = require("../app/models/user");

// load the auth variables
var configAuth = require("./auth"); // use this one for testing

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      function (req, token, tokenSecret, profile, done) {
        var client = new Twitter({
          consumer_key: configAuth.twitterAuth.consumerKey,
          consumer_secret: configAuth.twitterAuth.consumerSecret,
          access_token_key: token,
          access_token_secret: tokenSecret,
        });

        var friends_usernames = new Array();
        var params = { screen_name: profile.screen_name };

        var alltweets = [];

        var rj = 0;
        client.get("statuses/user_timeline", params, function (
          error,
          tweets,
          response
        ) {
          if (!error) {
            for (var j = 0; j < tweets.length; j++) {
              // console.log(tweets[j].created_at);
              var dt =
                tweets[j].created_at.substring(0, 10) +
                " " +
                tweets[j].created_at.substring(26, 30);

              if (checkdate(dt)) {
                if (tweets[j].entities.urls.length > 0) {
                  //   console.log(tweets[j].text);
                  alltweets.push(tweets[j].text);
                  rj++;
                }
              }
            }

            client.get("friends/list", params, function (
              error,
              tweets,
              response
            ) {
              if (!error) {
                for (var i = 0; i < tweets.users.length; i++) {
                  var param = { screen_name: tweets.users[i].screen_name };
                  client.get("statuses/user_timeline", param, function (
                    error,
                    tweets,
                    response
                  ) {
                    if (!error) {
                      for (var j = 0; j < tweets.length; j++) {
                        var dt =
                          tweets[j].created_at.substring(0, 10) +
                          " " +
                          tweets[j].created_at.substring(26, 30);

                        if (checkdate(dt)) {
                          // console.log("date is of past week",dt);
                          if (tweets[j].entities.urls.length > 0) {
                            console.log(tweets[j].text);
                            alltweets.push(tweets[j].text);
                            rj++;
                          }
                        }
                      }

                      // starts from here data
                      console.log(alltweets);
                      console.log("all length is ", alltweets.length);

                      process.nextTick(function () {
                        // check if the user is already logged in
                        if (!req.user) {
                          User.findOne({ "twitter.id": profile.id }, function (
                            err,
                            user
                          ) {
                            if (err) return done(err);

                            if (user) {
                              // if there is a user id already but no token (user was linked at one point and then removed)

                              if (!user.twitter.token) {
                                user.twitter.TweetArray = alltweets;
                                user.twitter.token = token;
                                user.twitter.username = profile.screen_name;
                                user.twitter.displayName = profile.name;
                                //   console.log(user);

                                user.save(function (err) {
                                  if (err) return done(err);

                                  return done(null, user);
                                });
                              }

                              return done(null, user); // user found, return that user
                            } else {
                              // if there is no user, create them

                              var newUser = new User();
                              newUser.twitter.TweetArray = alltweets;
                              newUser.twitter.id = profile.id;
                              newUser.twitter.token = token;
                              newUser.twitter.username = profile.screen_name;
                              newUser.twitter.displayName = profile.name;
                              // console.log(newUser);

                              newUser.save(function (err) {
                                if (err) return done(err);

                                return done(null, newUser);
                              });
                            }
                          });
                        } else {
                          // user already exists and is logged in, we have to link accounts

                          var user = req.user; // pull the user out of the session
                          user.twitter.TweetArray = alltweets;
                          user.twitter.id = profile.id;
                          user.twitter.token = token;
                          user.twitter.username = profile.screen_name;
                          user.twitter.displayName = profile.name;
                          // console.log(user);

                          user.save(function (err) {
                            if (err) return done(err);

                            return done(null, user);
                          });
                        }
                      });
                    }
                  });
                }

                // console.log(alltweets);
              }
            });
          }
          //   console.log(alltweets);
        });

        // client.get('friends/list', params, function(error, tweets, response) {
        //   if (!error) {

        //     for(var i=0;i<(tweets.users.length);i++)
        //     {

        //         var param = {screen_name:tweets.users[i].screen_name};
        //           client.get('statuses/user_timeline', param, function(error, tweets, response) {
        //         if (!error) {

        //             for(var j=0;j<tweets.length;j++)
        //             {
        //                   var dt=tweets[j].created_at.substring(0,10)+' '+tweets[j].created_at.substring(26,30)

        //                 if(checkdate(dt))
        //                 {
        //                     // console.log("date is of past week",dt);
        //                     if(tweets[j].entities.urls.length>0)
        //                     {
        //                          console.log(tweets[j].text);
        //                         alltweets[rj]=tweets[j].text;
        //                         rj++;
        //                     }

        //                 }

        //             }
        //   }
        // });

        //     }

        //   }
        //   // console.log("all length is ",alltweets.length);
        // });
      }
    )
  );

  //
};
