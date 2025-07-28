let lightmode = localStorage.getItem('lightmode')
const themeSwitch = document.getElementsByClassName('theme-switch')

const enableLightmode = () => {
    document.body.classList.add('lightmode')
    localStorage.setItem('lightmode', 'active')
}

const disableLightmode = () => {
    document.body.classList.remove('lightmode')
    localStorage.setItem('lightmode', null)
}
 
if(lightmode === "active") enableLightmode()

Array.from(themeSwitch).forEach((btn) => {
  btn.addEventListener('click', () => {
    lightmode = localStorage.getItem('lightmode');
    lightmode !== 'active' ? enableLightmode() : disableLightmode();
  });
});


// Toggling of User Profile
function toggleMenu() {
    document.getElementById("subMenu").classList.toggle("open-menu");
}

document.addEventListener('click', function (e) {
  const submenu = document.getElementById('subMenu');
  const button = document.getElementById('userbtn');
  if (!submenu.contains(e.target) && !button.contains(e.target)) {
    submenu.classList.remove('open-menu');
  }
});

// Logout due to Inactivity

const logoutDelay = 10 * 60 * 1000; // 10 mins
  const modalDisplayTime = 3000;
  let inactivityTimer;

  function showSessionExpiredModal(message) {
    const modalBody = document.getElementById('modal-message');
    modalBody.textContent = message;

    const modal = new bootstrap.Modal(document.getElementById('flashModal'));
    modal.show();
  }

  function startInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      showSessionExpiredModal("Session expired due to inactivity. Logging out...");
      setTimeout(() => {
        window.location.href = "/logout";
      }, modalDisplayTime);
    }, logoutDelay);
  }

  // Reset timer on activity
  ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, startInactivityTimer, false);
  });

  window.onload = startInactivityTimer;
