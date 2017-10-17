Feature: Todo

  Scenario: Create Todo
    Given Josh has added 1 todo
    When Josh adds "get milk"
    Then the text of Josh's 2nd todo should be "get milk"

  Scenario: See someone else's Todo
    Given Josh has added 1 todo
    When Aslak adds "get milk"
    Then the text of Josh's 2nd todo should be "get milk"

  Scenario: Mark Todo Done
    # Given Josh has added 2 todos
    # When Aslak marks the 2nd todo as done
    # Then Josh's 2nd todo should be marked as done

  Scenario: Mark Todo Undone
  Scenario: Delete Todo
