const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parse } = require('csv-parse');
const fs = require('fs');
const { isAuthenticated } = require('./middleware/authMiddleware');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { analyzeFeedback, generateSummary } = require('../services/openaiService');
const emotions = require('../data/emotions');

const upload = multer({ dest: 'uploads/' });

router.get('/feedback/new', isAuthenticated, (req, res) => {
  res.render('feedback-input');
});

router.post('/feedback/new', isAuthenticated, upload.single('csvFile'), async (req, res) => {
  try {
    if (req.file) {
      // If a file was uploaded, redirect to the CSV upload route
      return res.redirect(307, '/feedback/upload');
    }

    // Handle single feedback submission
    const { date, customerName, product, feedbackText } = req.body;
    const newFeedback = new Feedback({
      date: new Date(date),
      customerName,
      product,
      feedbackText,
      user: req.session.userId
    });
    await newFeedback.save();
    res.redirect('/feedback/list?message=Feedback submitted successfully');
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).render('error', { error: 'Failed to save feedback' });
  }
});

router.post('/feedback/upload', isAuthenticated, upload.single('csvFile'), async (req, res) => {
  console.log('Entering /feedback/upload route');
  console.log('Uploaded file:', req.file);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const results = [];
  let headers = null;
  fs.createReadStream(req.file.path)
    .pipe(parse())
    .on('data', (data) => {
      if (!headers) {
        headers = data;
      } else {
        results.push(data);
      }
    })
    .on('end', async () => {
      console.log('CSV parsing completed. Total rows:', results.length);
      try {
        for (let row of results) {
          const feedback = {};
          headers.forEach((header, index) => {
            feedback[header.toLowerCase().replace(/\s+/g, '')] = row[index];
          });
          console.log('Processing row:', feedback);
          const newFeedback = new Feedback({
            date: new Date(feedback.date),
            customerName: feedback.customername,
            product: feedback.product,
            feedbackText: feedback.feedback,
            user: req.session.userId
          });
          await newFeedback.save();
          console.log('Feedback saved successfully');
        }
        fs.unlinkSync(req.file.path); // Delete the uploaded file
        console.log('CSV processing completed. Redirecting to feedback list.');
        res.redirect('/feedback/list?message=CSV uploaded successfully');
      } catch (error) {
        console.error('Error processing CSV:', error);
        console.error('Error stack:', error.stack);
        res.status(500).send('Failed to process CSV file');
      }
    });
});

router.get('/feedback/list', isAuthenticated, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.session.userId }).sort({ date: -1 });
    const message = req.query.message;
    res.render('feedback-list', { feedbacks, message });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).render('error', { error: 'Failed to fetch feedback' });
  }
});

router.get('/feedback/analyze', isAuthenticated, async (req, res) => {
  console.log('Entering /feedback/analyze route');
  try {
    const feedbacks = await Feedback.find({ user: req.session.userId }).sort({ date: -1 });
    const user = await User.findById(req.session.userId);
    console.log('User found:', user);
    console.log('User predefinedAspects:', user.predefinedAspects);
    console.log('User customAspects:', user.customAspects);
    const predefinedEmotions = emotions;
    const customEmotions = user.customEmotions || [];
    res.render('feedback-analyze', {
      feedbacks,
      emotions: predefinedEmotions,
      customEmotions,
      predefinedAspects: user.predefinedAspects || [],
      customAspects: user.customAspects || []
    });
    console.log('Rendered feedback-analyze view');
  } catch (error) {
    console.error('Error fetching feedback for analysis:', error);
    res.status(500).render('error', { error: 'Failed to fetch feedback for analysis' });
  }
});

router.post('/feedback/add-custom-emotion', isAuthenticated, async (req, res) => {
  console.log('Received request to add custom emotion');
  try {
    const { emotion } = req.body;
    console.log('Emotion to add:', emotion);
    const userId = req.session.userId;
    console.log('User ID:', userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.customEmotions) {
      user.customEmotions = [];
    }

    if (user.customEmotions.length >= 5) {
      user.customEmotions.shift(); // Remove the first element
    }

    user.customEmotions.push(emotion);
    await user.save();
    console.log('Custom emotions after adding:', user.customEmotions);

    res.status(200).json({ message: 'Custom emotion added successfully', emotions: user.customEmotions });
  } catch (error) {
    console.error('Error adding custom emotion:', error);
    res.status(500).json({ error: 'Failed to add custom emotion' });
  }
});

router.post('/feedback/add-custom-aspect', isAuthenticated, async (req, res) => {
  try {
    const { aspect } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user.customAspects) {
      user.customAspects = [];
    }

    if (user.customAspects.length >= 5) {
      user.customAspects.shift(); // Remove the first element
    }

    user.customAspects.push(aspect);
    await user.save();

    res.json({ success: true, aspects: user.customAspects });
  } catch (error) {
    console.error('Error adding custom aspect:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/feedback/analyze', isAuthenticated, async (req, res) => {
  try {
    const { selectedFeedbackIds, selectedEmotions, selectedAspects } = req.body;

    if (!selectedFeedbackIds || selectedFeedbackIds.length === 0) {
      return res.status(400).json({ error: 'No feedback selected for analysis' });
    }

    const feedbacks = await Feedback.find({ _id: { $in: selectedFeedbackIds } });

    if (feedbacks.length === 0) {
      return res.status(404).json({ error: 'No matching feedback found' });
    }

    const user = await User.findById(req.session.userId);
    if (!user || !user.openaiApiKey) {
      return res.status(400).json({ error: 'OpenAI API key not found' });
    }

    const analysisResults = await Promise.all(feedbacks.map(async (feedback) => {
      if (!feedback.analysis) {
        try {
          const analysis = await analyzeFeedback(feedback.feedbackText, req.session.userId, user.openaiApiKey);
          feedback.analysis = analysis;
          await feedback.save();
        } catch (error) {
          console.error(`Error analyzing feedback ${feedback._id}:`, error);
          return {
            customerName: feedback.customerName,
            date: feedback.date,
            product: feedback.product,
            feedbackText: feedback.feedbackText,
            analysis: { error: 'Analysis failed' }
          };
        }
      }
      return {
        customerName: feedback.customerName,
        date: feedback.date,
        product: feedback.product,
        feedbackText: feedback.feedbackText,
        analysis: feedback.analysis
      };
    }));

    const summary = await generateSummary(analysisResults.map(result => result.analysis), user.openaiApiKey, selectedEmotions, selectedAspects);

    res.json({
      success: true,
      results: {
        summary,
        detailedAnalysis: analysisResults
      }
    });
  } catch (error) {
    console.error('Error during analysis:', error);
    console.error('Error stack:', error.stack);

    let errorMessage = 'An error occurred during analysis';
    if (error.message.includes('Incorrect API key provided')) {
      errorMessage = 'Invalid OpenAI API key. Please update your API key in your profile.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

module.exports = router;