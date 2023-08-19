const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      let user;
      return User.findOne({email})
          .then((currentUser) => {
            if (!currentUser) {
              return done(null, false, 'Нет такого пользователя');
            };

            user = currentUser;
            return user.checkPassword(password);
          })
          .then((isValidPassword) => {
            if (!isValidPassword) {
              return done(null, false, 'Неверный пароль');
            };

            done(null, user);
          })
          .catch((_) => {
            done(null, false, 'Unexpected error occured');
          });
    },
);
