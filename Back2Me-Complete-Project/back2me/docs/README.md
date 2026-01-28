# Back2Me - Campus Lost & Found Management System

## 📌 Project Overview

**Back2Me** is a comprehensive web-based campus lost-and-found system designed to help students and staff report, search, and recover lost or found items within educational institutions. The system provides a social-feed-style interface where users can post lost or found items, search for matching items, and communicate securely.

---

## 🎯 Project Objectives

- Simplify lost & found reporting process
- Improve item recovery rate on campus
- Provide secure communication between users
- Create a clean, user-friendly interface
- Demonstrate full-stack development with strict language requirements

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Page structure and content
- **CSS3** - Styling, layout, and responsive design
- **JavaScript (Vanilla)** - Client-side logic and interactivity

### Backend (Choose ONE)
- **Python** - HTTP server with built-in libraries
- **Java** - HTTP server using `com.sun.net.httpserver`

### Optional
- **C/C++** - Search optimization and sorting algorithms (academic demonstration)

### ❌ Restrictions
- No frameworks (React, Vue, Angular, Flask, Spring, etc.)
- No external libraries (jQuery, Bootstrap, etc.)
- Only the specified languages allowed

---

## 📁 Project Structure

```
back2me/
├── frontend/
│   ├── login.html              # User login page
│   ├── register.html           # User registration page
│   ├── forgot-password.html    # Password recovery page
│   ├── home.html               # Main feed page
│   ├── search.html             # Search page
│   ├── messages.html           # Messaging page
│   ├── settings.html           # User settings page
│   ├── lost-items.html         # Lost items filter page
│   ├── found-items.html        # Found items filter page
│   ├── my-reports.html         # User's own reports
│   ├── styles.css              # Global stylesheet
│   ├── auth.js                 # Authentication logic
│   ├── home.js                 # Home page logic
│   ├── search.js               # Search functionality
│   ├── messages.js             # Messaging logic
│   └── settings.js             # Settings page logic
│
├── backend/
│   ├── server.py               # Python HTTP server
│   ├── Back2MeServer.java      # Java HTTP server (alternative)
│   └── algorithms.cpp          # C++ search & sort algorithms
│
└── docs/
    ├── README.md               # This file
    ├── API_DOCUMENTATION.md    # API endpoints documentation
    ├── DATABASE_DESIGN.md      # Database schema
    └── SETUP_GUIDE.md          # Installation instructions
```

---

## 🚀 Features

### 1. Authentication System
- **User Registration**
  - Username, email, and password validation
  - Duplicate email/username checks
  - Password strength requirements (min 6 characters)

- **User Login**
  - Email and password authentication
  - Session management
  - "Remember Me" functionality

- **Forgot Password**
  - Email-based password reset
  - Confirmation messages

### 2. Post Management
- **Create Posts**
  - Lost or Found item status
  - Item details (name, location, description)
  - Image upload (optional)
  - 200-character description limit with live counter

- **View Feed**
  - Social media-style post feed
  - Post details display (user, time, location, description)
  - Status badges (Lost/Found)
  - Contact button for each post

### 3. Search & Filter
- **Search Bar**
  - Keyword search across item name, location, and description
  - Real-time search results

- **Advanced Filters**
  - Filter by status (Lost/Found/All)
  - Filter by item name
  - Filter by location
  - Clear all filters option

### 4. Messaging System
- **Conversations List**
  - View all active conversations
  - Last message preview
  - Time stamps

- **Chat Interface**
  - Real-time messaging
  - Message history
  - Sent/Received message distinction
  - Item context in chat header

### 5. User Settings
- **Profile Management**
  - View username and email
  - Profile picture upload
  - Password change functionality

- **Account Actions**
  - Logout functionality

---

## 🎨 User Interface Design

### Design Principles
- **ChatGPT-Inspired Sidebar**: Clean, minimal navigation
- **Social Feed Layout**: Twitter/X-style post cards
- **Modern Color Scheme**: Professional blue and gray tones
- **Responsive Design**: Works on desktop and mobile devices

### Color Palette
- Primary: `#2563eb` (Blue)
- Success: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Background: `#f8fafc` (Light Gray)
- Text: `#0f172a` (Dark Gray)

### Typography
- Font Family: System UI fonts (San Francisco, Segoe UI, Roboto)
- Clean, readable font sizes
- Proper line heights for readability

---

## 🔧 Setup Instructions

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd back2me/frontend
```

2. **Open in browser**
- Simply open `login.html` in your web browser
- Or use a local server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js (if installed)
npx http-server -p 8080
```

3. **Access the application**
- Navigate to `http://localhost:8080/login.html`

### Backend Setup (Python)

1. **Navigate to backend directory**
```bash
cd back2me/backend
```

2. **Run the Python server**
```bash
python server.py
```

3. **Server will start on port 8000**
```
Server running on: http://localhost:8000
```

### Backend Setup (Java)

1. **Navigate to backend directory**
```bash
cd back2me/backend
```

2. **Compile the Java server**
```bash
javac Back2MeServer.java
```

3. **Run the server**
```bash
java Back2MeServer
```

### C++ Algorithms (Optional)

1. **Compile the C++ code**
```bash
g++ algorithms.cpp -o algorithms
```

2. **Run the performance tests**
```bash
./algorithms
```

---

## 📡 API Endpoints

### Authentication

**POST /api/register**
```json
Request:
{
  "username": "john_doe",
  "email": "john@campus.edu",
  "password": "securepass123"
}

Response:
{
  "success": true,
  "user_id": 123
}
```

**POST /api/login**
```json
Request:
{
  "email": "john@campus.edu",
  "password": "securepass123"
}

Response:
{
  "success": true,
  "session_token": "abc123...",
  "user": {
    "id": 123,
    "username": "john_doe",
    "email": "john@campus.edu"
  }
}
```

**POST /api/forgot-password**
```json
Request:
{
  "email": "john@campus.edu"
}

Response:
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### Posts

**GET /api/posts**
- Query Parameters: `status` (optional: lost/found/all)

**POST /api/posts**
```json
Request:
{
  "status": "lost",
  "item_name": "Blue Backpack",
  "location": "Library - 2nd Floor",
  "place": "Near Table 5",
  "description": "Blue Nike backpack with laptop",
  "image_url": "optional_image_url"
}
```

**GET /api/posts/search?q=query**
- Search posts by keyword

### Messages

**GET /api/conversations**
- Requires: Authorization header with session token

**GET /api/messages/:conversation_id**
- Get all messages in a conversation

**POST /api/messages**
```json
Request:
{
  "conversation_id": 1,
  "receiver_id": 2,
  "message": "Is this still available?"
}
```

---

## 💾 Database Design

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    status ENUM('lost', 'found') NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    place VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);
```

---

## 🔒 Security Features

### Password Security
- **Hashing**: Passwords are hashed using SHA-256 (demonstration)
- **No Plain Text**: Passwords never stored in plain text
- **Session Tokens**: Secure random token generation

### Input Validation
- **Frontend Validation**: Client-side checks for immediate feedback
- **Backend Validation**: Server-side validation for security
- **XSS Prevention**: Input sanitization

### Session Management
- **Token-Based**: Secure session tokens
- **Expiration**: Sessions can be configured to expire
- **Logout**: Proper session cleanup

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register new user with valid data
- [ ] Try registering with duplicate email
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Test "Remember Me" functionality
- [ ] Test forgot password flow

#### Posts
- [ ] Create new lost item post
- [ ] Create new found item post
- [ ] Upload image with post
- [ ] View posts in feed
- [ ] Test character counter (200 limit)

#### Search
- [ ] Search by item name
- [ ] Search by location
- [ ] Apply status filter
- [ ] Clear all filters

#### Messages
- [ ] View conversations list
- [ ] Open a conversation
- [ ] Send a message
- [ ] Receive a message

#### Settings
- [ ] View profile information
- [ ] Change password
- [ ] Upload profile picture
- [ ] Logout

---

## 🎓 Academic Learning Outcomes

### Frontend Development
- HTML5 semantic structure
- CSS3 flexbox and grid layouts
- Responsive web design
- Vanilla JavaScript DOM manipulation
- Event handling and form validation
- Local storage management

### Backend Development
- HTTP server implementation
- RESTful API design
- Request/response handling
- Session management
- Data persistence
- Error handling

### Algorithms (C++)
- Search algorithms (Linear, Boyer-Moore)
- Sorting algorithms (Quick Sort, Merge Sort, Heap Sort)
- Time complexity analysis
- Performance optimization

---

## 🐛 Known Limitations

1. **No Real Database**: Uses in-memory data structure (resets on restart)
2. **No File Storage**: Images use placeholder URLs
3. **No Email Service**: Password reset is simulated
4. **No Real-Time Updates**: Requires page refresh for new content
5. **Basic Authentication**: Educational purposes only, not production-ready

---

## 🚦 Future Enhancements

- [ ] Real database integration (SQLite, PostgreSQL)
- [ ] File upload and storage system
- [ ] Email notification service
- [ ] Real-time messaging with WebSockets
- [ ] Mobile app version
- [ ] Admin dashboard
- [ ] Item categories and tags
- [ ] Location-based search
- [ ] Item recovery confirmation
- [ ] Statistics and analytics

---

## 📄 License

This project is created for educational purposes as part of an academic assignment.

---

## 👨‍💻 Contributors

- **Project Type**: Academic Assignment
- **Course**: Web Development / Software Engineering
- **Language Constraints**: HTML, CSS, JavaScript, Python/Java, C/C++

---

## 📞 Support

For questions or issues:
1. Check the documentation in `/docs` folder
2. Review the API documentation
3. Test with sample data provided
4. Consult the setup guide

---

## 🎉 Acknowledgments

- Design inspired by modern web applications (ChatGPT, Twitter/X)
- Built with vanilla web technologies
- No external dependencies or frameworks
- Pure HTML, CSS, JavaScript implementation

---

**Back2Me** - Helping campus communities reconnect with their lost belongings! 🎒📱💼
