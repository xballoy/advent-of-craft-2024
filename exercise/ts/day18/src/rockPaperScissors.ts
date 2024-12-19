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

    const rules: Record<Choice, { beats: Choice; reason: string }[]> = {
      '🪨': [{ beats: '✂️', reason: 'rock crushes scissors' }],
      '📄': [{ beats: '🪨', reason: 'paper covers rock' }],
      '✂️': [{ beats: '📄', reason: 'scissors cuts paper' }]
    };

    const maybePlayer1Rule = rules[player1].find(rule => rule.beats === player2);
    if (maybePlayer1Rule) {
      return { winner: 'Player 1', reason: maybePlayer1Rule.reason };
    }

    const maybePlayer2Rule = rules[player2].find(rule => rule.beats === player1);
    if (maybePlayer2Rule) {
      return { winner: 'Player 2', reason: maybePlayer2Rule.reason };
    }

    throw new Error(`Player 1 chooses ${player1} and Player 2 chooses ${player2} but no rule matches`);
  }
}
