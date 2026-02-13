import { X, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

interface ValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  errors: { field: string; message: string }[];
}

export default function ValidationDialog({ isOpen, onClose, errors }: ValidationDialogProps) {
  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp overflow-hidden">
        {/* Header avec gradient bleu */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Champs obligatoires
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-600 mb-4 text-sm font-medium">
            Oups ! Il manque quelques informations.
          </p>
          <p className="text-gray-500 mb-4 text-xs">
            Les champs marqués en rouge dans le formulaire doivent être remplis pour continuer :
          </p>
          
          {/* Liste des erreurs */}
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {errors.map((error, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {error.field}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            J'ai compris
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
