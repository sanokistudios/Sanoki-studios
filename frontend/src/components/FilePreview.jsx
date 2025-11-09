import { FileText } from 'lucide-react';

/**
 * Composant pour afficher une image ou un PDF
 * Détecte automatiquement le type de fichier via l'extension de l'URL
 */
const FilePreview = ({ src, alt = '', className = '', onClick, ...props }) => {
  if (!src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Pas de fichier</span>
      </div>
    );
  }

  // Détecte si c'est un PDF via l'extension ou le type MIME dans l'URL Cloudinary
  const isPDF = src.toLowerCase().includes('.pdf') || 
                src.includes('image/upload/') && src.match(/\.(pdf)($|\?)/i);

  if (isPDF) {
    // Affichage pour les PDFs
    return (
      <div 
        className={`bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded flex flex-col items-center justify-center gap-2 cursor-pointer hover:from-red-100 hover:to-red-200 transition-all ${className}`}
        onClick={onClick}
        {...props}
      >
        <FileText className="w-16 h-16 text-red-600" strokeWidth={1.5} />
        <span className="text-sm text-red-800 font-bold">PDF</span>
        {onClick && (
          <span className="text-xs text-red-600 underline">Cliquer pour ouvrir</span>
        )}
      </div>
    );
  }

  // Affichage normal pour les images
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      {...props}
      onError={(e) => {
        // Si l'image ne charge pas, vérifier si c'est un PDF déguisé
        if (src.toLowerCase().includes('.pdf')) {
          e.target.style.display = 'none';
          const parent = e.target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded flex flex-col items-center justify-center gap-2 cursor-pointer ${className}">
                <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span class="text-sm text-red-800 font-bold">PDF</span>
                <span class="text-xs text-red-600 underline">Cliquer pour ouvrir</span>
              </div>
            `;
          }
        }
      }}
    />
  );
};

export default FilePreview;

