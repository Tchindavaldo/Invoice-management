import { Clock, Globe } from 'lucide-react';

export default function Expired() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Clock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Accès au site expiré
          </h1>
          <p className="text-gray-600">
            La version gratuite de l'hébergement Vercel pour cette URL a expiré.
            Le site n'est plus accessible via cette adresse temporaire.
          </p>
          <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4 text-left text-sm text-amber-800 flex gap-3">
            <Globe size={20} className="shrink-0 mt-0.5" />
            <p>
              Pour continuer à utiliser le site, vous devez acheter un nom de
              domaine personnalisé et le configurer pour cette application.
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Veuillez contacter l'administrateur pour rétablir l'accès.
          </p>
        </div>
      </div>
    </div>
  );
}
