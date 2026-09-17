import { useNotificationStore } from '../../store/notificationStore';

export default function Toasts() {
  const notifications = useNotificationStore((state) => state.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`rounded-lg px-4 py-2 text-sm text-white shadow-lg ${n.type === 'error' ? 'bg-red-500' : 'bg-gray-800'}`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
