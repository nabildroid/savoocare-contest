
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
mysql -e "UPDATE mysql.user SET Password = PASSWORD('CHANGEME') WHERE User = 'root'"
# Kill the anonymous users
mysql -e "DROP USER ''@'localhost'"
# Because our hostname varies we'll use some Bash magic here.
mysql -e "DROP USER ''@'$(hostname)'"
# Kill off the demo database
mysql -e "DROP DATABASE test"
# Make our changes take effect

mysql -e "CREATE USER 'admin' IDENTIFIED BY 'admin';"

mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'admin' WITH GRANT OPTION;"
# https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
mysql -e "FLUSH PRIVILEGES"

 


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


