export type Choice = '🪨' | '📄' | '✂️' | '🦎' | '🖖';
export type Winner = 'Player 1' | 'Player 2' | 'Draw';
export type Result = {
  winner: Winner;
  reason: string;
};

const Rules: Record<Choice, { beats: Choice; reason: string }[]> = {
  '🪨': [
    { beats: '✂️', reason: 'rock crushes scissors' },
    { beats: '🦎', reason: 'rock crushes lizard' },
  ],
  '📄': [
    { beats: '🪨', reason: 'paper covers rock' },
    { beats: '🖖', reason: 'paper disproves spock' },
  ],
  '✂️': [
    { beats: '📄', reason: 'scissors cuts paper' },
    { beats: '🦎', reason: 'scissors decapitates lizard' },
  ],
  '🖖': [
    { beats: '✂️', reason: 'spock smashes scissors' },
    { beats: '🪨', reason: 'spock vaporizes rock' },
  ],
  '🦎': [
    { beats: '📄', reason: 'lizard eats paper' },
    { beats: '🖖', reason: 'lizard poisons spock' },
  ],
};

// biome-ignore lint/complexity/noStaticOnlyClass: keep exercise as-is
export class RockPaperScissors {
  static play(player1: Choice, player2: Choice): Result {
    if (player1 === player2) {
      return { winner: 'Draw', reason: 'same choice' };
    }

    const maybePlayer1Rule = Rules[player1].find(
      (rule) => rule.beats === player2,
    );
    if (maybePlayer1Rule) {
      return { winner: 'Player 1', reason: maybePlayer1Rule.reason };
    }

    const maybePlayer2Rule = Rules[player2].find(
      (rule) => rule.beats === player1,
    );
    if (maybePlayer2Rule) {
      return { winner: 'Player 2', reason: maybePlayer2Rule.reason };
    }

    throw new Error(
      `Player 1 chooses ${player1} and Player 2 chooses ${player2} but no rule matches`,
    );
  }
}
