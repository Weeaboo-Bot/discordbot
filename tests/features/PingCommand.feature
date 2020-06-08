Feature: Simple Ping

  Scenario: easy Ping
    Given command !ping
    When I type !ping
    Then Weboo Bot will respond with a Pong string