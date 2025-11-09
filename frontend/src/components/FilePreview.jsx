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

  // Détecte si c'est un PDF via l'extension ou le type MIME dans l'URL
  const isPDF = src.toLowerCase().endsWith('.pdf') || src.includes('/upload/') && src.includes('.pdf');

  if (isPDF) {
    // Affichage pour les PDFs
    return (
      <div 
        className={`bg-gray-100 border-2 border-gray-300 rounded flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors ${className}`}
        onClick={onClick}
        {...props}
      >
        <FileText className="w-12 h-12 text-red-600" />
        <span className="text-xs text-gray-600 font-medium">PDF</span>
        {onClick && (
          <span className="text-xs text-blue-600 underline">Cliquer pour ouvrir</span>
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
    />
  );
};

export default FilePreview;

