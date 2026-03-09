package main

import (
	"errors"
	"net/http"
	"net/url"
)

var AuthError = errors.New("Unauthorized")

func Authorize(r *http.Request) error {
	username := r.FormValue("username")
	if username == "" {
		return AuthError
	}

	user, err := GetUserAuthData(username)
	if err != nil {
		return AuthError
	}

	st, err := r.Cookie("session_token")
	if err != nil || st.Value == "" || st.Value != user.SessionToken {
		return AuthError
	}

	csrf := r.Header.Get("X-CSRF-Token")
	if csrf == "" {
		return AuthError
	}

	csrfDecoded, err := url.QueryUnescape(csrf)
	if err != nil {
		csrfDecoded = csrf
	}
	if csrfDecoded != user.CSRFToken {
		return AuthError
	}
	return nil
}
