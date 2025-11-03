export function loadContact() {
  const content = document.getElementById('content');
  
  // Vider le contenu existant
  content.innerHTML = '';
  
  // Créer le conteneur de contact
  const contactDiv = document.createElement('div');
  contactDiv.className = 'contact-page';
  
  // Titre
  const title = document.createElement('h1');
  title.textContent = 'Contactez-nous';
  contactDiv.appendChild(title);
  
  // Sous-titre
  const subtitle = document.createElement('p');
  subtitle.className = 'contact-subtitle';
  subtitle.textContent = 'Nous serions ravis de vous accueillir. Réservez votre table dès maintenant !';
  contactDiv.appendChild(subtitle);
  
  // Conteneur pour les infos
  const infoContainer = document.createElement('div');
  infoContainer.className = 'contact-info';
  
  // Adresse
  const addressSection = createContactSection(
    '📍 Adresse',
    ['Sonfonia Centre', '224 Ratoma, Guinée']
  );
  infoContainer.appendChild(addressSection);
  
  // Téléphone
  const phoneSection = createContactSection(
    '📞 Téléphone',
    ['+224624712274', 'Réservations ouvertes de 10h à 20h']
  );
  infoContainer.appendChild(phoneSection);
  
  // Email
  const emailSection = createContactSection(
    '✉️ Email',
    ['abdoulayebangs2@gmail.com', 'Réponse sous 24h']
  );
  infoContainer.appendChild(emailSection);
  
  // Horaires
  const hoursSection = createContactSection(
    '🕒 Horaires d\'ouverture',
    [
      'Mardi - Samedi : 12h00 - 14h30 et 19h00 - 22h30',
      'Dimanche : 12h00 - 15h00',
      'Fermé le lundi'
    ]
  );
  infoContainer.appendChild(hoursSection);
  
  contactDiv.appendChild(infoContainer);
  
  // Formulaire de réservation
  const formTitle = document.createElement('h2');
  formTitle.textContent = 'Réserver une table';
  formTitle.style.marginTop = '2rem';
  contactDiv.appendChild(formTitle);
  
  const form = document.createElement('form');
  form.className = 'reservation-form';
  
  // Nom
  const nameInput = createFormField('text', 'name', 'Votre nom');
  form.appendChild(nameInput);
  
  // Email
  const emailInput = createFormField('email', 'email', 'Votre email');
  form.appendChild(emailInput);
  
  // Téléphone
  const phoneInput = createFormField('tel', 'phone', 'Votre téléphone');
  form.appendChild(phoneInput);
  
  // Date
  const dateInput = createFormField('date', 'date', 'Date de réservation');
  form.appendChild(dateInput);
  
  // Nombre de personnes
  const guestsInput = createFormField('number', 'guests', 'Nombre de personnes');
  form.appendChild(guestsInput);
  
  // Message
  const messageGroup = document.createElement('div');
  messageGroup.className = 'form-group';
  const messageLabel = document.createElement('label');
  messageLabel.textContent = 'Message (optionnel)';
  const messageTextarea = document.createElement('textarea');
  messageTextarea.name = 'message';
  messageTextarea.rows = 4;
  messageTextarea.placeholder = 'Demandes spéciales, allergies...';
  messageGroup.appendChild(messageLabel);
  messageGroup.appendChild(messageTextarea);
  form.appendChild(messageGroup);
  
  // Bouton de soumission
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Réserver';
  submitBtn.className = 'submit-btn';
  form.appendChild(submitBtn);
  
  // Empêcher la soumission réelle du formulaire
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci pour votre réservation ! Nous vous contacterons bientôt.');
    form.reset();
  });
  
  contactDiv.appendChild(form);
  
  // Ajouter tout au conteneur principal
  content.appendChild(contactDiv);
}

function createContactSection(title, lines) {
  const section = document.createElement('div');
  section.className = 'contact-section';
  
  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = title;
  section.appendChild(sectionTitle);
  
  lines.forEach(line => {
    const p = document.createElement('p');
    p.textContent = line;
    section.appendChild(p);
  });
  
  return section;
}

function createFormField(type, name, placeholder) {
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const label = document.createElement('label');
  label.textContent = placeholder;
  label.setAttribute('for', name);
  
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = name;
  input.placeholder = placeholder;
  input.required = true;
  
  if (type === 'number') {
    input.min = '1';
    input.max = '20';
  }
  
  group.appendChild(label);
  group.appendChild(input);
  
  return group;
}
