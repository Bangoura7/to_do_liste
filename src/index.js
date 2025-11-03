import './styles.css';
import { loadHome } from './home.js';
import { loadMenu } from './menu.js';
import { loadAbout } from './about.js';
import { loadContact } from './contact.js';

console.log('Restaurant page loaded!');

// Fonction pour gérer l'état actif des boutons
function setActiveButton(buttonId) {
  // Retirer la classe active de tous les boutons
  const buttons = document.querySelectorAll('nav button');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Ajouter la classe active au bouton cliqué
  const activeButton = document.getElementById(buttonId);
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

// Configuration de la navigation
function setupNavigation() {
  // Bouton Accueil
  const homeBtn = document.getElementById('home-btn');
  homeBtn.addEventListener('click', () => {
    loadHome();
    setActiveButton('home-btn');
  });
  
  // Bouton Menu
  const menuBtn = document.getElementById('menu-btn');
  menuBtn.addEventListener('click', () => {
    loadMenu();
    setActiveButton('menu-btn');
  });
  
  // Bouton À propos
  const aboutBtn = document.getElementById('about-btn');
  aboutBtn.addEventListener('click', () => {
    loadAbout();
    setActiveButton('about-btn');
  });
  
  // Bouton Contact
  const contactBtn = document.getElementById('contact-btn');
  contactBtn.addEventListener('click', () => {
    loadContact();
    setActiveButton('contact-btn');
  });
}

// Charger la page d'accueil au démarrage
loadHome();
setActiveButton('home-btn');

// Configurer la navigation
setupNavigation();
