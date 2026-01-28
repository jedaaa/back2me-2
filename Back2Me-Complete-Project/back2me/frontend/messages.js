// ========================================
// BACK2ME - MESSAGES PAGE LOGIC
// ========================================

// Check authentication
const currentUser = checkAuth();
document.getElementById('currentUsername').textContent = currentUser.username;

// ===== FAKE CONVERSATIONS DATA =====
const fakeConversations = [
    {
        id: 1,
        userId: 2,
        username: 'Michael Chen',
        avatar: 'https://via.placeholder.com/40/4ECDC4/FFFFFF?text=MC',
        itemInfo: 'About: iPhone 13 Pro',
        lastMessage: 'Yes, I still have it. When can you pick it up?',
        time: '10 min ago',
        messages: [
            { id: 1, senderId: 'current', text: 'Hi, is the iPhone still available?', time: '2:30 PM' },
            { id: 2, senderId: 2, text: 'Yes, I still have it. When can you pick it up?', time: '2:45 PM' }
        ]
    },
    {
        id: 2,
        userId: 3,
        username: 'Emily Rodriguez',
        avatar: 'https://via.placeholder.com/40/45B7D1/FFFFFF?text=ER',
        itemInfo: 'About: Silver Water Bottle',
        lastMessage: 'I found a similar bottle at the gym',
        time: '1 hour ago',
        messages: [
            { id: 1, senderId: 3, text: 'I found a similar bottle at the gym', time: '1:00 PM' },
            { id: 2, senderId: 'current', text: 'Can you send me a photo?', time: '1:15 PM' }
        ]
    },
    {
        id: 3,
        userId: 4,
        username: 'James Wilson',
        avatar: 'https://via.placeholder.com/40/FFA07A/FFFFFF?text=JW',
        itemInfo: 'About: Black Leather Wallet',
        lastMessage: 'The wallet has a student ID inside',
        time: '3 hours ago',
        messages: [
            { id: 1, senderId: 'current', text: 'I think that might be my wallet', time: '11:00 AM' },
            { id: 2, senderId: 4, text: 'The wallet has a student ID inside', time: '11:30 AM' }
        ]
    }
];

// Store conversations in localStorage
if (!localStorage.getItem('back2me_conversations')) {
    localStorage.setItem('back2me_conversations', JSON.stringify(fakeConversations));
}

// ===== ELEMENTS =====
const conversationsList = document.getElementById('conversationsList');
const emptyState = document.getElementById('emptyState');
const chatArea = document.getElementById('chatArea');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatUserPic = document.getElementById('chatUserPic');
const chatUsername = document.getElementById('chatUsername');
const chatItemInfo = document.getElementById('chatItemInfo');

let currentConversationId = null;

// ===== LOAD CONVERSATIONS =====
function loadConversations() {
    const conversations = JSON.parse(localStorage.getItem('back2me_conversations') || '[]');
    
    conversationsList.innerHTML = '';
    
    if (conversations.length === 0) {
        conversationsList.innerHTML = '<div class="no-results"><p>No conversations yet</p></div>';
        return;
    }
    
    conversations.forEach(conversation => {
        const conversationItem = createConversationItem(conversation);
        conversationsList.appendChild(conversationItem);
    });
}

// ===== CREATE CONVERSATION ITEM =====
function createConversationItem(conversation) {
    const item = document.createElement('div');
    item.className = 'conversation-item';
    item.onclick = () => openConversation(conversation.id);
    
    item.innerHTML = `
        <img src="${conversation.avatar}" alt="${conversation.username}" class="profile-pic-small">
        <div class="conversation-info">
            <div class="conversation-username">${conversation.username}</div>
            <div class="conversation-preview">${conversation.lastMessage}</div>
        </div>
        <div class="conversation-time">${conversation.time}</div>
    `;
    
    return item;
}

// ===== OPEN CONVERSATION =====
function openConversation(conversationId) {
    currentConversationId = conversationId;
    
    const conversations = JSON.parse(localStorage.getItem('back2me_conversations') || '[]');
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation) return;
    
    // Update active state
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Hide empty state, show chat
    emptyState.style.display = 'none';
    chatArea.style.display = 'flex';
    
    // Update chat header
    chatUserPic.src = conversation.avatar;
    chatUsername.textContent = conversation.username;
    chatItemInfo.textContent = conversation.itemInfo;
    
    // Load messages
    loadMessages(conversation.messages);
}

// ===== LOAD MESSAGES =====
function loadMessages(messages) {
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== CREATE MESSAGE ELEMENT =====
function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = message.senderId === 'current' ? 'message sent' : 'message received';
    
    messageDiv.innerHTML = `
        ${message.text}
        <div class="message-time">${message.time}</div>
    `;
    
    return messageDiv;
}

// ===== SEND MESSAGE =====
function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText || !currentConversationId) return;
    
    // Get conversations
    const conversations = JSON.parse(localStorage.getItem('back2me_conversations') || '[]');
    const conversationIndex = conversations.findIndex(c => c.id === currentConversationId);
    
    if (conversationIndex === -1) return;
    
    // Create new message
    const newMessage = {
        id: Date.now(),
        senderId: 'current',
        text: messageText,
        time: getCurrentTime()
    };
    
    // Add message to conversation
    conversations[conversationIndex].messages.push(newMessage);
    conversations[conversationIndex].lastMessage = messageText;
    conversations[conversationIndex].time = 'Just now';
    
    // Update localStorage
    localStorage.setItem('back2me_conversations', JSON.stringify(conversations));
    
    // Add message to UI
    const messageElement = createMessageElement(newMessage);
    messagesContainer.appendChild(messageElement);
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Reload conversations list
    loadConversations();
}

// Send message on button click
sendMessageBtn.addEventListener('click', sendMessage);

// Send message on Enter key
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// ===== UTILITY FUNCTIONS =====
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutesStr + ' ' + ampm;
}

function checkAuth() {
    const session = localStorage.getItem('back2me_session') || 
                   sessionStorage.getItem('back2me_session');
    
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(session);
}

// ===== INITIALIZE =====
loadConversations();
