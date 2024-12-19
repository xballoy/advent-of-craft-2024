import assert from 'node:assert';
import { Given, Then, When } from '@cucumber/cucumber';
import {
  type Choice,
  type Result,
  RockPaperScissors,
} from '../../src/rockPaperScissors';

let result: Result;
let player1: Choice;
let player2: Choice;

Given(/^Player (\d+) chooses (.*)$/, (player, choice) => {
  if (player === 1) player1 = choice;
  else player2 = choice;
});

When(/^they play$/, () => {
  result = RockPaperScissors.play(player1, player2);
});

Then(
  /^the result should be (.*) because (.*)$/,
  (expectedWinner, expectedReason) => {
    assert.deepEqual(result, {
      winner: expectedWinner,
      reason: expectedReason,
    });
  },
);
