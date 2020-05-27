// const passport = require("passport");
// const kakaoStrategy = require("passport-kakao").Strategy; //property
// const keys = require("../config/keys");
// const User = require("../models/user");

// passport.serializeUser((user, done) => {
//   //user를 확인하고 session에 user를 저장 sessionid를 cookie로 전달.
//   done(null, user.id); //user.id는 profile id가 아니다. id는 _id를 나타낸다.
// });

// passport.deserializeUser((id, done) => {
//   //해당 user의 세션id를 가지고 데이터베이스에서 비교해서 request한 사람과 일치하는지 확인한다.

//   User.findById(id) //Id찾음
//     .then((user) => {
//       done(null, user);
//     });
// });

// passport.use(
//   new kakaoStrategy(
//     {
//       clientID: keys.clientID,
//       clientSecret: keys.clientSecret,
//       callbackURL: keys.callbackURL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       //done is callback
//       console.log(accessToken);
//       console.log(profile._json.kakao_account);
//       const existingUser = await User.findOne({ kakaoID: profile.id });
//       if (existingUser) {
//         //we already have a record with the given profile ID
//         return done(null, existingUser); //null meain is not error everyting is ok
//       } else {
//         //we don't have a user record with this ID, make a new record ID
//         //mongoose model instance
//         const user = await new User({
//           kakaoID: profile.id,
//           name: profile.username,
//           email: profile._json.kakao_account.email,
//         }).save(); //save instance
//         return done(null, user);
//       }
//     },
//   ),
// );

// module.exports = passport;
