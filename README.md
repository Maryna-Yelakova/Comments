# Comments


This project is designed to add comments.

## Installation:

* Clone the project: git clone  https://github.com/Maryna-Yelakova/comments-task
* Navigate to the project folder
* Install node modules by running `npm install`
* Install the heroku toolbelt following the recommendations here: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
* Launch the project locally by running the following command: `heroku local web`

##Installation local PostgreSQL

* Download postgreSQL http://www.enterprisedb.com/products-services-training/pgdownload
* Install postgreSQL
* login to postgres console and create database "comments-task":
* CREATE DATABASE comments-task;
* restore dump by running the following command:
* psql -U postgres-user-name comments-task < path/to/database/dump.sql
* add environment variable PG_CONN with the following content:
* postgres://postgres-user-name : password @127.0.0.1/comments-task

## Application available online:

* https://comments-task.herokuapp.com/
