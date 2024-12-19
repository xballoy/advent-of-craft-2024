Feature: Rock Paper Scissors Game

  Scenario: Player 1 wins with 🪨 over ✂️
    Given Player 1 chooses 🪨
    And Player 2 chooses ✂️
    When they play
    Then the result should be Player 1 because rock crushes scissors

  Scenario: Player 1 wins with 🪨 over 🦎
    Given Player 1 chooses 🪨
    And Player 2 chooses 🦎
    When they play
    Then the result should be Player 1 because rock crushes lizard

  Scenario: Player 1 wins with 📄 over 🪨
    Given Player 1 chooses 📄
    And Player 2 chooses 🪨
    When they play
    Then the result should be Player 1 because paper covers rock

  Scenario: Player 1 wins with 📄 over 🖖
    Given Player 1 chooses 📄
    And Player 2 chooses 🖖
    When they play
    Then the result should be Player 1 because paper disproves spock

  Scenario: Player 1 wins with ✂️ over 📄
    Given Player 1 chooses ✂️
    And Player 2 chooses 📄
    When they play
    Then the result should be Player 1 because scissors cuts paper

  Scenario: Player 1 wins with ✂️ over 🦎
    Given Player 1 chooses ✂️
    And Player 2 chooses 🦎
    When they play
    Then the result should be Player 1 because scissors decapitates lizard

  Scenario: Player 1 wins with 🖖 over ✂️
    Given Player 1 chooses 🖖
    And Player 2 chooses ✂️
    When they play
    Then the result should be Player 1 because spock smashes scissors

  Scenario: Player 1 wins with 🖖 over 🪨
    Given Player 1 chooses 🖖
    And Player 2 chooses 🪨
    When they play
    Then the result should be Player 1 because spock vaporizes rock

  Scenario: Player 1 wins with 🦎 over 📄
    Given Player 1 chooses 🦎
    And Player 2 chooses 📄
    When they play
    Then the result should be Player 1 because lizard eats paper

  Scenario: Player 1 wins with 🦎 over 🖖
    Given Player 1 chooses 🦎
    And Player 2 chooses 🖖
    When they play
    Then the result should be Player 1 because lizard poisons spock

  Scenario Outline: Draw
    Given Player 1 chooses <choice>
    And Player 2 chooses <choice>
    When they play
    Then the result should be Draw because same choice

    Examples:
      | choice |
      | 🪨     |
      | ✂️     |
      | 📄     |
      | 🦎     |
      | 🖖     |
