import { formatRelativeDate } from '../../utils/formatDate';

export default function RoomCard({ room, onJoin, onLeave }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="font-semibold text-gray-900">{room.name}</h3>
        {room.description && <p className="text-sm text-gray-500">{room.description}</p>}
        <p className="mt-1 text-xs text-gray-400">
          {room.memberCount} member{room.memberCount === 1 ? '' : 's'} · created {formatRelativeDate(room.createdAt)}
        </p>
      </div>

      {room.isMember ? (
        <button
          onClick={() => onLeave(room)}
          className="whitespace-nowrap rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Leave
        </button>
      ) : (
        <button
          onClick={() => onJoin(room)}
          className="whitespace-nowrap rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
        >
          Join
        </button>
      )}
    </div>
  );
}
