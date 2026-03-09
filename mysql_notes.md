Docker's MySQL init scripts (/docker-entrypoint-initdb.d/) only run the first time the container starts with an empty volume.

On subsequent container starts:

Volume already has data
Init scripts are skipped
Database keeps all existing data
DROP TABLE never executes

- Optional: add docker to user group

<!-- # 1) Create docker group
sudo groupadd docker

# 2) Add your user to it
sudo usermod -aG docker $USER

# 3) Refresh group membership in current shell
newgrp docker

# 4) Test without sudo -->
# 1) Verify Docker CLI exists
docker --version

# 2) Create docker group (safe if it already exists)
sudo groupadd docker || true

# 3) Add your user to docker group
sudo usermod -aG docker "$USER"

# 4) Apply new group in current shell
newgrp docker

<!-- # 5) Verify you now can access daemon without sudo
docker ps
docker compose version

# 6) From project root, start MySQL service
cd /home/adam/Desktop/go-angular
docker compose up -d

# 7) Check container status
docker compose ps
docker compose logs -f mysql
docker compose ps -->
# 1) Confirm your current shell sees docker group
id

# 2) Check socket owner/group
ls -l /var/run/docker.sock

# 3) Fix socket permissions for docker group
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock

# 4) Restart Docker service (snap install)
sudo snap restart docker

# 5) Re-open docker-group shell and test
newgrp docker
docker ps
docker compose version

# 1) Stop and remove snap docker
sudo snap stop docker
sudo snap remove docker

# 2) Install Docker from apt
sudo apt update
sudo apt install -y docker.io docker-compose-v2

# 3) Enable daemon service
sudo systemctl enable --now docker

# 4) Ensure docker group exists and add your user
sudo groupadd docker || true
sudo usermod -aG docker "$USER"

# 5) Re-login (or reboot) so group applies fully
# log out and log back in

# 6) Verify no sudo needed
id
docker ps
docker compose version

# 7) Start your project services
cd /home/adam/Desktop/go-angular
docker compose up -d
docker compose ps