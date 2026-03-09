package main

import (
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

type UserAuthData struct {
	PasswordHash string
	SessionToken string
	CSRFToken    string
}

// InitDatabase initializes the MySQL connection
func InitDatabase(dsn string) error {
	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		return err
	}

	err = db.Ping()
	if err != nil {
		return err
	}

	log.Println("Connected to MySQL database")
	return nil
}

// GetUserByUsername retrieves a user's password hash.
func GetUserByUsername(username string) (string, error) {
	var passwordHash string
	err := db.QueryRow("SELECT password_hash FROM users WHERE username = ?", username).Scan(&passwordHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", fmt.Errorf("user not found")
		}
		return "", err
	}
	return passwordHash, nil
}

// CreateUser creates a new user in the database.
func CreateUser(username, passwordHash string) error {
	_, err := db.Exec("INSERT INTO users (username, password_hash) VALUES (?, ?)", username, passwordHash)
	if err != nil {
		var mysqlErr *mysql.MySQLError
		if errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 {
			return fmt.Errorf("user already exists")
		}
		return err
	}
	return nil
}

// UserExists checks if a user already exists.
func UserExists(username string) (bool, error) {
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)", username).Scan(&exists)
	return exists, err
}

// GetUserAuthData returns the auth data needed for authorization checks.
func GetUserAuthData(username string) (UserAuthData, error) {
	var data UserAuthData
	err := db.QueryRow(
		"SELECT password_hash, COALESCE(session_token, ''), COALESCE(csrf_token, '') FROM users WHERE username = ?",
		username,
	).Scan(&data.PasswordHash, &data.SessionToken, &data.CSRFToken)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return UserAuthData{}, fmt.Errorf("user not found")
		}
		return UserAuthData{}, err
	}
	return data, nil
}

// UpdateUserTokens stores session and CSRF tokens for a user.
func UpdateUserTokens(username, sessionToken, csrfToken string) error {
	result, err := db.Exec(
		"UPDATE users SET session_token = ?, csrf_token = ? WHERE username = ?",
		sessionToken,
		csrfToken,
		username,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("user not found")
	}
	return nil
}

// ClearUserTokens removes session and CSRF tokens for a user.
func ClearUserTokens(username string) error {
	result, err := db.Exec(
		"UPDATE users SET session_token = NULL, csrf_token = NULL WHERE username = ?",
		username,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("user not found")
	}
	return nil
}

// CloseDatabase closes the database connection.
func CloseDatabase() error {
	if db == nil {
		return nil
	}
	return db.Close()
}
