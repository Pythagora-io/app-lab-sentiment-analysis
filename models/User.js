const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  openaiApiKey: { type: String, required: true },
  customEmotions: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5']
  },
  predefinedAspects: [String], // Added line for predefined aspects
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