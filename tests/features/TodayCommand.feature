Feature: Test the !today Command
  I want to get information about events on today's date

  Scenario: I Type !today
    Given command !today
    When I Type !today
    Then Discord Bot will respond with info from today's date
