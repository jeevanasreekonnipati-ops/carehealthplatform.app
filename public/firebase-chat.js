// Firebase Configuration
// TODO: Replace with your actual config from Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// DOM Elements
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const messagesContainer = document.getElementById('chat-messages');
const chatToggle = document.getElementById('chat-toggle');
const chatClose = document.getElementById('chat-close');

// Chat Session ID (Simple random ID for now, or use User ID if logged in)
const sessionId = localStorage.getItem('chatSessionId') || 'session_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('chatSessionId', sessionId);

// Collection Reference
const chatRef = db.collection('triage_sessions').doc(sessionId).collection('messages');

// Toggle Chat Window
if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
        scrollToBottom();
    });
}

if (chatClose) {
    chatClose.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });
}

// Send Message Function
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    try {
        // 1. Add user message to Firestore
        await chatRef.add({
            text: text,
            sender: 'user', // or user.uid
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear input
        chatInput.value = '';
        scrollToBottom();

        // The AI backend (Cloud Function) should listen to this add, 
        // process it, and add a reply with sender: 'ai'

    } catch (error) {
        console.error("Error sending message:", error);
        appendMessage("Error sending message. Please try again.", "system");
    }
}

// Event Listeners
if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Real-time Listener
chatRef.orderBy('timestamp').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const msg = change.doc.data();
            appendMessage(msg.text, msg.sender);
        }
    });
});

// Helper: Append Message to UI
function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message');

    if (sender === 'user') {
        div.classList.add('sent'); // Right side
    } else if (sender === 'ai' || sender === 'system') {
        div.classList.add('received'); // Left side
    } else {
        div.classList.add('received');
    }

    div.textContent = text;
    messagesContainer.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
