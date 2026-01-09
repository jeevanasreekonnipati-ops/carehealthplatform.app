let recognition;
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('Voice not supported in this browser.');
  recognition = new SpeechRecognition();
  recognition.lang = (localStorage.getItem('lang') || 'en');
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    handleVoiceCommand(text);
  };
  recognition.start();
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = (localStorage.getItem('lang') || 'en');
  synth.speak(utter);
}

function handleVoiceCommand(text) {
  // Examples: "search hospitals near me", "search hospitals in Nellore",
  // "login", "open dashboard"
  if (text.includes('login')) window.location = '/login';
  else if (text.includes('dashboard')) window.location = '/dashboard';
  else if (text.includes('near me')) useMyLocation();
  else if (text.includes('search') && text.includes('hospital')) {
    // try to parse after "in"
    const idx = text.indexOf('in ');
    if (idx > -1) {
      const place = text.substring(idx + 3).trim();
      document.getElementById('address-input').value = place;
      geocodeAndCenter();
      speak(`Searching hospitals in ${place}`);
    }
  } else {
    speak('Sorry, I did not understand.');
  }
}
