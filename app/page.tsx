import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Aplicación de Notas</h1>
        <p className="text-gray-300 mb-8">
          Una aplicación simple y elegante para tomar notas
        </p>
        <Link
          href="/notes"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Ver Notas
        </Link>
      </div>
    </div>
  );
}
