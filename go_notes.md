# Download 

0) - download from go-lang site 

1) - sudo rm -rf /usr/local/go

2) - sudo tar -C /usr/local -xzf ~/Downloads/go1.26.1.linux-amd64.tar.gz

3) - Add Go to your PATH (choose one based on your shell)

### For bash (~/.bashrc or ~/.bash_profile):
- echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

### Or for zsh (~/.zshrc):
- echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.zshrc
source ~/.zshrc

4) go version

# Backend 

- Sessions
- Cookies
- CSRF tokens

## HandleFunc 

- (from the net/http package) registers a handler function for a given URL pattern in Go's HTTP server.

- The handler function receives two parameters: ResponseWriter (to write the response) and *Request (incoming request data)


1) - Basic route \
http.HandleFunc("/", homepageHandler)

2) - API endpoint \
http.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) { \
&nbsp;&nbsp;&nbsp;    if r.Method == "POST" { \
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;         // Process login \
&nbsp;&nbsp;&nbsp;      } \
})

3) - Start server \
http.ListenAndServe(":8080", nil)

# Syntax

## Struct Declaration

type MyType struct { \
&nbsp;&nbsp;&nbsp;MyVar string \
}

## :=

- type inference operator