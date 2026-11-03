const nav = {
  navItems: [
    { label: 'Accueil', path: '/' },
    { label: 'LAMal', path: '/comparaison-lamal' },
    { label: '3ᵉ pilier', path: '/assurances/particulier/3eme-pilier' },
    { label: 'Impôts', path: '/declaration-impots' },
    { 
      label: 'Assurances',
      isMegaMenu: true,
      dropdown: [
        {
          title: 'PARTICULIERS',
          links: [
            { label: 'Assurance automobile', path: '/assurances/particulier/assurance-automobile' }, 
            { label: 'RC privée', path: '/assurances/particulier/rc-privee' },
            { label: 'Protection juridique', path: '/assurances/particulier/protection-juridique' }, 
            { label: 'Assurance ménage', path: '/assurances/particulier/assurance-menage' }
          ]
        },
        {
          title: 'ENTREPRISES',
          links: [
            { label: 'RC professionnelle', path: '/assurances/entreprise/rc-professionnelle' }, 
            { label: 'Véhicules professionnel', path: '/assurances/entreprise/vehicules-professionnel' }, 
            { label: 'Protection juridique', path: '/assurances/entreprise/protection-juridique' },
            { label: 'Assurance de choses', path: '/assurances/entreprise/assurance-choses' }, 
            { label: 'Assurance de personnes', path: '/assurances/entreprise/assurance-personnes' }, 
            { label: '2ème pilier', path: '/assurances/entreprise/2eme-pilier' }
          ]
        },
        {
          title: 'HABITAT & PROPRIÉTÉ',
          links: [
            { label: 'Assurance bâtiment', path: '/assurances/habitat/assurance-batiment' }, 
            { label: 'Garantie de loyer', path: '/assurances/habitat/garantie-loyer' }
          ]
        },
        {
          title: 'LIENS UTILES',
          links: [
            { label: 'Nos Partenaires', path: '/partenaires' }, 
            { label: 'Rabais collectif', path: '/rabais-collectif' }
          ]
        }
      ]
    },
    { 
      label: 'À propos',
      dropdown: [
        { label: 'Qui sommes-nous ?', path: '/a-propos' },
        { label: 'Engagement local', path: '/engagement' }
      ]
    },
  ],
};

export default nav;