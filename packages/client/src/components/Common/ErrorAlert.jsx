export default function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700" role="alert">
      {message}
    </div>
  );
}
