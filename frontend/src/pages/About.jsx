import { Heart, Target, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">À Propos de Nous</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Une marque tunisienne passionnée par la création de vêtements
            de qualité qui allient style, confort et authenticité.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Notre Histoire</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              Fondée avec passion en Tunisie, notre marque est née d'une vision simple :
              créer des vêtements qui racontent une histoire et reflètent l'identité
              de ceux qui les portent.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Chaque t-shirt, chaque pièce de notre collection est pensée avec soin,
              du choix des matières au design final. Nous croyons que la mode doit être
              accessible, authentique et durable.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Aujourd'hui, nous sommes fiers de proposer des créations qui marient
              l'esprit tunisien à des tendances modernes, pour un style unique et
              intemporel.
            </p>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Passion</h3>
              <p className="text-gray-600">
                Chaque création est faite avec amour et dévouement
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                Nous visons la perfection dans chaque détail
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Communauté</h3>
              <p className="text-gray-600">
                Nous créons pour et avec notre communauté
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualité</h3>
              <p className="text-gray-600">
                Des produits durables et confortables
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre engagement */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Notre Engagement</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span className="text-gray-600">
                  <strong>Qualité premium :</strong> Nous sélectionnons rigoureusement
                  nos matières pour garantir confort et durabilité.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span className="text-gray-600">
                  <strong>Production locale :</strong> Nos produits sont conçus et
                  fabriqués en Tunisie, soutenant l'économie locale.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span className="text-gray-600">
                  <strong>Design unique :</strong> Chaque collection reflète notre
                  identité et notre créativité.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-xl">✓</span>
                <span className="text-gray-600">
                  <strong>Service client :</strong> Votre satisfaction est notre
                  priorité, nous sommes toujours à votre écoute.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

