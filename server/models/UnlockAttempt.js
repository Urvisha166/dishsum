const mongoose = require('mongoose');

const unlockAttemptSchema = new mongoose.Schema(
  {
    password: { type: String, required: true },
    success: { type: Boolean, required: true },
    userAgent: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.models.UnlockAttempt || mongoose.model('UnlockAttempt', unlockAttemptSchema);
