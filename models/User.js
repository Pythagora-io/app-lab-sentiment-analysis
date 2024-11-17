const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  openaiApiKey: { type: String },
  customEmotions: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5']
  },
  predefinedAspects: [String],
  customAspects: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5']
  },
});

function arrayLimit(val) {
  return val.length <= 5;
}

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;