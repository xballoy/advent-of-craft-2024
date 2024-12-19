export type Choice = '🪨' | '📄' | '✂️';
export type Winner = 'Player 1' | 'Player 2' | 'Draw';
export type Result = {
  winner: Winner;
  reason: string;
};
// biome-ignore lint/complexity/noStaticOnlyClass: keep exercise as-is
export class RockPaperScissors {
  static play(player1: Choice, player2: Choice): Result {
    if (player1 === player2) return { winner: 'Draw', reason: 'same choice' };
    if (player1 === '🪨' && player2 === '✂️') {
      return { winner: 'Player 1', reason: 'rock crushes scissors' };
    }
    if (player1 === '📄' && player2 === '🪨') {
      return { winner: 'Player 1', reason: 'paper covers rock' };
    }
    if (player1 === '✂️' && player2 === '📄') {
      return { winner: 'Player 1', reason: 'scissors cuts paper' };
    }
    if (player2 === '🪨' && player1 === '✂️') {
      return { winner: 'Player 2', reason: 'rock crushes scissors' };
    }
    if (player2 === '📄' && player1 === '🪨') {
      return { winner: 'Player 2', reason: 'paper covers rock' };
    }
    return { winner: 'Player 2', reason: 'scissors cuts paper' };
  }
}
