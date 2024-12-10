export class Building {
    static whichFloor(instructions: string): number {
        let val: Array<[string, number]> = [];

        for (let i = 0; i < instructions.length; i++) {
            const c = instructions[i];

            if (instructions.includes("🧝")) {
                let j: number;
                if (c === ')') {
                    j = 3;
                } else if (c === '(') {
                    j = -2;
                } else {
                    j = 0;
                }
                val.push([c, j]);
            } else if (!instructions.includes("🧝")) {
                val.push([c, c === '(' ? 1 : -1]);
            } else {
                val.push([c, c === '(' ? 42 : -2]);
            }
        }

        let result = 0;
        for (const kp of val) {
            result += kp[1];
        }

        return result;
    }
}
