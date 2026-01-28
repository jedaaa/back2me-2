#!/usr/bin/env python3
"""
========================================
BACK2ME - CAMPUS LOST & FOUND SYSTEM
PYTHON BACKEND SERVER
========================================
"""

import json
import hashlib
import secrets
import time
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import os

# ===== DATABASE SIMULATION =====
# In a real application, use PostgreSQL, MySQL, or SQLite

class Database:
    def __init__(self):
        self.users = []
        self.posts = []
        self.messages = []
        self.sessions = {}
        
        # Initialize with sample data
        self._init_sample_data()
    
    def _init_sample_data(self):
        """Initialize with sample data for testing"""
        # Sample users
        self.users = [
            {
                'id': 1,
                'username': 'sarah_j',
                'email': 'sarah@campus.edu',
                'password': self._hash_password('password123'),
                'created_at': int(time.time())
            },
            {
                'id': 2,
                'username': 'michael_c',
                'email': 'michael@campus.edu',
                'password': self._hash_password('password123'),
                'created_at': int(time.time())
            }
        ]
        
        # Sample posts
        self.posts = [
            {
                'id': 1,
                'user_id': 1,
                'status': 'lost',
                'item_name': 'Blue Nike Backpack',
                'location': 'Library Building - 2nd Floor',
                'place': 'Near Study Table 12',
                'description': 'Lost my blue Nike backpack with laptop inside.',
                'image_url': None,
                'created_at': int(time.time()) - 7200,
                'updated_at': int(time.time()) - 7200
            },
            {
                'id': 2,
                'user_id': 2,
                'status': 'found',
                'item_name': 'iPhone 13 Pro',
                'location': 'Student Cafeteria',
                'place': 'Table near the main entrance',
                'description': 'Found an iPhone 13 Pro in black color.',
                'image_url': None,
                'created_at': int(time.time()) - 14400,
                'updated_at': int(time.time()) - 14400
            }
        ]
        
        # Sample messages
        self.messages = [
            {
                'id': 1,
                'conversation_id': 1,
                'sender_id': 1,
                'receiver_id': 2,
                'message': 'Hi, is the iPhone still available?',
                'created_at': int(time.time()) - 3600
            },
            {
                'id': 2,
                'conversation_id': 1,
                'sender_id': 2,
                'receiver_id': 1,
                'message': 'Yes, I still have it.',
                'created_at': int(time.time()) - 3000
            }
        ]
    
    def _hash_password(self, password):
        """Hash password using SHA-256 (simplified for demo)"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def _generate_session_token(self):
        """Generate secure session token"""
        return secrets.token_urlsafe(32)
    
    # ===== USER METHODS =====
    
    def register_user(self, username, email, password):
        """Register a new user"""
        # Check if email exists
        if any(u['email'] == email for u in self.users):
            return {'success': False, 'error': 'Email already registered'}
        
        # Check if username exists
        if any(u['username'] == username for u in self.users):
            return {'success': False, 'error': 'Username already taken'}
        
        # Create new user
        new_user = {
            'id': len(self.users) + 1,
            'username': username,
            'email': email,
            'password': self._hash_password(password),
            'created_at': int(time.time())
        }
        
        self.users.append(new_user)
        
        return {'success': True, 'user_id': new_user['id']}
    
    def login_user(self, email, password):
        """Authenticate user and create session"""
        # Find user
        user = next((u for u in self.users if u['email'] == email), None)
        
        if not user:
            return {'success': False, 'error': 'Invalid email or password'}
        
        # Verify password
        if user['password'] != self._hash_password(password):
            return {'success': False, 'error': 'Invalid email or password'}
        
        # Create session
        session_token = self._generate_session_token()
        self.sessions[session_token] = {
            'user_id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'created_at': int(time.time())
        }
        
        return {
            'success': True,
            'session_token': session_token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        }
    
    def verify_session(self, session_token):
        """Verify session token"""
        if session_token in self.sessions:
            return self.sessions[session_token]
        return None
    
    def forgot_password(self, email):
        """Handle forgot password request"""
        user = next((u for u in self.users if u['email'] == email), None)
        
        if not user:
            return {'success': False, 'error': 'Email not found'}
        
        # In real app, send email with reset link
        # For demo, just return success
        return {'success': True, 'message': 'Password reset link sent to email'}
    
    # ===== POST METHODS =====
    
    def create_post(self, user_id, status, item_name, location, place, description, image_url=None):
        """Create a new post"""
        new_post = {
            'id': len(self.posts) + 1,
            'user_id': user_id,
            'status': status,
            'item_name': item_name,
            'location': location,
            'place': place,
            'description': description,
            'image_url': image_url,
            'created_at': int(time.time()),
            'updated_at': int(time.time())
        }
        
        self.posts.append(new_post)
        
        return {'success': True, 'post_id': new_post['id'], 'post': new_post}
    
    def get_posts(self, filters=None):
        """Get all posts with optional filters"""
        posts = self.posts.copy()
        
        if filters:
            # Filter by status
            if 'status' in filters and filters['status'] != 'all':
                posts = [p for p in posts if p['status'] == filters['status']]
            
            # Filter by item name
            if 'item_name' in filters and filters['item_name']:
                posts = [p for p in posts if filters['item_name'].lower() in p['item_name'].lower()]
            
            # Filter by location
            if 'location' in filters and filters['location']:
                posts = [p for p in posts if filters['location'].lower() in p['location'].lower()]
        
        # Sort by created_at (newest first)
        posts.sort(key=lambda x: x['created_at'], reverse=True)
        
        return {'success': True, 'posts': posts}
    
    def get_post_by_id(self, post_id):
        """Get a specific post by ID"""
        post = next((p for p in self.posts if p['id'] == post_id), None)
        
        if not post:
            return {'success': False, 'error': 'Post not found'}
        
        return {'success': True, 'post': post}
    
    def search_posts(self, query):
        """Search posts by query"""
        query = query.lower()
        results = []
        
        for post in self.posts:
            if (query in post['item_name'].lower() or 
                query in post['location'].lower() or 
                query in post['description'].lower()):
                results.append(post)
        
        results.sort(key=lambda x: x['created_at'], reverse=True)
        
        return {'success': True, 'posts': results}
    
    # ===== MESSAGE METHODS =====
    
    def send_message(self, conversation_id, sender_id, receiver_id, message):
        """Send a message"""
        new_message = {
            'id': len(self.messages) + 1,
            'conversation_id': conversation_id,
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'message': message,
            'created_at': int(time.time())
        }
        
        self.messages.append(new_message)
        
        return {'success': True, 'message_id': new_message['id'], 'message': new_message}
    
    def get_conversations(self, user_id):
        """Get all conversations for a user"""
        # Group messages by conversation_id
        conversations = {}
        
        for msg in self.messages:
            if msg['sender_id'] == user_id or msg['receiver_id'] == user_id:
                conv_id = msg['conversation_id']
                if conv_id not in conversations:
                    conversations[conv_id] = []
                conversations[conv_id].append(msg)
        
        # Format conversations
        result = []
        for conv_id, messages in conversations.items():
            messages.sort(key=lambda x: x['created_at'])
            last_message = messages[-1]
            
            # Get other user
            other_user_id = last_message['receiver_id'] if last_message['sender_id'] == user_id else last_message['sender_id']
            other_user = next((u for u in self.users if u['id'] == other_user_id), None)
            
            result.append({
                'conversation_id': conv_id,
                'other_user': {
                    'id': other_user['id'],
                    'username': other_user['username']
                } if other_user else None,
                'last_message': last_message['message'],
                'last_message_time': last_message['created_at'],
                'messages': messages
            })
        
        return {'success': True, 'conversations': result}
    
    def get_messages(self, conversation_id):
        """Get all messages in a conversation"""
        messages = [m for m in self.messages if m['conversation_id'] == conversation_id]
        messages.sort(key=lambda x: x['created_at'])
        
        return {'success': True, 'messages': messages}


# ===== HTTP REQUEST HANDLER =====

class Back2MeHandler(BaseHTTPRequestHandler):
    
    # Database instance (shared across all requests)
    db = Database()
    
    def _set_headers(self, status_code=200):
        """Set response headers"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def _send_json(self, data, status_code=200):
        """Send JSON response"""
        self._set_headers(status_code)
        self.wfile.write(json.dumps(data).encode())
    
    def _get_post_data(self):
        """Get POST data from request"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        return json.loads(post_data.decode())
    
    def do_OPTIONS(self):
        """Handle OPTIONS request (CORS preflight)"""
        self._set_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        # ===== GET POSTS =====
        if path == '/api/posts':
            filters = {}
            if 'status' in query_params:
                filters['status'] = query_params['status'][0]
            if 'item_name' in query_params:
                filters['item_name'] = query_params['item_name'][0]
            if 'location' in query_params:
                filters['location'] = query_params['location'][0]
            
            result = self.db.get_posts(filters)
            self._send_json(result)
        
        # ===== SEARCH POSTS =====
        elif path == '/api/posts/search':
            query = query_params.get('q', [''])[0]
            result = self.db.search_posts(query)
            self._send_json(result)
        
        # ===== GET CONVERSATIONS =====
        elif path == '/api/conversations':
            # Get session token from headers
            session_token = self.headers.get('Authorization', '').replace('Bearer ', '')
            session = self.db.verify_session(session_token)
            
            if not session:
                self._send_json({'success': False, 'error': 'Unauthorized'}, 401)
                return
            
            result = self.db.get_conversations(session['user_id'])
            self._send_json(result)
        
        # ===== GET MESSAGES =====
        elif path.startswith('/api/messages/'):
            conversation_id = int(path.split('/')[-1])
            result = self.db.get_messages(conversation_id)
            self._send_json(result)
        
        else:
            self._send_json({'success': False, 'error': 'Not found'}, 404)
    
    def do_POST(self):
        """Handle POST requests"""
        path = self.path
        
        try:
            data = self._get_post_data()
            
            # ===== REGISTER =====
            if path == '/api/register':
                result = self.db.register_user(
                    data['username'],
                    data['email'],
                    data['password']
                )
                self._send_json(result)
            
            # ===== LOGIN =====
            elif path == '/api/login':
                result = self.db.login_user(
                    data['email'],
                    data['password']
                )
                self._send_json(result)
            
            # ===== FORGOT PASSWORD =====
            elif path == '/api/forgot-password':
                result = self.db.forgot_password(data['email'])
                self._send_json(result)
            
            # ===== CREATE POST =====
            elif path == '/api/posts':
                # Get session token
                session_token = self.headers.get('Authorization', '').replace('Bearer ', '')
                session = self.db.verify_session(session_token)
                
                if not session:
                    self._send_json({'success': False, 'error': 'Unauthorized'}, 401)
                    return
                
                result = self.db.create_post(
                    session['user_id'],
                    data['status'],
                    data['item_name'],
                    data['location'],
                    data['place'],
                    data['description'],
                    data.get('image_url')
                )
                self._send_json(result)
            
            # ===== SEND MESSAGE =====
            elif path == '/api/messages':
                # Get session token
                session_token = self.headers.get('Authorization', '').replace('Bearer ', '')
                session = self.db.verify_session(session_token)
                
                if not session:
                    self._send_json({'success': False, 'error': 'Unauthorized'}, 401)
                    return
                
                result = self.db.send_message(
                    data['conversation_id'],
                    session['user_id'],
                    data['receiver_id'],
                    data['message']
                )
                self._send_json(result)
            
            else:
                self._send_json({'success': False, 'error': 'Not found'}, 404)
        
        except Exception as e:
            self._send_json({'success': False, 'error': str(e)}, 500)
    
    def log_message(self, format, *args):
        """Custom log message"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")


# ===== MAIN SERVER =====

def run_server(port=8000):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, Back2MeHandler)
    
    print(f"""
========================================
BACK2ME SERVER STARTED
========================================
Server running on: http://localhost:{port}
API Endpoints:
  - POST /api/register
  - POST /api/login
  - POST /api/forgot-password
  - GET  /api/posts
  - POST /api/posts
  - GET  /api/posts/search?q=query
  - GET  /api/conversations
  - GET  /api/messages/:conversation_id
  - POST /api/messages
========================================
Press Ctrl+C to stop the server
========================================
    """)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.server_close()


if __name__ == '__main__':
    run_server()
