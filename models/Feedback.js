const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  feedbackText: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analysis: {
    type: Object,
    default: null
  }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;