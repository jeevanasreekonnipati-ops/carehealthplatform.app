const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const isDemoMode = !OPENAI_KEY || OPENAI_KEY.includes('your_openai_api_key_here');

let openai = null;
if (!isDemoMode) {
    openai = new OpenAI({
        apiKey: OPENAI_KEY
    });
} else {
    console.warn("⚠️  AI Assistant is running in DEMO MODE. (No valid OPENAI_API_KEY found in .env)");
}

// Basic medical triage prompt template
const SYSTEM_PROMPT = `You are a helpful and empathetic AI medical assistant named "SmartHealth AI". 
Your goal is to provide basic triage advice and general health information. 
DISCLAIMER: Always state that you are an AI and not a doctor. 
If symptoms seem critical (chest pain, difficulty breathing, severe bleeding), advise the user to call emergency services immediately.
Keep responses concise and easy to understand.`;

router.post('/chat', async (req, res) => {
    try {
        const { message, language = 'en' } = req.body;

        const langMap = {
            'en': 'English',
            'hi': 'Hindi (हिंदी)',
            'te': 'Telugu (తెలుగు)'
        };
        const targetLang = langMap[language] || 'English';

        // SMART DEMO MODE: If no valid API key is present, provide realistic triage responses
        if (isDemoMode) {
            const msg = message.toLowerCase();
            let reply = "";

            if (language === 'hi') {
                if (msg.includes("hello") || msg.includes("hi") || msg.includes("नमस्ते")) {
                    reply = "नमस्ते! मैं स्मार्टहेल्थ एआई हूं, आपकी वर्चुअल मेडिकल असिस्टेंट। आज आप कैसा महसूस कर रहे हैं? आप मुझे अपने किसी भी लक्षण के बारे में बता सकते हैं।";
                } else if (msg.includes("सीने में दर्द") || msg.includes("सांस") || msg.includes("आपातकालीन")) {
                    reply = "🚨 आपातकालीन: आपके लक्षण गंभीर लग रहे हैं। कृपया तुरंत आपातकालीन सेवाओं (108) को कॉल करें या निकटतम आपातकालीन कक्ष में जाएं। मैं एक एआई हूं, डॉक्टर नहीं।";
                } else {
                    reply = `मैं समझता हूं कि आप '${message}' के बारे में पूछ रहे हैं। कृपया अपने लक्षणों की निगरानी करें। यदि वे बने रहते हैं, तो डॉक्टर से मिलें। (डेमो नोट: पूर्ण एआई के लिए .env में कुंजी जोड़ें)`;
                }
            } else if (language === 'te') {
                if (msg.includes("hello") || msg.includes("hi") || msg.includes("నమస్కారం")) {
                    reply = "నమస్కారం! నేను స్మార్ట్‌హెల్త్ AI, మీ వర్చువల్ మెడికల్ అసిస్టెంట్. ఈరోజు మీరు ఎలా ఉన్నారు? మీ ఆరోగ్య సమస్యల గురించి నాకు చెప్పండి.";
                } else if (msg.includes("ఛాతీ నొప్పి") || msg.includes("శ్వాస") || msg.includes("అత్యవసర")) {
                    reply = "🚨 అత్యవసర పరిస్థితి: మీ లక్షణాలు చాలా తీవ్రంగా ఉన్నాయి. దయచేసి వెంటనే అత్యవసర సేవలకు (108) కాల్ చేయండి. నేను AI ని మాత్రమే, డాక్టర్ని కాదు.";
                } else {
                    reply = `'${message}' గురించి మీరు అడుగుతున్నారని నాకు అర్థమైంది. మీ ఆరోగ్యాన్ని జాగ్రత్తగా గమనించండి. సమస్య తగ్గకపోతే డాక్టర్ని సంప్రదించండి. (డెమో నోట్: పూర్తి AI కోసం .env లో కీని జోడించండి)`;
                }
            } else {
                if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
                    reply = "Hello! I'm SmartHealth AI, your virtual medical assistant. How are you feeling today? You can tell me about any symptoms you're having.";
                } else if (msg.includes("chest pain") || msg.includes("breathing") || msg.includes("emergency")) {
                    reply = "🚨 EMERGENCY: Your symptoms sound critical. Please call emergency services (911/108) immediately. I am an AI, not a doctor.";
                } else {
                    reply = `I understand you're asking about '${message}'. Please monitor your symptoms closely. If they persist, consult a doctor. (Demo Note: Add OPENAI_API_KEY to .env for full AI)`;
                }
            }

            return res.json({ reply });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: `${SYSTEM_PROMPT}\nIMPORTANT: You MUST respond in ${targetLang}.` },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

module.exports = router;
