# TODO Subsecond

This is a tiny application that illustrates how to run acceptance tests in
milliseconds.

This is possible by designing the application as well as the tests using
interfaces/contracts that allows the application to be assembled in different ways.

There are three kinds of blocks:

* Green blocks represent *test code*
* Blue blocks represent *application code*
* Pink blocks represent *infrastructure*

![lego](docs/lego.png)

The tests can then be connected to the top of this stack of blocks and test the
application in different configurations.

A tall stack of blocks gives more confidence at the cost of speed.

The speed doesn't depend directly on the number of blocks, but rather on the
amount of I/O happening *between* each block and the amount of CPU processing
happening *inside* each block.

## Install Software

* [Node.js](https://nodejs.org/en/download/)

## Install dependencies

    npm install

## Create a database

Although this repository is intended as a demonstration of a design pattern, we want it to be as realistic as possible. So ideally you should use a database that you might use in production, like the [instance we deployed with a a postgres database](https://todo-subsecond.herokuapp.com).

If you have Postgres installed you can use that. Otherwise you can use SQlite (this is simpler as it does not require a separate installation):

### Postgres

    createdb todo-subsecond

### SQlite

    # Linux/OSX:
    export DATABASE_URL=sqlite:./todo-subsecond.sqlite

    # Windows:
    set DATABASE_URL=sqlite:./todo-subsecond.sqlite

## Run tests

Run all the tests in a single command:

    # Linux/OSX:
    features/run/all

    # Windows:
    features\run\all

Or just one assembly at a time:

    # Linux/OSX:
    features/run/memory

    # Windows:
    features\run\memory

### Change browser

The `webdriver-*` assemblies will use Chrome by default. You can change to another browser if you want:

    # Linux/OSX:
    brew install geckodriver
    export SELENIUM_BROWSER=firefox

    # Windows:
    set SELENIUM_BROWSER=firefox

## Run the server

    npm start
