export function loadHome() {
  const content = document.getElementById('content');
  
  // Vider le contenu existant
  content.innerHTML = '';
  
  // Créer le conteneur de la page d'accueil
  const homeDiv = document.createElement('div');
  homeDiv.className = 'home-page';
  
  // Créer le titre principal
  const title = document.createElement('h1');
  title.textContent = 'Bienvenue au Restaurant Le Bangs';
  homeDiv.appendChild(title);
  
  // Créer l'image
  const image = document.createElement('img');
  image.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
  image.alt = 'Restaurant intérieur';
  image.className = 'hero-image';
  homeDiv.appendChild(image);
  
  // Créer le slogan
  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = 'Une expérience culinaire inoubliable au cœur de la ville';
  homeDiv.appendChild(tagline);
  
  // Créer la description
  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = 'Découvrez notre cuisine raffinée préparée avec des ingrédients frais et locaux. Depuis 1995, nous vous accueillons dans un cadre chaleureux et élégant pour partager des moments gourmands en famille ou entre amis.';
  homeDiv.appendChild(description);
  
  // Créer les horaires
  const hours = document.createElement('p');
  hours.className = 'hours';
  hours.innerHTML = `
    <strong>Horaires d'ouverture :</strong><br>
    Du mardi au samedi : 12h00 - 14h30 et 19h00 - 22h30<br>
    Dimanche : 12h00 - 15h00
  `;
  homeDiv.appendChild(hours);
  
  // Ajouter tout au conteneur principal
  content.appendChild(homeDiv);
}
