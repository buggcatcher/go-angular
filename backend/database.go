package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

// InitDatabase initializes the MySQL connection
func InitDatabase(dsn string) error {
	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		return err
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		return err
	}

	log.Println("✓ Connected to MySQL database")
	return nil
}

// GetUserByUsername retrieves a user by username
func GetUserByUsername(username string) (string, error) {
	var passwordHash string
	err := db.QueryRow("SELECT password_hash FROM users WHERE username = ?", username).Scan(&passwordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("user not found")
		}
		return "", err
	}
	return passwordHash, nil
}

// CreateUser creates a new user in the database
func CreateUser(username, passwordHash string) error {
	_, err := db.Exec("INSERT INTO users (username, password_hash) VALUES (?, ?)", username, passwordHash)
	if err != nil {
		// Check if it's a duplicate entry error
		if err.Error() == "Error 1062: Duplicate entry" {
			return fmt.Errorf("user already exists")
		}
		return err
	}
	return nil
}

// UserExists checks if a user already exists
func UserExists(username string) (bool, error) {
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)", username).Scan(&exists)
	return exists, err
}

// CloseDatabase closes the database connection
func CloseDatabase() error {
	return db.Close()
}
