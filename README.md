# Welcome to your first group project #

- This section will be updated when we have finalised details of group project.


npm install to ensure same packages are installed.
To start the development server on localhost:3000 Type "npm start" - KS

## Installing app ##

### Clone Project ###

This app was built with Postgres 9
Install Postgres 9. Compatibility with later versions untested

Create a postgres database and name it as you wish. "MYDB" for example. You will need the user name and password for this and connection port.

You will also require access to an email server. This is to send verification emails for registration, confirmation and account maintenance.
You will need the user name and password for this.

Create environmental variables in .env file in the root folder of your project

- PG_HOST=*Database server location* probably localhost if on the same machine
- PG_USER=*database username*
- PG_KEY=*database password*
- EMAIL_NODEMAILER_USERNAME=*server email account*
* EMAIL_NODEMAILER_PASSWORD=*server email password*
* COOKIE_SECRET= *anything you like*
* PG_DBASE=MYDB
* PG_PORT=5432

In the environmentalConfig.js file in the root directly change the production domain to the domain that your server is mapped to.

Please ensure you do not delete the projectname/public/assets/pdf and projectname/public/assets/images folders even if they are empty.

After installation a default superadmin is created which you should use to create a verified super admin. You can then delete the old one once you have added and verified yourself.
Please note that no user can delete themselves as this could potentially leave no one with any access and would probably require reinstallation or some quite deft Postgres DB SQL manipulation.

Default super admin credentials:
username: super@super.infinity
password: root

Once a superadmin is created the rights cannot be reverted. A super admin is for life not just for..... unless you just delete them.