# Back2Me Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup (Python)](#backend-setup-python)
5. [Backend Setup (Java)](#backend-setup-java)
6. [C++ Algorithms (Optional)](#c-algorithms-optional)
7. [Testing the Application](#testing-the-application)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

**For Frontend Only:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime Text, Notepad++)

**For Python Backend:**
- Python 3.7 or higher
- No additional packages required (uses standard library)

**For Java Backend:**
- Java Development Kit (JDK) 8 or higher
- `javac` compiler
- No external libraries required

**For C++ Algorithms:**
- GCC compiler (g++)
- C++11 or higher support

---

## Quick Start

### Option 1: Frontend Only (Demo Mode)

1. **Navigate to frontend folder**
```bash
cd back2me/frontend
```

2. **Open in browser**
```bash
# Just double-click login.html
# OR use a simple HTTP server:

# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

3. **Access the app**
- Open browser: `http://localhost:8080/login.html`

4. **Test credentials (demo mode)**
- Email: `sarah@campus.edu`
- Password: `password123`

### Option 2: Full Stack (Frontend + Backend)

1. **Start backend server** (see detailed instructions below)
2. **Open frontend** in browser
3. **Configure frontend** to use backend API

---

## Frontend Setup

### Step 1: Understand the Structure

```
frontend/
├── login.html          # Entry point
├── register.html       # Sign up page
├── home.html           # Main application
├── search.html         # Search functionality
├── messages.html       # Chat interface
├── settings.html       # User settings
├── styles.css          # All styles
├── auth.js            # Authentication
├── home.js            # Feed logic
├── search.js          # Search logic
├── messages.js        # Messaging
└── settings.js        # Settings logic
```

### Step 2: Run the Frontend

**Method 1: Direct File Access**
- Simply open `login.html` in your browser
- Note: Some features may not work due to CORS

**Method 2: Local HTTP Server (Recommended)**

```bash
# Using Python 3
python -m http.server 8080

# Using PHP (if installed)
php -S localhost:8080

# Using Node.js http-server (if installed)
npx http-server -p 8080
```

### Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost:8080/login.html
```

### Step 4: Test Demo Mode

The application runs in demo mode using `localStorage`:

**Demo Accounts:**
- Email: `sarah@campus.edu`, Password: `password123`
- Email: `michael@campus.edu`, Password: `password123`

**Or register a new account:**
- Click "Register here" on login page
- Fill in the form
- Account stored in browser's localStorage

---

## Backend Setup (Python)

### Step 1: Verify Python Installation

```bash
python --version
# Should show Python 3.7 or higher
```

### Step 2: Navigate to Backend Directory

```bash
cd back2me/backend
```

### Step 3: Run the Server

```bash
python server.py
```

### Step 4: Verify Server is Running

You should see:
```
========================================
BACK2ME SERVER STARTED
========================================
Server running on: http://localhost:8000
API Endpoints:
  - POST /api/register
  - POST /api/login
  ...
========================================
```

### Step 5: Test API Endpoints

**Using curl:**
```bash
# Test registration
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'

# Test login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get posts
curl http://localhost:8000/api/posts
```

**Using browser:**
- Navigate to `http://localhost:8000/api/posts`
- Should return JSON data

### Step 6: Connect Frontend to Backend

In JavaScript files, update API calls to use:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

---

## Backend Setup (Java)

### Step 1: Verify Java Installation

```bash
java -version
javac -version
# Both should show Java 8 or higher
```

### Step 2: Navigate to Backend Directory

```bash
cd back2me/backend
```

### Step 3: Compile the Server

```bash
javac Back2MeServer.java
```

### Step 4: Run the Server

```bash
java Back2MeServer
```

### Step 5: Verify Server is Running

You should see:
```
========================================
BACK2ME SERVER STARTED (JAVA)
========================================
Server running on: http://localhost:8000
...
========================================
```

### Step 6: Test the Server

Same as Python backend - test with curl or browser.

---

## C++ Algorithms (Optional)

### Purpose
Demonstrates search and sorting algorithms for academic purposes.

### Step 1: Verify G++ Installation

```bash
g++ --version
# Should show GCC 4.8 or higher
```

### Step 2: Navigate to Backend Directory

```bash
cd back2me/backend
```

### Step 3: Compile the Code

```bash
g++ -std=c++11 algorithms.cpp -o algorithms
```

### Step 4: Run the Program

```bash
./algorithms
```

### Step 5: View Results

The program will output:
- Search algorithm performance comparison
- Sorting algorithm performance comparison
- Time measurements for each algorithm

### Example Output:
```
========================================
BACK2ME - ALGORITHM PERFORMANCE TESTING
========================================

=== SEARCH ALGORITHMS ===
Linear Search Time: 0.023 ms
Found 1 results:
...

Optimized Search Time: 0.015 ms
Found 1 results:
...

=== SORTING ALGORITHMS ===
Quick Sort Time: 0.045 ms
Merge Sort Time: 0.052 ms
Heap Sort Time: 0.048 ms
```

---

## Testing the Application

### 1. Test User Registration

1. Open `http://localhost:8080/register.html`
2. Fill in:
   - Username: `testuser`
   - Email: `test@campus.edu`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Register"
4. Should redirect to login page

### 2. Test User Login

1. Open `http://localhost:8080/login.html`
2. Enter credentials
3. Check "Remember Me" (optional)
4. Click "Login"
5. Should redirect to home page

### 3. Test Creating a Post

1. On home page, click "+ New Post"
2. Select status (Lost/Found)
3. Fill in:
   - Item Name: `Blue Backpack`
   - Location: `Library`
   - Place: `2nd Floor`
   - Description: `Blue Nike backpack`
4. Upload image (optional)
5. Click "Post"
6. Should appear in feed

### 4. Test Search

1. Go to Search page
2. Enter search term: `backpack`
3. Apply filters if needed
4. View results

### 5. Test Messaging

1. Click "Contact" on any post
2. Should open messages page
3. Type a message
4. Press "Send" or Enter

### 6. Test Settings

1. Go to Settings page
2. View profile info
3. Try changing password
4. Upload profile picture
5. Test logout

---

## Troubleshooting

### Frontend Issues

**Problem: Styles not loading**
- Solution: Ensure `styles.css` is in the same directory
- Check browser console for errors

**Problem: JavaScript not working**
- Solution: Check browser console for errors
- Ensure all `.js` files are in the same directory
- Try hard refresh (Ctrl+Shift+R)

**Problem: CORS errors**
- Solution: Use a local HTTP server instead of file://
- Run: `python -m http.server 8080`

**Problem: localStorage not persisting**
- Solution: Check browser privacy settings
- Ensure cookies/storage is enabled
- Try different browser

### Backend Issues (Python)

**Problem: Port already in use**
```bash
# Solution: Use different port
python server.py --port 8001
```

**Problem: Module not found**
- Solution: Verify Python 3 is installed
- Check import statements

**Problem: JSON decode errors**
- Solution: Ensure Content-Type header is set
- Verify JSON format in requests

### Backend Issues (Java)

**Problem: Compilation errors**
```bash
# Solution: Check Java version
java -version

# Ensure com.sun.net.httpserver is available
javac -cp . Back2MeServer.java
```

**Problem: Class not found**
- Solution: Run from correct directory
- Ensure .class file exists

### C++ Issues

**Problem: Compilation errors**
```bash
# Solution: Specify C++11 standard
g++ -std=c++11 algorithms.cpp -o algorithms
```

**Problem: Linking errors**
- Solution: Ensure all includes are correct
- Check for missing semicolons

---

## Configuration

### Changing Ports

**Python Backend:**
Edit `server.py`:
```python
if __name__ == '__main__':
    run_server(port=8080)  # Change port here
```

**Java Backend:**
Edit `Back2MeServer.java`:
```java
HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
```

### Connecting Frontend to Backend

Edit JavaScript files to update API base URL:

**auth.js, home.js, search.js, messages.js:**
```javascript
const API_BASE_URL = 'http://localhost:8000';

// Then use in fetch calls:
fetch(`${API_BASE_URL}/api/posts`)
```

---

## Development Tips

### Hot Reload
- Use browser developer tools
- Enable auto-refresh extension
- Use `watch` command for file changes

### Debugging
```javascript
// Add console logs
console.log('Debug:', variable);

// Use browser debugger
debugger;

// Check network tab for API calls
```

### Code Organization
- Keep related functions together
- Use comments for complex logic
- Follow naming conventions
- Keep functions small and focused

---

## Next Steps

1. **Customize the UI**
   - Edit `styles.css` for different colors
   - Modify HTML structure
   - Add new features

2. **Add Database**
   - Replace in-memory storage
   - Use SQLite for simple setup
   - Or PostgreSQL/MySQL for production

3. **Deploy**
   - Use Heroku, Vercel, or Netlify
   - Configure production settings
   - Set up HTTPS

4. **Enhance Features**
   - Add real-time updates
   - Implement notifications
   - Add image optimization
   - Create mobile app

---

## Resources

### Documentation
- HTML: https://developer.mozilla.org/en-US/docs/Web/HTML
- CSS: https://developer.mozilla.org/en-US/docs/Web/CSS
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- Python: https://docs.python.org/3/
- Java: https://docs.oracle.com/javase/

### Tools
- VS Code: https://code.visualstudio.com/
- Chrome DevTools: https://developer.chrome.com/docs/devtools/
- Postman: https://www.postman.com/ (API testing)

---

## Support

If you encounter issues:
1. Check error messages in browser console
2. Review server logs
3. Verify all files are in correct locations
4. Test with sample data
5. Consult the main README.md

---

**Happy Coding! 🚀**
