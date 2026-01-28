// ========================================
// BACK2ME - SEARCH PAGE LOGIC
// ========================================

// Check authentication
const currentUser = checkAuth();
document.getElementById('currentUsername').textContent = currentUser.username;

// Get posts from localStorage
let allPosts = JSON.parse(localStorage.getItem('back2me_posts') || '[]');

// Fake users data
const fakeUsers = [
    { id: 1, name: 'Sarah Johnson', avatar: 'https://via.placeholder.com/48/FF6B6B/FFFFFF?text=SJ' },
    { id: 2, name: 'Michael Chen', avatar: 'https://via.placeholder.com/48/4ECDC4/FFFFFF?text=MC' },
    { id: 3, name: 'Emily Rodriguez', avatar: 'https://via.placeholder.com/48/45B7D1/FFFFFF?text=ER' },
    { id: 4, name: 'James Wilson', avatar: 'https://via.placeholder.com/48/FFA07A/FFFFFF?text=JW' },
    { id: 5, name: 'Lisa Anderson', avatar: 'https://via.placeholder.com/48/98D8C8/FFFFFF?text=LA' }
];

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const statusFilter = document.getElementById('statusFilter');
const itemNameFilter = document.getElementById('itemNameFilter');
const locationFilter = document.getElementById('locationFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const searchResults = document.getElementById('searchResults');
const resultsCount = document.getElementById('resultsCount');

// Search on button click
searchBtn.addEventListener('click', performSearch);

// Search on Enter key
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Search on filter change
statusFilter.addEventListener('change', performSearch);
itemNameFilter.addEventListener('input', performSearch);
locationFilter.addEventListener('input', performSearch);

// Clear filters
clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    statusFilter.value = 'all';
    itemNameFilter.value = '';
    locationFilter.value = '';
    
    searchResults.innerHTML = '<div class="no-results"><p>🔍 Start searching to find items</p></div>';
    resultsCount.textContent = '0 items found';
});

// ===== PERFORM SEARCH =====
function performSearch() {
    const searchQuery = searchInput.value.toLowerCase().trim();
    const statusValue = statusFilter.value;
    const itemNameValue = itemNameFilter.value.toLowerCase().trim();
    const locationValue = locationFilter.value.toLowerCase().trim();
    
    // Filter posts
    let filteredPosts = allPosts.filter(post => {
        // Search query filter (searches in item name, location, and description)
        const matchesSearch = searchQuery === '' || 
            post.itemName.toLowerCase().includes(searchQuery) ||
            post.location.toLowerCase().includes(searchQuery) ||
            post.description.toLowerCase().includes(searchQuery);
        
        // Status filter
        const matchesStatus = statusValue === 'all' || post.status === statusValue;
        
        // Item name filter
        const matchesItemName = itemNameValue === '' || 
            post.itemName.toLowerCase().includes(itemNameValue);
        
        // Location filter
        const matchesLocation = locationValue === '' || 
            post.location.toLowerCase().includes(locationValue);
        
        return matchesSearch && matchesStatus && matchesItemName && matchesLocation;
    });
    
    // Display results
    displayResults(filteredPosts);
}

// ===== DISPLAY RESULTS =====
function displayResults(posts) {
    searchResults.innerHTML = '';
    
    if (posts.length === 0) {
        searchResults.innerHTML = '<div class="no-results"><p>No items found matching your search criteria</p></div>';
        resultsCount.textContent = '0 items found';
        return;
    }
    
    resultsCount.textContent = `${posts.length} item${posts.length > 1 ? 's' : ''} found`;
    
    // Sort by timestamp (newest first)
    posts.sort((a, b) => b.timestamp - a.timestamp);
    
    posts.forEach(post => {
        const user = fakeUsers.find(u => u.id === post.userId) || fakeUsers[0];
        const postCard = createPostCard(post, user);
        searchResults.appendChild(postCard);
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

// ===== CONTACT USER =====
function contactUser(postId) {
    alert('Messaging feature - Contact functionality will redirect to messages page');
}

// ===== AUTH CHECK =====
function checkAuth() {
    const session = localStorage.getItem('back2me_session') || 
                   sessionStorage.getItem('back2me_session');
    
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(session);
}
