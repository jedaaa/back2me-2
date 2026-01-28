/*
========================================
BACK2ME - CAMPUS LOST & FOUND SYSTEM
JAVA BACKEND SERVER
========================================
*/

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import com.sun.net.httpserver.*;

public class Back2MeServer {
    
    // ===== DATA MODELS =====
    
    static class User {
        int id;
        String username;
        String email;
        String password;
        long createdAt;
        
        User(int id, String username, String email, String password) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.password = password;
            this.createdAt = System.currentTimeMillis();
        }
    }
    
    static class Post {
        int id;
        int userId;
        String status;
        String itemName;
        String location;
        String place;
        String description;
        String imageUrl;
        long createdAt;
        long updatedAt;
        
        Post(int id, int userId, String status, String itemName, String location, 
             String place, String description, String imageUrl) {
            this.id = id;
            this.userId = userId;
            this.status = status;
            this.itemName = itemName;
            this.location = location;
            this.place = place;
            this.description = description;
            this.imageUrl = imageUrl;
            this.createdAt = System.currentTimeMillis();
            this.updatedAt = System.currentTimeMillis();
        }
    }
    
    static class Message {
        int id;
        int conversationId;
        int senderId;
        int receiverId;
        String message;
        long createdAt;
        
        Message(int id, int conversationId, int senderId, int receiverId, String message) {
            this.id = id;
            this.conversationId = conversationId;
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.message = message;
            this.createdAt = System.currentTimeMillis();
        }
    }
    
    static class Session {
        int userId;
        String username;
        String email;
        long createdAt;
        
        Session(int userId, String username, String email) {
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.createdAt = System.currentTimeMillis();
        }
    }
    
    // ===== DATABASE SIMULATION =====
    
    static class Database {
        private List<User> users;
        private List<Post> posts;
        private List<Message> messages;
        private Map<String, Session> sessions;
        
        public Database() {
            users = new ArrayList<>();
            posts = new ArrayList<>();
            messages = new ArrayList<>();
            sessions = new ConcurrentHashMap<>();
            initSampleData();
        }
        
        private void initSampleData() {
            // Sample users
            users.add(new User(1, "sarah_j", "sarah@campus.edu", hashPassword("password123")));
            users.add(new User(2, "michael_c", "michael@campus.edu", hashPassword("password123")));
            
            // Sample posts
            posts.add(new Post(1, 1, "lost", "Blue Nike Backpack", 
                "Library Building - 2nd Floor", "Near Study Table 12",
                "Lost my blue Nike backpack with laptop inside.", null));
            posts.add(new Post(2, 2, "found", "iPhone 13 Pro",
                "Student Cafeteria", "Table near the main entrance",
                "Found an iPhone 13 Pro in black color.", null));
        }
        
        private String hashPassword(String password) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest(password.getBytes());
                StringBuilder hexString = new StringBuilder();
                for (byte b : hash) {
                    String hex = Integer.toHexString(0xff & b);
                    if (hex.length() == 1) hexString.append('0');
                    hexString.append(hex);
                }
                return hexString.toString();
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException(e);
            }
        }
        
        private String generateToken() {
            return UUID.randomUUID().toString();
        }
        
        // ===== USER METHODS =====
        
        public String registerUser(String username, String email, String password) {
            // Check if email exists
            for (User u : users) {
                if (u.email.equals(email)) {
                    return "{\"success\": false, \"error\": \"Email already registered\"}";
                }
            }
            
            // Check if username exists
            for (User u : users) {
                if (u.username.equals(username)) {
                    return "{\"success\": false, \"error\": \"Username already taken\"}";
                }
            }
            
            // Create new user
            int newId = users.size() + 1;
            User newUser = new User(newId, username, email, hashPassword(password));
            users.add(newUser);
            
            return String.format("{\"success\": true, \"user_id\": %d}", newId);
        }
        
        public String loginUser(String email, String password) {
            // Find user
            User user = null;
            for (User u : users) {
                if (u.email.equals(email)) {
                    user = u;
                    break;
                }
            }
            
            if (user == null) {
                return "{\"success\": false, \"error\": \"Invalid email or password\"}";
            }
            
            // Verify password
            if (!user.password.equals(hashPassword(password))) {
                return "{\"success\": false, \"error\": \"Invalid email or password\"}";
            }
            
            // Create session
            String token = generateToken();
            sessions.put(token, new Session(user.id, user.username, user.email));
            
            return String.format(
                "{\"success\": true, \"session_token\": \"%s\", \"user\": {\"id\": %d, \"username\": \"%s\", \"email\": \"%s\"}}",
                token, user.id, user.username, user.email
            );
        }
        
        public Session verifySession(String token) {
            return sessions.get(token);
        }
        
        // ===== POST METHODS =====
        
        public String createPost(int userId, String status, String itemName, 
                                String location, String place, String description, String imageUrl) {
            int newId = posts.size() + 1;
            Post newPost = new Post(newId, userId, status, itemName, location, place, description, imageUrl);
            posts.add(newPost);
            
            return String.format(
                "{\"success\": true, \"post_id\": %d, \"post\": {\"id\": %d, \"user_id\": %d, \"status\": \"%s\", \"item_name\": \"%s\"}}",
                newId, newId, userId, status, itemName
            );
        }
        
        public String getPosts(String statusFilter) {
            StringBuilder json = new StringBuilder("{\"success\": true, \"posts\": [");
            boolean first = true;
            
            for (Post p : posts) {
                if (statusFilter != null && !statusFilter.equals("all") && !p.status.equals(statusFilter)) {
                    continue;
                }
                
                if (!first) json.append(",");
                first = false;
                
                json.append(String.format(
                    "{\"id\": %d, \"user_id\": %d, \"status\": \"%s\", \"item_name\": \"%s\", \"location\": \"%s\", \"place\": \"%s\", \"description\": \"%s\"}",
                    p.id, p.userId, p.status, p.itemName, p.location, p.place, p.description
                ));
            }
            
            json.append("]}");
            return json.toString();
        }
        
        public String searchPosts(String query) {
            query = query.toLowerCase();
            StringBuilder json = new StringBuilder("{\"success\": true, \"posts\": [");
            boolean first = true;
            
            for (Post p : posts) {
                if (p.itemName.toLowerCase().contains(query) || 
                    p.location.toLowerCase().contains(query) ||
                    p.description.toLowerCase().contains(query)) {
                    
                    if (!first) json.append(",");
                    first = false;
                    
                    json.append(String.format(
                        "{\"id\": %d, \"user_id\": %d, \"status\": \"%s\", \"item_name\": \"%s\", \"location\": \"%s\"}",
                        p.id, p.userId, p.status, p.itemName, p.location
                    ));
                }
            }
            
            json.append("]}");
            return json.toString();
        }
        
        // ===== MESSAGE METHODS =====
        
        public String sendMessage(int conversationId, int senderId, int receiverId, String message) {
            int newId = messages.size() + 1;
            Message newMessage = new Message(newId, conversationId, senderId, receiverId, message);
            messages.add(newMessage);
            
            return String.format(
                "{\"success\": true, \"message_id\": %d}",
                newId
            );
        }
        
        public String getConversations(int userId) {
            // Simplified implementation
            return "{\"success\": true, \"conversations\": []}";
        }
    }
    
    // ===== HTTP HANDLERS =====
    
    static class RegisterHandler implements HttpHandler {
        private Database db;
        
        public RegisterHandler(Database db) {
            this.db = db;
        }
        
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                // Read request body
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody());
                BufferedReader br = new BufferedReader(isr);
                StringBuilder body = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    body.append(line);
                }
                
                // Parse JSON (simplified)
                String username = extractJsonValue(body.toString(), "username");
                String email = extractJsonValue(body.toString(), "email");
                String password = extractJsonValue(body.toString(), "password");
                
                String response = db.registerUser(username, email, password);
                
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }
    
    static class LoginHandler implements HttpHandler {
        private Database db;
        
        public LoginHandler(Database db) {
            this.db = db;
        }
        
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody());
                BufferedReader br = new BufferedReader(isr);
                StringBuilder body = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    body.append(line);
                }
                
                String email = extractJsonValue(body.toString(), "email");
                String password = extractJsonValue(body.toString(), "password");
                
                String response = db.loginUser(email, password);
                
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }
    
    static class PostsHandler implements HttpHandler {
        private Database db;
        
        public PostsHandler(Database db) {
            this.db = db;
        }
        
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String status = null;
                if (query != null && query.contains("status=")) {
                    status = query.split("status=")[1].split("&")[0];
                }
                
                String response = db.getPosts(status);
                
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.sendResponseHeaders(200, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }
    
    // ===== UTILITY METHODS =====
    
    private static String extractJsonValue(String json, String key) {
        // Simplified JSON parsing
        int startIndex = json.indexOf("\"" + key + "\"");
        if (startIndex == -1) return "";
        
        startIndex = json.indexOf(":", startIndex) + 1;
        while (json.charAt(startIndex) == ' ' || json.charAt(startIndex) == '"') {
            startIndex++;
        }
        
        int endIndex = startIndex;
        while (endIndex < json.length() && 
               json.charAt(endIndex) != '"' && 
               json.charAt(endIndex) != ',' && 
               json.charAt(endIndex) != '}') {
            endIndex++;
        }
        
        return json.substring(startIndex, endIndex);
    }
    
    // ===== MAIN SERVER =====
    
    public static void main(String[] args) throws IOException {
        Database db = new Database();
        
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        server.createContext("/api/register", new RegisterHandler(db));
        server.createContext("/api/login", new LoginHandler(db));
        server.createContext("/api/posts", new PostsHandler(db));
        
        server.setExecutor(Executors.newFixedThreadPool(10));
        server.start();
        
        System.out.println("========================================");
        System.out.println("BACK2ME SERVER STARTED (JAVA)");
        System.out.println("========================================");
        System.out.println("Server running on: http://localhost:8000");
        System.out.println("API Endpoints:");
        System.out.println("  - POST /api/register");
        System.out.println("  - POST /api/login");
        System.out.println("  - GET  /api/posts");
        System.out.println("========================================");
    }
}
