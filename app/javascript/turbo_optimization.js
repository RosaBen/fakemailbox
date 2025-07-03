// Optimisation pour la mise à jour instantanée des panneaux avec animations
document.addEventListener('DOMContentLoaded', function () {
  // Intercepter tous les formulaires avec Turbo Stream
  const forms = document.querySelectorAll('form[data-turbo-stream="true"]');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      const isDeleteAction = form.querySelector('[value*="Supprimer"]');
      const selectedEmail = document.getElementById('selected_email');

      if (isDeleteAction && selectedEmail) {
        // Animation de suppression sympa
        selectedEmail.style.transform = 'scale(0.95)';
        selectedEmail.style.opacity = '0.8';
        selectedEmail.style.transition = 'all 0.3s ease-out';

        // Animation de "shake" pour la suppression
        selectedEmail.style.animation = 'deleteShake 0.5s ease-in-out';
      }

      // Ajouter une classe loading pour indiquer le traitement
      const emailsList = document.getElementById('emails');

      if (emailsList) {
        emailsList.style.opacity = '0.7';
        emailsList.style.transition = 'opacity 0.2s ease-in-out';
      }
    });
  });

  // Écouter les événements Turbo Stream pour restaurer l'opacité et ajouter les messages
  document.addEventListener('turbo:stream-render', function (event) {
    const emailsList = document.getElementById('emails');
    const selectedEmail = document.getElementById('selected_email');

    if (emailsList) {
      emailsList.style.opacity = '1';
      // Animation de "slide in" pour la liste mise à jour
      emailsList.style.transform = 'translateX(-10px)';
      emailsList.style.transition = 'all 0.3s ease-out';
      setTimeout(() => {
        emailsList.style.transform = 'translateX(0)';
      }, 50);
    }

    if (selectedEmail) {
      selectedEmail.style.opacity = '1';
      selectedEmail.style.transform = 'scale(1)';
      selectedEmail.style.animation = '';
    }
  });

  // Forcer le rafraîchissement des panneaux après chaque action Turbo
  document.addEventListener('turbo:submit-end', function (event) {
    // Force le navigateur à redessiner les éléments
    requestAnimationFrame(function () {
      const emailsList = document.getElementById('emails');
      if (emailsList) {
        emailsList.style.transform = 'translateZ(0)';
        setTimeout(() => emailsList.style.transform = '', 10);
      }
    });
  });

  // Ajouter les animations CSS dynamiquement
  const style = document.createElement('style');
  style.textContent = `
    @keyframes deleteShake {
      0%, 100% { transform: scale(0.95) translateX(0); }
      25% { transform: scale(0.95) translateX(-5px) rotate(-1deg); }
      75% { transform: scale(0.95) translateX(5px) rotate(1deg); }
    }
    
    @keyframes slideInRight {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeInUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .flash-message {
      animation: slideInRight 0.5s ease-out;
      transition: all 0.3s ease-out;
    }
    
    .flash-message.hiding {
      transform: translateX(100%);
      opacity: 0;
    }
    
    @keyframes emailReceive {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    .receive-email-form {
      display: inline-block;
      position: relative;
    }
    
    .receive-email-btn {
      cursor: pointer;
      transition: background 0.3s ease;
    }
    
    .receive-email-btn:hover {
      background: rgba(0, 123, 255, 0.1);
    }
    
    .celebrating .receive-email-btn {
      animation: emailReceive 0.6s ease-in-out;
    }
  `;
  document.head.appendChild(style);
});

// Fonction pour afficher les messages flash avec animation
function showFlashMessage(message, type = 'success') {
  // Supprimer les anciens messages
  const existingFlash = document.querySelector('.flash-message');
  if (existingFlash) {
    existingFlash.remove();
  }

  const flashDiv = document.createElement('div');
  flashDiv.className = `flash-message flash-${type}`;
  flashDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-weight: 500;
    max-width: 300px;
    word-wrap: break-word;
  `;

  flashDiv.innerHTML = `
    <div style="display: flex; align-items: center;">
      <span style="margin-right: 10px; font-size: 18px;">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(flashDiv);

  // Auto-supprimer après 4 secondes
  setTimeout(() => {
    flashDiv.classList.add('hiding');
    setTimeout(() => {
      if (flashDiv.parentNode) {
        flashDiv.remove();
      }
    }, 300);
  }, 4000);

  // Permettre de fermer en cliquant
  flashDiv.addEventListener('click', () => {
    flashDiv.classList.add('hiding');
    setTimeout(() => {
      if (flashDiv.parentNode) {
        flashDiv.remove();
      }
    }, 300);
  });
}

// Export pour utilisation globale
window.showFlashMessage = showFlashMessage;

// Animation spéciale pour le bouton "Recevoir un email"
const receiveEmailForm = document.querySelector('.receive-email-form');
if (receiveEmailForm) {
  receiveEmailForm.addEventListener('submit', function (event) {
    const button = receiveEmailForm.querySelector('.receive-email-btn');

    // Animation de celebration
    receiveEmailForm.classList.add('celebrating');
    button.style.animation = 'emailReceive 0.6s ease-in-out';

    setTimeout(() => {
      receiveEmailForm.classList.remove('celebrating');
      button.style.animation = '';
    }, 1000);
  });
}
