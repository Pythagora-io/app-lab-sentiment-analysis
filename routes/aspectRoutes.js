const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const User = require('../models/User');

// GET route to render the aspect management page
router.get('/manage', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('aspect-manage', { predefinedAspects: user.predefinedAspects || [] });
  } catch (error) {
    console.error('Error fetching aspects:', error);
    res.status(500).render('error', { error: 'Failed to fetch aspects' });
  }
});

// POST route to add a new aspect
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { aspect } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user.predefinedAspects) {
      user.predefinedAspects = [];
    }
    user.predefinedAspects.push(aspect);
    await user.save();
    res.json({ success: true, aspect });
  } catch (error) {
    console.error('Error adding aspect:', error);
    res.status(500).json({ error: 'Failed to add aspect' });
  }
});

// PUT route to update an aspect
router.put('/update/:index', isAuthenticated, async (req, res) => {
  try {
    const { index } = req.params;
    const { aspect } = req.body;
    const user = await User.findById(req.session.userId);
    if (user.predefinedAspects && user.predefinedAspects[index]) {
      user.predefinedAspects[index] = aspect;
      await user.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Aspect not found' });
    }
  } catch (error) {
    console.error('Error updating aspect:', error);
    res.status(500).json({ error: 'Failed to update aspect' });
  }
});

// DELETE route to remove an aspect
router.delete('/delete/:index', isAuthenticated, async (req, res) => {
  try {
    const { index } = req.params;
    const user = await User.findById(req.session.userId);
    if (user.predefinedAspects && user.predefinedAspects[index]) {
      user.predefinedAspects.splice(index, 1);
      await user.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Aspect not found' });
    }
  } catch (error) {
    console.error('Error deleting aspect:', error);
    res.status(500).json({ error: 'Failed to delete aspect' });
  }
});

module.exports = router;