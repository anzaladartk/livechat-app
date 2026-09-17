const Message = require('../../models/Message');
const Room = require('../../models/Room');
const User = require('../../models/User');

const MAX_MESSAGE_LENGTH = 1000;

// Socket payloads never pass through express-validator, so this is the
// actual enforcement point for the message length cap — not just a UX nicety
// on the client.
const registerMessageEvents = (io, socket) => {
  socket.on('sendMessage', async ({ roomId, text } = {}) => {
    try {
      if (!roomId || typeof text !== 'string' || !text.trim()) {
        return socket.emit('error', { message: 'Message text is required' });
      }

      // Being logged in isn't the same as being a member of THIS room —
      // without this check, any authenticated user could post into any room.
      const room = await Room.findById(roomId);
      if (!room || !room.members.some((id) => id.toString() === socket.userId)) {
        return socket.emit('error', { message: 'You must join this room first' });
      }

      const trimmed = text.trim();
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        return socket.emit('error', { message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
      }

      // Author comes from the authenticated socket, never a client-supplied
      // userId field — otherwise anyone could send messages as anyone else.
      const message = await Message.create({ roomId, userId: socket.userId, text: trimmed });
      const user = await User.findById(socket.userId, 'name avatar');

      // Broadcasts to the whole room INCLUDING the sender — the client never
      // renders its own message optimistically, only when this echo arrives.
      io.to(roomId).emit('messageReceived', {
        _id: message._id,
        roomId: message.roomId,
        text: message.text,
        isSystemMessage: false,
        user: { _id: user._id, name: user.name, avatar: user.avatar },
        createdAt: message.createdAt,
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
};

module.exports = registerMessageEvents;
