// Optimisation pour la mise à jour instantanée des panneaux
document.addEventListener('DOMContentLoaded', function () {
  // Intercepter tous les formulaires avec Turbo Stream
  const forms = document.querySelectorAll('form[data-turbo-stream="true"]');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      // Ajouter une classe loading pour indiquer le traitement
      const emailsList = document.getElementById('emails');
      const selectedEmail = document.getElementById('selected_email');

      if (emailsList) {
        emailsList.style.opacity = '0.7';
      }
      if (selectedEmail) {
        selectedEmail.style.opacity = '0.7';
      }
    });
  });

  // Écouter les événements Turbo Stream pour restaurer l'opacité
  document.addEventListener('turbo:stream-render', function (event) {
    const emailsList = document.getElementById('emails');
    const selectedEmail = document.getElementById('selected_email');

    if (emailsList) {
      emailsList.style.opacity = '1';
    }
    if (selectedEmail) {
      selectedEmail.style.opacity = '1';
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
});
