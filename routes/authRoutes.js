const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const { validateOpenAIKey } = require('../services/openaiValidation');

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, password });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).send('Invalid email or password');
    }
    req.session.userId = user._id;
    return res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send(error.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
});

router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('profile', { user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).render('error', { error: 'Failed to fetch user profile' });
  }
});

router.post('/profile/update', isAuthenticated, async (req, res) => {
  try {
    const { openaiApiKey } = req.body;
    const user = await User.findById(req.session.userId);

    // Validate the API key
    const isValid = await validateOpenAIKey(openaiApiKey);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OpenAI API key' });
    }

    user.openaiApiKey = openaiApiKey;
    await user.save();
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;