const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
    description: { type: String, trim: true, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    memberCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

roomSchema.index({ createdAt: -1 });
roomSchema.index({ memberCount: -1 });
roomSchema.index({ name: 'text' });

module.exports = mongoose.model('Room', roomSchema);
