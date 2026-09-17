const Room = require('../../models/Room');

// joinRoom/leaveRoom only subscribe/unsubscribe this socket to live updates —
// they never touch membership itself. Room membership changes (who's actually
// a member, join/leave system messages) are handled exclusively by the REST
// endpoints in roomController, so a page refresh or reconnect never spams a
// duplicate "joined the room" message.
const registerRoomEvents = (io, socket) => {
  socket.on('joinRoom', async ({ roomId } = {}) => {
    if (!roomId) return;

    try {
      const room = await Room.findById(roomId).populate('members', 'name avatar');
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      // Being logged in (the handshake auth) isn't the same as being a
      // member of THIS room — only join a socket to live updates for rooms
      // it's actually a member of.
      const isMember = room.members.some((member) => member._id.toString() === socket.userId);
      if (!isMember) {
        return socket.emit('error', { message: 'You must join this room first' });
      }

      socket.join(roomId);
      socket.emit('roomMembersList', room.members);
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
