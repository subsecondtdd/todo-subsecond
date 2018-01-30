# TODO Subsecond

[![CircleCI](https://circleci.com/gh/subsecondtdd/todo-subsecond.svg?style=svg)](https://circleci.com/gh/subsecondtdd/todo-subsecond)

This is a tiny application with full-stack acceptance tests that can run in milliseconds. The purpose is to illustrate
the essential techniques to achieve this in any system.

Through a series of exercises you'll get familiar with a particular way of doing TDD/BDD:

1. Small increments. Work at a single layer at a time.
2. Fast (sub-second) feedback loop.
3. UI-agnostic scenarios. Describe system behaviour rather than implemention.
4. Testing through the UI without the typical drawbacks (slow, brittle).

Fast and stable full-stack tests that go through the UI are possible when the following criteria are satisfied:

* No I/O whatsoever
  * No I/O between your test and a browser automation tool like Selenium WebDriver
  * No I/O between Selenium WebDriver and a browser
  * No I/O between the browser application and the server
  * No I/O between the server and a database
* Clearly defined interfaces/contracts that allow swapping out the slow I/O bound components above
* UI and server run in the same process
  * This is possible thanks to [cucumber-electron](https://github.com/cucumber/cucumber-electron)
* Tests/Scenarios are decoupled from the UI, allowing the UI to change with minimal impact on tests

## Credits and inspiration

The techniques illustrated by this application are inspired by:

* [Nat Pryce's "Having Our Cake and Eating it](https://youtu.be/Fk4rCn4YLLU) - slides [here](https://speakerdeck.com/npryce/having-our-cake-and-eating-it-1)
* [Jan Molak's "Testing modern web apps. At scale."](http://agileonthebeach.com/testing-modern-web-apps-scale-jan-molak-software-delivery-2017/)
* Josh's colleagues at [Featurist](https://www.featurist.co.uk/)
* Aslak's colleagues at [Cucumber Ltd](https://cucumber.io)

## Install Software

* [Node.js 8.x or higher](https://nodejs.org/en/download/current/)

## Install dependencies

    npm install

## Create a database

Although this repository is intended as a demonstration of a design pattern, we want it to be as realistic as possible. So ideally you should use a database that you might use in production, like the [instance we deployed with a postgres database](https://todo-subsecond.herokuapp.com).

If you have Postgres installed you can use that. If you have MySQL you can use that as well (see [MySQL](###MySQL)). Otherwise you can use SQlite (this is simpler as it does not require a separate installation):

### Postgres

    createdb todo-subsecond

### SQlite

    # Linux/OSX:
    export DATABASE_URL=sqlite:./todo-subsecond.sqlite

    # Windows:
    set DATABASE_URL=sqlite:./todo-subsecond.sqlite

### MySQL

Execute SQL script `db/mysql/todo-subsecond.sql`
    
```sh
mysql -u username -p < db/mysql/todo-subsecond.sql
```

    # Linux/OSX:
    export DATABASE_URL='mysql://user:password@localhost:3306/todo-subsecond'

    # Windows:
    set DATABASE_URL='mysql://user:password@localhost:3306/todo-subsecond'

## Run tests

Run all the tests in a single command:

    # Linux/OSX:
    features/run/all

    # Windows:
    features\run\all

Or just one assembly at a time (we'll explain assemblies further down):

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

## Start the server

The application is a small web application that renders a simple single-page application. Fire it up:

    npm start

Open `http://localhost:8666` in your browser and add a couple of todos.

![screenshot](docs/screenshot.png)

Check one of them and refresh the page. As you'll see, the application doesn't remember that a todo is marked as done.

## Implement a new feature

We're going to improve the application to make it remember the state of todos.

Uncomment the three steps in `features/todo.feature` and run `features/run/all` again. Cucumber will tell you that
two steps are undefined. Copy the first snippet and paste it into `features/step_definitions/todo_steps.js`.

Modify it so it looks like this:

```javascript
When('I mark the {ordinal} todo as done', async function (index) {
  const todoList = await this.actionTodoList()
  await todoList.markAsDone(index)
})
```

Run Cucumber again. This time you'll get an error. Open `test_support/MemoryTodoList.js` and implement a new
`markAsDone` method.

Run `features/run/all` again until you've managed to get the 2nd step to pass.

Now, paste the snippet for the last undefined step and modify it:

```javascript
Then('the {ordinal} todo should be marked as done', async function (index) {
  const todoList = await this.outcomeTodoList()
  const todos = await todoList.getTodos()
  assert.equal(todos[index].done, true)
})
```

Run `features/run/all` again until all steps pass. When they do, Cucumber will run the same scenario in a new configuration,
`dom-memory`. This will fail. Now you need to make changes to `DomTodoList.js`.

Continue until everything is green. Every time you have a failing step you can make small increments in a single layer
of the application. Eventually all scenarios should pass.

When they do, you can do a final manual test just to give yourself confidence that everything works as expected.

That's it - subsecond TDD with acceptance tests that run in milliseconds while you're developing. You shouldn't have to
rely on the slow acceptance tests (`webdriver-memory` and `webdriver-http-database`) while you're implementing the new
functionality. You should only run them at the end to give you full confidence, and they should just pass without
requiring you to make any changes.

## Assemblies

When you look at `features/todo.feature` and `features/step_definitions/todo_steps.js` you'll notice that the scenarios
and step definitions make no assumptions about how to interact with the application.

We're interacting with the application *through a contract*, or an *interface* - `addTodo` and `getTodos`. Think of your
scenarios as a lego-like block that can be connected to another block that satisfies this contract:

![lego](docs/test.png)

In a statically typed language such as Java, C# or TypeScript, this would be an interface. With JavaScript it's just
*implicitly* defined.

Several parts of the application as well as additional test code can implement this interface/contract:

![lego](docs/lego.png)

There are three kinds of blocks:

* Green blocks represent *test code*
* Blue blocks represent *application code*
* Pink blocks represent *infrastructure*

Tests can be connected to the top of any stack of blocks and test different assemblies
of the application.

A tall stack of blocks gives more confidence at the cost of speed.

The speed doesn't depend directly on the number of blocks, but rather on the
amount of I/O happening *between* each block and the amount of CPU processing
happening *inside* each block.
