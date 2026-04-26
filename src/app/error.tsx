'use client';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-accent mb-4">500</h1>
          <p className="text-gray-600">Une erreur s&apos;est produite</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold mb-6">Je suis la page 500</h2>
          <p className="text-gray-600">Erreur serveur interne...</p>
        </div>
      </div>
    </div>
  );
}

