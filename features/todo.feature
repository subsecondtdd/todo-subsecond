Feature: Todo

  Scenario: Create Todo
    Given the todo list has 1 todo
    When I add a todo to the todo list
    Then there should be 2 todos in the todo list

  Scenario: Mark Todo Done
  Scenario: Mark Todo Undone
  Scenario: Delete Todo
