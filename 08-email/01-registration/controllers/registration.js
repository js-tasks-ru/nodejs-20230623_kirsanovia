const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const verificationToken = uuid();

  try {
    const user = await User.create({
      email,
      password,
      displayName,
      verificationToken,
    });

    await sendMail({
      template: 'confirmation',
      locals: {token: 'token'},
      to: email,
      subject: 'Подтвердите почту',
    });

    await user.setPassword(password);
    await user.save();

    ctx.status = 200;
    ctx.body = {status: 'ok'};
  } catch (e) {
    ctx.throw(400, e);
  }
};

module.exports.confirm = async (ctx, next) => {
  const verificationToken = ctx.request.body.verificationToken;
  let user;

  try {
    user = await User.findOne({verificationToken});

    if (!user) {
      ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }

    await User.updateOne({verificationToken}, {$unset: {verificationToken: ''}});
  } catch (e) {
    ctx.throw(400, e);
  }

  const token = await ctx.login(user);

  ctx.status = 200;
  ctx.body = {token};
};
