export function loadAbout() {
  const content = document.getElementById('content');
  
  // Vider le contenu existant
  content.innerHTML = '';
  
  // Créer le conteneur À propos
  const aboutDiv = document.createElement('div');
  aboutDiv.className = 'about-page';
  
  // Titre
  const title = document.createElement('h1');
  title.textContent = 'À Propos de Nous';
  aboutDiv.appendChild(title);
  
  // Image du restaurant
  const image = document.createElement('img');
  image.src = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800';
  image.alt = 'Notre équipe';
  image.className = 'about-image';
  aboutDiv.appendChild(image);
  
  // Notre histoire
  const historySection = document.createElement('div');
  historySection.className = 'about-section';
  
  const historyTitle = document.createElement('h2');
  historyTitle.textContent = 'Notre Histoire';
  historySection.appendChild(historyTitle);
  
  const historyText = document.createElement('p');
  historyText.textContent = 'Fondé en 1995 par le Chef Bangoura Abdoulaye, Le Bangs est né d\'une passion pour la cuisine Guinéenne authentique et innovante. Depuis plus de 25 ans, nous nous engageons à offrir à nos clients une expérience gastronomique exceptionnelle dans un cadre élégant et chaleureux.';
  historySection.appendChild(historyText);
  
  aboutDiv.appendChild(historySection);
  
  // Notre philosophie
  const philosophySection = document.createElement('div');
  philosophySection.className = 'about-section';
  
  const philosophyTitle = document.createElement('h2');
  philosophyTitle.textContent = 'Notre Philosophie';
  philosophySection.appendChild(philosophyTitle);
  
  const philosophyText = document.createElement('p');
  philosophyText.textContent = 'Nous croyons fermement en l\'utilisation d\'ingrédients frais et locaux. Chaque saison apporte son lot de saveurs uniques que notre chef met en valeur avec créativité et respect des traditions culinaires françaises. Notre menu évolue au fil des saisons pour vous garantir des produits toujours au sommet de leur qualité.';
  philosophySection.appendChild(philosophyText);
  
  aboutDiv.appendChild(philosophySection);
  
  // Notre équipe
  const teamSection = document.createElement('div');
  teamSection.className = 'about-section';
  
  const teamTitle = document.createElement('h2');
  teamTitle.textContent = 'Notre Équipe';
  teamSection.appendChild(teamTitle);
  
  const teamText = document.createElement('p');
  teamText.textContent = 'Notre équipe passionnée est composée de professionnels dévoués qui partagent l\'amour de la gastronomie. Du chef aux serveurs, chacun contribue à créer une atmosphère unique et à vous offrir un service impeccable.';
  teamSection.appendChild(teamText);
  
  aboutDiv.appendChild(teamSection);
  
  // Nos valeurs
  const valuesSection = document.createElement('div');
  valuesSection.className = 'about-section';
  
  const valuesTitle = document.createElement('h2');
  valuesTitle.textContent = 'Nos Valeurs';
  valuesSection.appendChild(valuesTitle);
  
  const valuesList = document.createElement('ul');
  valuesList.className = 'values-list';
  
  const values = [
    'Excellence culinaire et créativité',
    'Ingrédients frais et locaux de qualité',
    'Service attentionné et personnalisé',
    'Engagement envers la durabilité',
    'Respect des traditions françaises'
  ];
  
  values.forEach(value => {
    const li = document.createElement('li');
    li.textContent = value;
    valuesList.appendChild(li);
  });
  
  valuesSection.appendChild(valuesList);
  aboutDiv.appendChild(valuesSection);
  
  // Ajouter tout au conteneur principal
  content.appendChild(aboutDiv);
}
