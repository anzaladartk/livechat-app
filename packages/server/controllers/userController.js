const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');
const ErrorResponse = require('../utils/errorResponse');

const getProfile = async (req, res, next) => {
  try {
    // Neither count is stored anywhere — both are computed fresh on read.
    const [user, messageCount, roomCount] = await Promise.all([
      User.findById(req.userId),
      Message.countDocuments({ userId: req.userId }),
      Room.countDocuments({ members: req.userId }),
    ]);

    if (!user) return next(new ErrorResponse('User not found', 404));

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        messageCount,
        roomCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.avatar !== undefined) updates.avatar = req.body.avatar;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    if (!user) return next(new ErrorResponse('User not found', 404));

    res.status(200).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
