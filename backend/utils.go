package main

import (
	"crypto/rand"
	"encoding/base64"
	"golang.org/x/crypto/bcrypt"
	"log"
)

// Hash password using bcrypt
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(bytes), err
}

// hash the given password and compare it to the stored
func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Base 64 is a binary-to-text encoding scheme that represents binary data in an ASCII string
// format by translating it into a radix-64 representation. It is commonly used to encode data
// that needs to be stored and transferred over media that are designed to deal with textual data.
// This encoding helps to ensure that the data remains intact without modification during transport.
func generateToken(length int) string {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		log.Fatalf("Failed to generate token: %v", err)
	}
	return base64.URLEncoding.EncodeToString(bytes)
}
