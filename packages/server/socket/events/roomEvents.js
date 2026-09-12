const Room = require('../../models/Room');

// joinRoom/leaveRoom only subscribe/unsubscribe this socket to live updates —
// they never touch the database. Room membership changes (who's actually a
// member, join/leave system messages) are handled exclusively by the REST
// endpoints in roomController, so a page refresh or reconnect never spams a
// duplicate "joined the room" message.
const registerRoomEvents = (io, socket) => {
  socket.on('joinRoom', async ({ roomId } = {}) => {
    if (!roomId) return;
    socket.join(roomId);

    try {
      const room = await Room.findById(roomId).populate('members', 'name avatar');
      if (room) {
        socket.emit('roomMembersList', room.members);
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to load room members' });
    }
  });

  socket.on('leaveRoom', ({ roomId } = {}) => {
    if (!roomId) return;
    socket.leave(roomId);
  });
};

module.exports = registerRoomEvents;
