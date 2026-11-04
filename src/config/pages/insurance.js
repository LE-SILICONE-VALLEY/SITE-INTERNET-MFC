const insurancePages = {
  pages: {
    particulier: {
      "3eme-pilier": {
        title: "Votre 3ᵉ pilier, à votre mesure.",
        hero: {
          subtitle: "Un projet d’épargne mérite un conseil qui part de vous.",
          description: "Commencer à épargner, préparer votre retraite, comprendre les questions fiscales ou examiner un contrat existant : nous prenons le temps de clarifier votre situation et vos objectifs avant d’étudier les options.",
          ctaText: "Faire mon bilan guidé",
          path: "/?parcours=pillar",
          image: { src: "/about-mission.jpg.jpg", alt: "Les rives de Genève et le lac Léman dans une lumière douce" }
        },
        comparator: {
          title: "Votre projet avant le choix du contrat.",
          description: "Votre budget, votre horizon et vos besoins de disponibilité donnent le point de départ. Christian vous accompagne pour examiner les frais, les garanties, les conditions et le niveau de risque des solutions envisagées.",
          points: ["Clarifier vos objectifs et votre budget", "Examiner les contrats que vous avez déjà", "Identifier les questions fiscales à vérifier selon votre statut"],
          ctaText: "Parler de mon 3ᵉ pilier avec Christian",
          action: "whatsapp",
          subject: "Bonjour Christian, j’aimerais faire le point sur mon 3e pilier.",
          image: { src: "/conseiller-geneve.jpg", alt: "Deux personnes échangent autour d’un ordinateur" }
        },
        complements: {
          title: "Les bonnes questions, dès le départ.",
          description: "Un échange pour comprendre les possibilités et les points à examiner avant de prendre une décision.",
          items: [{ label: "Vos objectifs", icon: "Target" }, { label: "Votre horizon", icon: "Calendar" }, { label: "Votre budget", icon: "Wallet" }, { label: "Les conditions du contrat", icon: "FileText" }]
        }
      },
      "assurance-maladie": {
        title: "Assurance Maladie LAMal",
        hero: {
          subtitle:
            "Faites le point sur votre assurance maladie à Genève et dans le canton de Vaud.",
          description:
            "L'assurance de base est obligatoire, mais votre prime ne devrait pas être une fatalité. Nos experts analysent votre situation pour trouver la caisse, le modèle (médecin de famille, Telmed...) et la franchise qui vous feront réellement économiser, tout en préservant votre accès aux soins.",
          ctaText: "Comparer mon Offre",
          path: "/comparateur/assurance-maladie", // Lien vers le comparateur
          image: {
            src: "/insurance-hero.jpg", // <= ajoute l'image
            alt: "Genève et le Jet d’eau au bord du lac Léman",
          },
        },
        comparator: {
          title: "Votre comparaison LAMal personnalisée",
          description:
            "Ne vous contentez pas des comparateurs en ligne génériques. Nous allons plus loin en vous fournissant une analyse commentée et des conseils sur-mesure pour faire le meilleur choix.",
          points: [
            "Analyse de toutes les caisses suisses",
            "Optimisation franchise et modèle",
            "Conseil sur les complémentaires indispensables",
          ],
          ctaText: "Comparer les primes", // Texte mis à jour
          path: "/comparateur/assurance-maladie", // Lien vers le comparateur
          image: {
            src: "/conseiller-geneve.jpg", // <= même image ici (ou remplace si tu veux un autre visuel)
            alt: "Échange autour d’un ordinateur dans un espace de travail",
          },
        },
        complements: {
          title: "Les Complémentaires (LCA) qui changent tout",
          description:
            "La LAMal ne couvre pas tout. Construisez une protection santé en béton avec les bonnes assurances complémentaires.",
          items: [
            { label: "Médecines douces", icon: "Leaf" },
            { label: "Soins dentaires", icon: "Smile" },
            { label: "Division privée/mi-privée", icon: "BedDouble" },
            { label: "Fitness & Prévention", icon: "HeartPulse" },
            { label: "Lunettes & Lentilles", icon: "Glasses" },
            { label: "Transports d'urgence", icon: "Ambulance" },
            { label: "Psychothérapie", icon: "BrainCircuit" },
            { label: "Voyages & Rapatriement", icon: "Plane" },
          ],
        },
      },
    },
    entreprise: {
      // Pages pour les entreprises
    },
  },
};

export default insurancePages;
