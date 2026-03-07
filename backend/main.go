package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key-change-this-in-production")

// User struct for login/registration
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// AuthResponse struct for token response
type AuthResponse struct {
	Token   string `json:"token"`
	Message string `json:"message"`
}

// Claims struct for JWT
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// Hash password using SHA256
func hashPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return fmt.Sprintf("%x", hash)
}

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Register endpoint
func register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, `{"error":"Invalid request"}`, http.StatusBadRequest)
		return
	}

	if user.Username == "" || user.Password == "" {
		http.Error(w, `{"error":"Username and password required"}`, http.StatusBadRequest)
		return
	}

	exists, err := UserExists(user.Username)
	if err != nil {
		http.Error(w, `{"error":"Database error"}`, http.StatusInternalServerError)
		return
	}
	if exists {
		http.Error(w, `{"error":"User already exists"}`, http.StatusConflict)
		return
	}

	passwordHash := hashPassword(user.Password)
	err = CreateUser(user.Username, passwordHash)
	if err != nil {
		http.Error(w, `{"error":"Failed to register user"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(AuthResponse{Message: "User registered successfully"})
}

// Login endpoint
func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, `{"error":"Invalid request"}`, http.StatusBadRequest)
		return
	}

	storedHash, err := GetUserByUsername(user.Username)
	if err != nil || storedHash != hashPassword(user.Password) {
		http.Error(w, `{"error":"Invalid credentials"}`, http.StatusUnauthorized)
		return
	}

	// Create JWT token
	claims := &Claims{
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, `{"error":"Could not create token"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(AuthResponse{Token: tokenString, Message: "Login successful"})
}

// Protected endpoint example
func profile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get token from Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, `{"error":"Missing authorization header"}`, http.StatusUnauthorized)
		return
	}

	// Extract token (format: "Bearer <token>")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		http.Error(w, `{"error":"Invalid authorization format"}`, http.StatusUnauthorized)
		return
	}

	// Parse and validate token
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		http.Error(w, `{"error":"Invalid token"}`, http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message":  "Profile access granted",
		"username": claims.Username,
	})
}

func main() {
	// Initialize database - using "test" database, change if needed
	// password is exposed !!
	dsn := "angular:sara2475@tcp(localhost:3306)/test"
	err := InitDatabase(dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v\n", err)
	}
	defer CloseDatabase()

	// Create router
	mux := http.NewServeMux()

	// Register routes
	mux.HandleFunc("/api/register", register)
	mux.HandleFunc("/api/login", login)
	mux.HandleFunc("/api/profile", profile)

	// Wrap with CORS middleware
	handler := corsMiddleware(mux)

	// Start server
	port := ":8080"
	log.Printf("Server running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, handler))
}
