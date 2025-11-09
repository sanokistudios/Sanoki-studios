import { FileText } from 'lucide-react';

/**
 * Composant pour afficher une image ou un PDF
 * Détecte automatiquement le type de fichier via l'extension de l'URL
 */
const FilePreview = ({ src, alt = '', className = '', onClick, style = {}, ...props }) => {
  if (!src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={style}>
        <span className="text-gray-400 text-sm">Pas de fichier</span>
      </div>
    );
  }

  // Détecte si c'est un PDF - vérification stricte
  const urlLower = src.toLowerCase();
  const isPDF = urlLower.includes('.pdf') || urlLower.includes('pdf');

  if (isPDF) {
    // Affichage pour les PDFs - JAMAIS avec une balise img
    return (
      <div 
        className={`bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded flex flex-col items-center justify-center gap-2 cursor-pointer hover:from-red-100 hover:to-red-200 hover:shadow-lg transition-all ${className}`}
        onClick={onClick || (() => window.open(src, '_blank'))}
        style={style}
        title="Cliquer pour ouvrir le PDF"
        {...props}
      >
        <FileText className="w-12 h-12 text-red-600" strokeWidth={2} />
        <span className="text-xs text-red-800 font-bold">DOCUMENT PDF</span>
        <span className="text-xs text-red-600 underline">Cliquer pour ouvrir</span>
      </div>
    );
  }

  // Affichage normal pour les images
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onClick={onClick}
      {...props}
    />
  );
};

export default FilePreview;

