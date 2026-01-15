const LANG_STORAGE_KEY = 'lang';

// Load translations and apply to page
async function loadLang(lang) {
  try {
    const res = await fetch(`/i18n/${lang}.json`);
    if (!res.ok) throw new Error('Failed to load language');

    const dict = await res.json();

    // Apply text translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    // Apply placeholder translations
    document.querySelectorAll('[data-placeholder-i18n]').forEach(el => {
      const key = el.getAttribute('data-placeholder-i18n');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
  } catch (error) {
    console.error('Error loading language:', error);
  }
}

// Initialize language on page load
function initLang() {
  const select = document.getElementById('lang-select');
  const stored = localStorage.getItem(LANG_STORAGE_KEY) || 'en';

  if (select) {
    select.value = stored;
    select.addEventListener('change', (e) => {
      const lang = e.target.value;
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      loadLang(lang);
    });
  }

  loadLang(stored);
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', initLang);

// Check if user is logged in
function checkAuth() {
  // This would check session/token from server
  const user = document.body.getAttribute('data-user');
  return user ? JSON.parse(user) : null;
}

// Chat Widget Logic
// Chat Widget Logic
document.addEventListener('DOMContentLoaded', () => {
  // Socket.io has been removed for Firebase Migration.
  // To implement real-time chat with Firebase:
  // 1. Add Firebase JS SDK to your HTML.
  // 2. Initialize Firebase with your project config.
  // 3. Use firebase.firestore().collection('messages').onSnapshot(...) to listen for messages.
  // 4. Use firebase.firestore().collection('messages').add(...) to send messages.

  const chatTwoggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const messagesContainer = document.getElementById('chat-messages');

  if (chatTwoggle) {
    // Toggle chat window
    chatTwoggle.addEventListener('click', () => {
      chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });
  }

  // Placeholder for send functionality
  function sendMessage() {
    const msg = chatInput.value.trim();
    if (msg) {
      // TODO: Firebase Firestore Add Message
      console.log('Message to send (implement Firebase):', msg);

      // Temporarily just show it locally
      appendMessage(msg, 'sent');
      chatInput.value = '';
    }
  }

  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function appendMessage(text, type) {
    const div = document.createElement('div');
    div.classList.add('message', type);
    div.textContent = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
