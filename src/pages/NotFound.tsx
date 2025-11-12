import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Page introuvable</h1>
          <p className="text-gray-600">
            Oups ! La page que vous recherchez n'existe pas ou a été déplacée. Veuillez suivre les instructions et revenir à la page de connexion pour accéder à l'application.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Retourner à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
