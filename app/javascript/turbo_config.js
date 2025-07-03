// Configuration Turbo pour des mises à jour plus rapides
import { Turbo } from "@hotwired/turbo-rails"

// Réduire le délai de debounce pour les actions rapides
Turbo.setProgressBarDelay(0)

// Configuration pour des réponses plus rapides
document.addEventListener('DOMContentLoaded', function () {
  // Pré-charger les styles pour éviter les reflows
  const style = document.createElement('style');
  style.textContent = `
    .turbo-progress-bar {
      height: 2px;
      background-color: #007bff;
    }
    #emails, #selected_email {
      transition: opacity 0.1s ease-in-out;
    }
  `;
  document.head.appendChild(style);
});
