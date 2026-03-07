## Step 3: Initialize Database Schema

Run the schema file to create the users table:
```bash
cd /home/monke/Codes/angular/backend
mysql -u root -p angular_auth < schema.sql
```

Or if you created a user:
```bash
mysql -u angular -p angular_auth < schema.sql
```

## Step 4: Update Connection String (if needed)

In `main.go`, find this line:
```go
dsn := "root:password@tcp(localhost:3306)/angular_auth"
```

Update it based on your setup:
- If using **root user with password**: `root:your_password@tcp(localhost:3306)/angular_auth`
- If using **root user without password**: `root:@tcp(localhost:3306)/angular_auth`
- If using **angular user**: `angular:angular_password@tcp(localhost:3306)/angular_auth`

## Step 5: Install Go Dependencies

```bash
cd backend
go mod tidy
```

This will download the MySQL driver.

## Step 6: Run the Backend

```bash
go run main.go
```

Expected output:
```
✓ Connected to MySQL database
Server running on http://localhost:8080
```

## Verify Database Setup

Check if users table was created:
```bash
mysql -u root -p angular_auth -e "DESCRIBE users;"
```

You should see:
```
+---------------+--------------+------+-----+-------------------+-------------------+
| Field         | Type         | Null | Key | Default           | Extra             |
+---------------+--------------+------+-----+-------------------+-------------------+
| id            | int          | NO   | PRI | NULL              | auto_increment    |
| username      | varchar(255) | NO   | UNI | NULL              |                   |
| password_hash | varchar(255) | NO   |     | NULL              |                   |
| created_at    | timestamp    | NO   |     | CURRENT_TIMESTAMP |                   |
| updated_at    | timestamp    | NO   |     | CURRENT_TIMESTAMP | on update...      |
+---------------+--------------+------+-----+-------------------+-------------------+
```

Check demo user:
```bash
mysql -u root -p angular_auth -e "SELECT * FROM users;"
```

You should see the demo user has been inserted.

## Test the Flow

1. **Start MySQL** (if not already running):
   ```bash
   mysql.server start  # macOS
   # or
   sudo systemctl start mysql  # Linux
   ```

2. **Start Go backend**:
   ```bash
   cd backend
   go run main.go
   ```

3. **Start Angular** (in another terminal):
   ```bash
   cd project
   ng serve
   ```

4. **Test registration** (new users will be persisted in MySQL):
   ```bash
   curl -X POST http://localhost:8080/api/register \
     -H "Content-Type: application/json" \
     -d '{"username":"john","password":"secret123"}'
   ```

5. **Check database** - new user should be there:
   ```bash
   mysql -u root -p angular_auth -e "SELECT username FROM users;"
   ```

6. **Restart the Go server** - your registered users will still be there! ✅

## Troubleshooting

### "Connection refused" error
- Make sure MySQL is running: `mysql.server status` or `sudo systemctl status mysql`
- Start MySQL: `mysql.server start` or `sudo systemctl start mysql`

### "Access denied for user 'root'" error
- Check your password in the DSN connection string
- Or run MySQL without password: `mysql -u root` (no -p flag)

### "Unknown database 'angular_auth'" error
- Run the schema file: `mysql -u root -p angular_auth < schema.sql`
- Or manually create the database in MySQL shell: `CREATE DATABASE angular_auth;`

### "User already exists" error (after restart)
- This is expected! The user is now in MySQL, not in-memory
- Each registration is permanent (until you delete from database)

### Check all users in database
```bash
mysql -u root -p angular_auth -e "SELECT id, username, created_at FROM users;"
```

### Delete a user (if needed)
```bash
mysql -u root -p angular_auth -e "DELETE FROM users WHERE username='john';"
```
