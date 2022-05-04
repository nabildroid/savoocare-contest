
export SITE_NAME="Savoo - contest"
export DB_NAME="contest"
export DB_USER="admin"
export DB_PASSWORD="##"
export JWT_SECRET="ilk3"
export APPLICATIONS_FILE_PREFIX="savoo"

export DASHBOARD_USER="admin"
export DASHBOARD_PASSWORD="admin"





apt update


mkdir /usr/app
cd /usr/app
git clone https://github.com/nabildroid/savoocare-contest.git
cd savoocare-contest

# install node


curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

source ~/.nvm/nvm.sh

nvm install node -y


# install nginx
apt install nginx -y

rm /etc/nginx/sites-enabled/* -rf
mv /usr/app/savoocare-contest/nginx.conf /etc/nginx/sites-available/default
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

systemctl restart nginx


# install mysql


apt install mysql-server -y
systemctl start mysql.service


# Make sure that NOBODY can access the server without a password
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"


mysql -e "CREATE USER '$DB_USER' IDENTIFIED BY '$DB_PASSWORD'";

mysql -e "GRANT ALL PRIVILEGES ON *.* TO '$DB_USER' WITH GRANT OPTION;"


mysql -e "create database $DB_NAME";

mysql -e "FLUSH PRIVILEGES;"


mysql -e "ALTER USER '$DB_USER' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';"

mysql -e "flush privileges;"
 


# build scripts

npm install pm2@latest -g


cd server
npm i
npm run build
npm run migrate
npm run pm2

cd ../admin 
npm i
npm run build

cd ../next
npm i
npm run build
npm run start&


cd /usr/app/savoocare-contest

mv admin/dist /var/www/admin


ufw allow 80
ufw allow 22
ufw deny 3000
ufw enable
ufw reload

