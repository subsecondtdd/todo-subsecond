# TODO Subsecond

## Install Software

* [Node.js](https://nodejs.org/en/download/)

## Create Database

If you have Postgres installed you can use that. Otherwise you can use SQlite.

### Postgres

    createdb todo-subsecond

### SQlite

    export DATABASE_URL=sqlite:./todo-subsecond.sqlite

## Install dependencies

    npm install

## Run tests

    npm test

Or:

    ./features/run/all # See other scrips in the same directory

### Change browser

The `webdriver-*` assemblies will use Chrome by default. You can change to another browser if you want:

    export SELENIUM_BROWSER=firefox
    brew install geckodriver

## Run the server

    npm start