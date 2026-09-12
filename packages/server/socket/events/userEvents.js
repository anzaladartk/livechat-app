// Typing indicators are relay-only, transient UI hints — nothing is persisted.
// socket.to() (not io.to()) deliberately excludes the sender: you don't need
// to see your own "is typing" indicator.
const registerUserEvents = (io, socket) => {
  socket.on('typing', ({ roomId, userName } = {}) => {
    if (!roomId) return;
    socket.to(roomId).emit('userTyping', { userId: socket.userId, userName, roomId });
  });

  socket.on('stopTyping', ({ roomId } = {}) => {
    if (!roomId) return;
    socket.to(roomId).emit('userStoppedTyping', { userId: socket.userId, roomId });
  });
};

module.exports = registerUserEvents;
