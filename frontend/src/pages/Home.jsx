import { Truck } from 'lucide-react';

const Home = () => {

  return (
    <div className="animate-fade-in">
      {/* Hero Image - Placeholder pour l'instant */}
      <section className="relative h-[70vh] min-h-[500px] bg-gray-200">
        <img 
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&h=900&fit=crop" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        {/* On gardera cette section pour ajouter l'image plus tard */}
      </section>

      {/* Info Livraison - Discrète */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Truck className="w-4 h-4" />
            <span>Livraison rapide dans toute la Tunisie en 2-5 jours</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;

