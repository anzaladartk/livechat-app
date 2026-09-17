import Navbar from './Navbar';
import Toasts from './Toasts';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Navbar />
      {/* overflow-hidden so a chat page's own scroll region (messages) can
          be independent of a fixed, pinned message input below it. */}
      <main className="flex-1 overflow-hidden">{children}</main>
      <Toasts />
    </div>
  );
}
