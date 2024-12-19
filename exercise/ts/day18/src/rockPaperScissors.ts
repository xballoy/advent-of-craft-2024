export type Choice = '🪨' | '📄' | '✂️';
export type Winner = 'Player 1' | 'Player 2' | 'Draw';
export type Result = {
  winner: Winner;
  reason: string;
};
// biome-ignore lint/complexity/noStaticOnlyClass: keep exercise as-is
export class RockPaperScissors {
  static play(player1: Choice, player2: Choice): Result {
    if (player1 === player2) {
      return { winner: 'Draw', reason: 'same choice' };
    }

    const rules: Record<Choice, { beats: Choice; reason: string }> = {
      '🪨': { beats: '✂️', reason: 'rock crushes scissors' },
      '📄': { beats: '🪨', reason: 'paper covers rock' },
      '✂️': { beats: '📄', reason: 'scissors cuts paper' }
    };

    if (rules[player1].beats === player2) {
      return { winner: 'Player 1', reason: rules[player1].reason };
    }

    // Player 2 wins
    return { winner: 'Player 2', reason: rules[player2].reason };
  }
}
