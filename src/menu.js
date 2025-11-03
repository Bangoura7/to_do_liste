export function loadMenu() {
  const content = document.getElementById('content');
  
  // Vider le contenu existant
  content.innerHTML = '';
  
  // Créer le conteneur du menu
  const menuDiv = document.createElement('div');
  menuDiv.className = 'menu-page';
  
  // Titre de la page
  const title = document.createElement('h1');
  title.textContent = 'Notre Menu';
  menuDiv.appendChild(title);
  
  // Sous-titre
  const subtitle = document.createElement('p');
  subtitle.className = 'menu-subtitle';
  subtitle.textContent = 'Savourez l\'authenticité de la cuisine guinéenne';
  menuDiv.appendChild(subtitle);
  
  // Entrées
  const startersSection = createMenuSection(
    'Entrées',
    [
      { name: 'Salade d\'arachide', description: 'Salade fraîche avec sauce arachide traditionnelle', price: '25 000 GNF' },
      { name: 'Beignets', description: 'Beignets dorés croustillants, servis chauds', price: '15 000 GNF' },
      { name: 'Accara', description: 'Beignets de haricots épicés', price: '20 000 GNF' },
      { name: 'Brochettes de poulet', description: 'Poulet mariné aux épices guinéennes, grillé', price: '30 000 GNF' }
    ]
  );
  menuDiv.appendChild(startersSection);
  
  // Plats principaux
  const mainsSection = createMenuSection(
    'Plats Principaux',
    [
      { name: 'Riz au gras', description: 'Riz cuit dans une sauce tomate riche avec viande et légumes', price: '50 000 GNF' },
      { name: 'Sauce feuille avec foutou', description: 'Feuilles de manioc pilées, servies avec foutou de banane plantain', price: '45 000 GNF' },
      { name: 'Poulet Yassa', description: 'Poulet mariné aux oignons et citron, servi avec riz blanc', price: '55 000 GNF' },
      { name: 'Mafé', description: 'Ragoût à la pâte d\'arachide avec viande et légumes, servi avec riz', price: '50 000 GNF' },
      { name: 'Tô avec sauce gombo', description: 'Pâte de maïs ou de mil servie avec sauce gombo traditionnelle', price: '40 000 GNF' },
      { name: 'Poisson braisé', description: 'Poisson frais grillé avec sauce pimentée et attieké', price: '60 000 GNF' }
    ]
  );
  menuDiv.appendChild(mainsSection);
  
  // Desserts
  const dessertsSection = createMenuSection(
    'Desserts & Boissons',
    [
      { name: 'Bananes plantains frites', description: 'Bananes plantains mûres, frites et sucrées', price: '15 000 GNF' },
      { name: 'Gâteau de patate douce', description: 'Douceur traditionnelle à base de patate douce', price: '20 000 GNF' },
      { name: 'Jus de gingembre', description: 'Jus de gingembre frais maison', price: '12 000 GNF' },
      { name: 'Jus de bissap', description: 'Boisson rafraîchissante à base d\'hibiscus', price: '10 000 GNF' },
      { name: 'Jus de tamarin', description: 'Jus naturel de tamarin', price: '10 000 GNF' }
    ]
  );
  menuDiv.appendChild(dessertsSection);
  
  // Ajouter tout au conteneur principal
  content.appendChild(menuDiv);
}

function createMenuSection(sectionTitle, items) {
  const section = document.createElement('div');
  section.className = 'menu-section';
  
  const title = document.createElement('h2');
  title.textContent = sectionTitle;
  section.appendChild(title);
  
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'menu-items';
  
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';
    
    const itemHeader = document.createElement('div');
    itemHeader.className = 'menu-item-header';
    
    const itemName = document.createElement('h3');
    itemName.textContent = item.name;
    
    const itemPrice = document.createElement('span');
    itemPrice.className = 'price';
    itemPrice.textContent = item.price;
    
    itemHeader.appendChild(itemName);
    itemHeader.appendChild(itemPrice);
    
    const itemDescription = document.createElement('p');
    itemDescription.textContent = item.description;
    
    itemDiv.appendChild(itemHeader);
    itemDiv.appendChild(itemDescription);
    itemsContainer.appendChild(itemDiv);
  });
  
  section.appendChild(itemsContainer);
  return section;
}
