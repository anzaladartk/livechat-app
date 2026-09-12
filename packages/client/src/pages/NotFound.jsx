import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600">This page doesn&apos;t exist.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go home
      </Link>
    </div>
  );
}
