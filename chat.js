// Chat widget logic shared across pages

// Elements will be dynamically referenced when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chatButton');
    const chatBox = document.getElementById('chatBox');
    const messages = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Auto-toggle chat on first load for better visibility
    function toggleChat() {
        const visible = chatBox.style.opacity === '1';
        if (visible) {
            chatBox.style.transform = 'translateY(100%)';
            chatBox.style.opacity = '0';
        } else {
            chatBox.style.transform = 'translateY(0)';
            chatBox.style.opacity = '1';
            // Auto-send a greeting if conversation is empty
            if (!messages.hasChildNodes()) {
                addBotMessage('Hello! I\'m your course advisor bot. Ask me anything about our programs or let me know your career goals.');
            }
        }
    }
    // Show chat by default when page loads
    toggleChat();
    // Chat button event
    chatButton.addEventListener('click', toggleChat);
    // Send message on button click or Enter key
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        addUserMessage(text);
        userInput.value = '';
        showTypingIndicator();
        setTimeout(() => {
            const reply = generateBotResponse(text);
            hideTypingIndicator();
            addBotMessage(reply);
        }, 800);
    }
    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message user';
        msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }
    function addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'message bot';
        msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }
    // Typing indicator
    let typingIndicator;
    function showTypingIndicator() {
        if (typingIndicator) return;
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            typingIndicator.appendChild(dot);
        }
        messages.appendChild(typingIndicator);
        messages.scrollTop = messages.scrollHeight;
    }
    function hideTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.remove();
            typingIndicator = null;
        }
    }
    // Chat bot conversation logic
    let emailCaptured = false;
    let userName = '';
    function generateBotResponse(input) {
        const lower = input.toLowerCase();
        // Greetings
        if (!emailCaptured && (lower.includes('hello') || lower.includes('hi'))) {
            return 'Hi there! May I know your name?';
        }
        // Capture name when user states "my name is"
        if (!emailCaptured && userName === '' && /\bmy name is\b/i.test(lower)) {
            userName = input.split(/is/i)[1].trim();
            return `Nice to meet you, ${userName}! What are your career goals?`;
        }
        // If name still unknown, take the first word as name
        if (!emailCaptured && userName === '' && !lower.includes('@')) {
            userName = input.split(' ')[0];
            return `Great to meet you, ${userName}! What are your career goals?`;
        }
        // Recommend data engineering programme
        if (lower.includes('data') || lower.includes('engineer')) {
            return 'Our flagship Data Engineering program is a 12‑month part‑time course. It covers ETL pipelines, distributed systems and real‑world projects. You can ask for course details or schedule a call.';
        }
        // Recommend software programme
        if (lower.includes('software') || lower.includes('developer')) {
            return 'For software developers, we offer advanced backend and system design specialisations. You can ask for course details or a sample lesson.';
        }
        // Course details or modules
        if (lower.includes('course details') || lower.includes('fundamentals')) {
            return 'Our courses include modules on fundamentals, hands‑on projects, system design, interview prep and capstone projects. Which module interests you the most?';
        }
        // Sample lesson request
        if (lower.includes('sample lesson')) {
            return 'I will send a free sample lesson to your email once you provide it. You can reply with your email or type “back” to return to the previous menu.';
        }
        // Scheduling
        if (lower.includes('schedule')) {
            return 'Great! I will share a calendar link to schedule a call. Please provide your email so I can send it to you.';
        }
        // Pricing
        if (lower.includes('price') || lower.includes('cost') || lower.includes('breakdown') || lower.includes('emi')) {
            return 'Our premium programs range from ₹1,00,000 to ₹2,50,000 depending on duration and specialisation. Scholarships and EMI plans are available. Let me know if you need a detailed breakdown.';
        }
        // Back navigation
        if (lower.includes('back')) {
            return 'No problem. How else can I assist you? You can ask about courses, sample lessons, pricing or scheduling.';
        }
        // Ask for more details or call
        if (lower.includes('details') || lower.includes('call')) {
            return 'Please share your email so I can send over a detailed syllabus and a calendar link for a free consultation call.';
        }
        // Redirect to enrollment page if user says enroll or join
        if (lower.includes('enroll') || lower.includes('join')) {
            return 'To enroll right away, please visit our enrollment page. You can click the “Enroll” link at the top of this page or visit enroll.html.';
        }
        // Capture email address
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const emailMatch = input.match(emailRegex);
        if (emailMatch) {
            emailCaptured = true;
            return `Thanks, I've captured your email (${emailMatch[0]}). Keep an eye out for an email with our course brochure and a link to schedule your free call. Is there anything else you'd like to know?`;
        }
        // Default response
        return 'I\'m sorry, I\'m still learning. Could you tell me a bit more about what you\'re looking for?';
    }
});