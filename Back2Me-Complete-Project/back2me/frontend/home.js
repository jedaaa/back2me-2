// ========================================
// BACK2ME - HOME PAGE LOGIC
// ========================================

// Check authentication
const currentUser = checkAuth();

// Update username in sidebar
document.getElementById('currentUsername').textContent = currentUser.username;

// ===== FAKE/PSEUDO DATA =====
const fakeUsers = [
    { id: 1, name: 'Sarah Johnson', avatar: 'https://via.placeholder.com/48/FF6B6B/FFFFFF?text=SJ' },
    { id: 2, name: 'Michael Chen', avatar: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=MC' },
    { id: 3, name: 'Emily Rodriguez', avatar: 'https://via.placeholder.com/48/45B7D1/FFFFFF?text=ER' },
    { id: 4, name: 'James Wilson', avatar: 'https://via.placeholder.com/48/FFA07A/FFFFFF?text=JW' },
    { id: 5, name: 'Lisa Anderson', avatar: 'https://via.placeholder.com/48/98D8C8/FFFFFF?text=LA' }
];

const fakePosts = [
    {
        id: 1,
        userId: 1,
        status: 'lost',
        itemName: 'Blue Nike Backpack',
        location: 'Library Building - 2nd Floor',
        place: 'Near Study Table 12',
        time: '2 hours ago',
        description: 'Lost my blue Nike backpack with laptop inside. Has a small keychain attached. Please contact if found. Very important documents inside.',
        image: 'https://via.placeholder.com/600x400/667eea/FFFFFF?text=Blue+Backpack',
        timestamp: Date.now() - 7200000
    },
    {
        id: 2,
        userId: 2,
        status: 'found',
        itemName: 'iPhone 13 Pro',
        location: 'Student Cafeteria',
        place: 'Table near the main entrance',
        time: '4 hours ago',
        description: 'Found an iPhone 13 Pro in black color. It has a cracked screen protector. Currently with campus security. Contact with proof of ownership.',
        image: 'https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=iPhone+13',
        timestamp: Date.now() - 14400000
    },
    {
        id: 3,
        userId: 3,
        status: 'lost',
        itemName: 'Silver Water Bottle',
        location: 'Sports Complex - Basketball Court',
        place: 'Bleachers section',
        time: '6 hours ago',
        description: 'Lost my Hydro Flask water bottle. Silver color with custom stickers. Has my name engraved at the bottom. Sentimental value.',
        image: 'https://via.placeholder.com/600x400/45B7D1/FFFFFF?text=Water+Bottle',
        timestamp: Date.now() - 21600000
    },
    {
        id: 4,
        userId: 4,
        status: 'found',
        itemName: 'Black Leather Wallet',
        location: 'Engineering Building - Lab 3',
        place: 'Under desk near window',
        time: '8 hours ago',
        description: 'Found a black leather wallet containing some cash and cards. Please describe the contents to claim it. Contact me with details.',
        image: 'https://via.placeholder.com/600x400/FFA07A/FFFFFF?text=Wallet',
        timestamp: Date.now() - 28800000
    },
    {
        id: 5,
        userId: 5,
        status: 'lost',
        itemName: 'AirPods Pro Case',
        location: 'Main Auditorium',
        place: 'Seat B-24',
        time: '1 day ago',
        description: 'Lost my white AirPods Pro charging case. Has a small scratch on the back. The AirPods were inside. Really need them back!',
        image: 'https://via.placeholder.com/600x400/98D8C8/FFFFFF?text=AirPods',
        timestamp: Date.now() - 86400000
    }
];

// Store fake posts in localStorage for other pages
localStorage.setItem('back2me_posts', JSON.stringify(fakePosts));

// ===== LOAD FEED =====
function loadFeed() {
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = '';
    
    const posts = JSON.parse(localStorage.getItem('back2me_posts') || '[]');
    
    if (posts.length === 0) {
        feedContainer.innerHTML = '<div class="no-results"><p>No posts yet. Create the first one!</p></div>';
        return;
    }
    
    // Sort posts by timestamp (newest first)
    posts.sort((a, b) => b.timestamp - a.timestamp);
    
    posts.forEach(post => {
        const user = fakeUsers.find(u => u.id === post.userId) || fakeUsers[0];
        const postCard = createPostCard(post, user);
        feedContainer.appendChild(postCard);
    });
}

// ===== CREATE POST CARD =====
function createPostCard(post, user) {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    card.innerHTML = `
        <div class="post-header">
            <img src="${user.avatar}" alt="${user.name}" class="post-profile-pic">
            <div class="post-user-info">
                <div class="post-username">${user.name}</div>
                <div class="post-time">${post.time}</div>
                <span class="status-badge ${post.status}">${post.status.toUpperCase()} ITEM</span>
            </div>
        </div>
        
        ${post.image ? `<img src="${post.image}" alt="${post.itemName}" class="post-image">` : ''}
        
        <div class="post-details">
            <div class="post-detail-item">
                <span class="detail-label">Item:</span>
                <span class="detail-value">${post.itemName}</span>
            </div>
            <div class="post-detail-item">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${post.location}</span>
            </div>
            <div class="post-detail-item">
                <span class="detail-label">Place:</span>
                <span class="detail-value">${post.place}</span>
            </div>
            <div class="post-detail-item">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${post.time}</span>
            </div>
        </div>
        
        <div class="post-description">
            ${post.description}
        </div>
        
        <div class="post-actions">
            <button class="btn btn-primary" onclick="contactUser(${post.id})">Contact</button>
        </div>
    `;
    
    return card;
}

// ===== MODAL LOGIC =====
const modal = document.getElementById('newPostModal');
const newPostBtn = document.getElementById('newPostBtn');
const closeBtn = document.querySelector('.close');
const newPostForm = document.getElementById('newPostForm');
const descriptionTextarea = document.getElementById('description');
const charCount = document.getElementById('charCount');

// Open modal
newPostBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    newPostForm.reset();
    charCount.textContent = '0';
});

// Close modal on outside click
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        newPostForm.reset();
        charCount.textContent = '0';
    }
});

// Character counter
descriptionTextarea.addEventListener('input', () => {
    const count = descriptionTextarea.value.length;
    charCount.textContent = count;
    
    if (count > 200) {
        charCount.style.color = 'var(--danger-color)';
    } else {
        charCount.style.color = 'var(--text-muted)';
    }
});

// ===== SUBMIT NEW POST =====
newPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Get form data
    const status = document.querySelector('input[name="status"]:checked').value;
    const itemName = document.getElementById('itemName').value.trim();
    const location = document.getElementById('location').value.trim();
    const place = document.getElementById('place').value.trim();
    const description = document.getElementById('description').value.trim();
    const imageFile = document.getElementById('itemImage').files[0];
    
    // Create new post
    const newPost = {
        id: Date.now(),
        userId: 1, // Current user (using first fake user for demo)
        status: status,
        itemName: itemName,
        location: location,
        place: place,
        time: 'Just now',
        description: description,
        image: imageFile ? URL.createObjectURL(imageFile) : 'https://via.placeholder.com/600x400/667eea/FFFFFF?text=' + encodeURIComponent(itemName),
        timestamp: Date.now()
    };
    
    // Add to posts
    const posts = JSON.parse(localStorage.getItem('back2me_posts') || '[]');
    posts.push(newPost);
    localStorage.setItem('back2me_posts', JSON.stringify(posts));
    
    // Close modal and reset form
    modal.style.display = 'none';
    newPostForm.reset();
    charCount.textContent = '0';
    
    // Reload feed
    loadFeed();
    
    alert('Post created successfully!');
});

// ===== CONTACT USER =====
function contactUser(postId) {
    // Redirect to messages page (implement actual messaging logic)
    alert('Messaging feature - Contact functionality will redirect to messages page');
    // window.location.href = 'messages.html?postId=' + postId;
}

// ===== INITIALIZE =====
loadFeed();

// Include auth.js functions
function checkAuth() {
    const session = localStorage.getItem('back2me_session') || 
                   sessionStorage.getItem('back2me_session');
    
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(session);
}
