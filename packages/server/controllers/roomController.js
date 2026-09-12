const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');
const ErrorResponse = require('../utils/errorResponse');

const broadcastSystemMessage = (req, room, systemMessage, user, event, memberCount) => {
  const io = req.app.get('io');
  if (!io) return; // Not set in tests, which hit the app directly without booting server.js.

  const roomId = room._id.toString();
  io.to(roomId).emit(event, {
    userId: user._id,
    userName: user.name,
    roomId: room._id,
    memberCount,
  });
  io.to(roomId).emit('messageReceived', {
    _id: systemMessage._id,
    roomId: room._id,
    text: systemMessage.text,
    isSystemMessage: true,
    user: { _id: user._id, name: user.name, avatar: user.avatar },
    createdAt: systemMessage.createdAt,
  });
};

const list = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    // A substring/prefix search box (type-to-filter) needs regex, not the
    // $text index — $text only matches whole words, not partial input.
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    const [rooms, total] = await Promise.all([
      Room.find(query)
        .sort({ memberCount: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Room.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: rooms.map((room) => ({
        _id: room._id,
        name: room.name,
        description: room.description,
        memberCount: room.memberCount,
        createdAt: room.createdAt,
        // members is already fetched on each doc (no .select() restricting
        // it), so this costs nothing extra — false for anonymous viewers.
        isMember: req.userId ? room.members.some((id) => id.toString() === req.userId) : false,
      })),
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    // Starts with no members (matches the documented API response) — the
    // frontend follows up with a join call so the creator becomes a member
    // through the same single code path every other member uses.
    const room = await Room.create({ name, description, createdBy: req.userId, members: [], memberCount: 0 });

    res.status(201).json({ success: true, message: 'Room created', data: room });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId).populate('members', 'name avatar');
    if (!room) return next(new ErrorResponse('Room not found', 404));

    res.status(200).json({
      success: true,
      data: {
        _id: room._id,
        name: room.name,
        description: room.description,
        createdBy: room.createdBy,
        members: room.members,
        memberCount: room.memberCount,
        isPrivate: room.isPrivate,
        createdAt: room.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const join = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return next(new ErrorResponse('Room not found', 404));

    const alreadyMember = room.members.some((id) => id.toString() === req.userId);

    if (!alreadyMember) {
      const user = await User.findById(req.userId);

      // members array is the single source of truth; memberCount is always
      // derived from it in the same write, so it can never drift.
      room.members.push(req.userId);
      room.memberCount = room.members.length;
      await room.save();

      const systemMessage = await Message.create({
        roomId: room._id,
        userId: req.userId,
        text: `${user.name} joined the room`,
        isSystemMessage: true,
      });

      broadcastSystemMessage(req, room, systemMessage, user, 'userJoined', room.memberCount);
    }

    res.status(200).json({ success: true, message: 'Joined room successfully', data: { memberCount: room.memberCount } });
  } catch (error) {
    next(error);
  }
};

const leave = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return next(new ErrorResponse('Room not found', 404));

    const wasMember = room.members.some((id) => id.toString() === req.userId);

    if (wasMember) {
      const user = await User.findById(req.userId);

      room.members = room.members.filter((id) => id.toString() !== req.userId);
      room.memberCount = room.members.length;
      await room.save();

      const systemMessage = await Message.create({
        roomId: room._id,
        userId: req.userId,
        text: `${user.name} left the room`,
        isSystemMessage: true,
      });

      broadcastSystemMessage(req, room, systemMessage, user, 'userLeft', room.memberCount);
    }

    res.status(200).json({ success: true, message: 'Left room successfully', data: { memberCount: room.memberCount } });
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, getById, join, leave };
