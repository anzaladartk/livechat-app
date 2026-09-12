export default function LoadingSpinner({ fullScreen = false }) {
  const spinner = (
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
  );

  if (!fullScreen) return spinner;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {spinner}
    </div>
  );
}
