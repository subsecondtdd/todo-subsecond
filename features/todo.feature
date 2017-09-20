Feature: Todo

  Scenario: Create Todo
    Given there is 1 todo
    When I create a todo
    Then there should be 2 todos

  Scenario: Mark Todo Done
  Scenario: Mark Todo Undone
  Scenario: Delete Todo
