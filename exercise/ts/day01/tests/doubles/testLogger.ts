import {Logger} from "../../src/logger";

export class TestLogger implements Logger {
    private message: string | undefined;

    public log(message: string): void {
        this.message = message;
    }

    public getLog(): string | undefined {
        return this.message;
    }
}
