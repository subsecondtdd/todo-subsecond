# TODO Subsecond

## Install Software

* [Node.js](https://nodejs.org/en/download/)

## Create Database

If you have Postgres installed you can use that. Otherwise you can use SQlite (does not require a separate installation).

### Postgres

    createdb todo-subsecond

### SQlite

    # Windows users: Use SET instead of export
    export DATABASE_URL=sqlite:./todo-subsecond.sqlite

## Install dependencies

    npm install

## Run tests

    npm test

Or:

    ./features/run/all # See other scripts in the same directory

### Change browser

The `webdriver-*` assemblies will use Chrome by default. You can change to another browser if you want:

    # Windows users: Use SET instead of export
    export SELENIUM_BROWSER=firefox
    brew install geckodriver

## Run the server

    npm start
