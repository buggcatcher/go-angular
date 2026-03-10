package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

// add cors response headers to every request
// added CSRF token to application headers
func enableCORS(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return true
	}
	return false
}

func main() {
	dsn := os.Getenv("MYSQL_DSN")
	if dsn == "" {
		dsn = "angular:password@tcp(127.0.0.1:3306)/test?parseTime=true"
	}

	if err := InitDatabase(dsn); err != nil {
		log.Fatalf("Failed to connect to MySQL: %v", err)
	}
	defer func() {
		if err := CloseDatabase(); err != nil {
			log.Printf("Failed to close database: %v", err)
		}
	}()

	http.HandleFunc("/protected", protected)
	http.HandleFunc("/register", register)
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)
	log.Println("Server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func protected(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	username := r.FormValue("username")
	fmt.Fprintf(w, "CSRF validation successful, Welcome %s", username)
}

// POST request used for creating new resources and sending data
func register(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
		return
	}

	username := r.FormValue("username")
	password := r.FormValue("password")

	if len(username) < 8 || len(password) < 8 {
		http.Error(w, "Username and password must be at least 8 characters long", http.StatusNotAcceptable)
		return
	}
	if len(username) == 0 || len(password) == 0 {
		http.Error(w, "Username and password can't be empty", http.StatusNotAcceptable)
		return
	}

	exists, err := UserExists(username)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if exists {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}

	hashedPassword, err := hashPassword(password)
	if err != nil {
		http.Error(w, "Could not hash password", http.StatusInternalServerError)
		return
	}

	if err := CreateUser(username, hashedPassword); err != nil {
		http.Error(w, "Could not create user", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "User %s registered successfully", username)
}

func login(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
		return
	}

	username := r.FormValue("username")
	password := r.FormValue("password")

	hash, err := GetUserByUsername(username)
	if err != nil || !checkPasswordHash(password, hash) {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	sessionToken := generateToken(32)
	csrfToken := generateToken(32)

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    csrfToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: false,
	})

	if err := UpdateUserTokens(username, sessionToken, csrfToken); err != nil {
		http.Error(w, "Could not create session", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "User %s logged in successfully", username)
}

func logout(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: true,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: false,
	})

	username := r.FormValue("username")
	if err := ClearUserTokens(username); err != nil {
		http.Error(w, "Could not clear session", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "User %s logged out successfully", username)
}
