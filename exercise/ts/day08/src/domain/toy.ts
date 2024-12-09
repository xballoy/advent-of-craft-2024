export class Toy {
    static State = {
        UNASSIGNED: 'UNASSIGNED',
        IN_PRODUCTION: 'IN_PRODUCTION',
        COMPLETED: 'COMPLETED'
    };

    private readonly name: string;
    private state: string;

    constructor(name: string) {
        this.name = name;
        this.state = Toy.State.UNASSIGNED;
    }

    getName(): string {
        return this.name;
    }

    assignToElf() {
        if(this.isUnassigned) {
            this.markInProduction();
        }
    }

    get isUnassigned() {
        return this.state === Toy.State.UNASSIGNED;
    }

    get isInProduction() {
        return this.state === Toy.State.IN_PRODUCTION;
    }

    markInProduction() {
        return this.state = Toy.State.IN_PRODUCTION;
    }
}
