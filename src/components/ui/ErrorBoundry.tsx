import { ReactNode } from 'react';

export default function ErrorBoundary({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : 'Something went wrong.';
  return (
    <div className="p-6 rounded-md border border-red-300 bg-red-50 text-red-700">
      <h2 className="font-semibold mb-1">Oops!</h2>
      <p className="text-sm">{msg}</p>
    </div>
  );
}
