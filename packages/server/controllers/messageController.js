const Message = require('../models/Message');

const list = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 50, 1);

    const [messages, total] = await Promise.all([
      // Paged newest-first (so "page 2" means "the next 50 older messages"),
      // then reversed below so the response itself reads oldest-to-newest.
      Message.find({ roomId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name avatar'),
      Message.countDocuments({ roomId }),
    ]);

    const chronological = messages.reverse().map((message) => ({
      _id: message._id,
      roomId: message.roomId,
      userId: message.userId?._id,
      text: message.text,
      isSystemMessage: message.isSystemMessage,
      user: message.userId ? { _id: message.userId._id, name: message.userId.name, avatar: message.userId.avatar } : null,
      createdAt: message.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: chronological,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { list };
