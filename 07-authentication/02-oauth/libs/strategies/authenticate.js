const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  return User.findOne({email})
      .then((currentUser) => {
        if (currentUser) return done(null, currentUser);
        const user = {email, displayName};

        return User.create(user)
            .then(() => done(null, user))
            .catch((e) => done(e, false, e.errors.email.message));
      })
      .catch((_) => {
        done(null, false, 'Unexpected error occured');
      });
};
