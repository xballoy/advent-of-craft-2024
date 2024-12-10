import {SantaService} from "../src/santaService";
import { ChildBuilder } from './child-builder';

describe('santa analyzing child requests', () => {
    const service = new SantaService();

    test('request is approved for nice child with feasible gift', () => {
        const child = new ChildBuilder().withNiceBehavior().withFeasibleGiftRequest().build();
        expect(service.evaluateRequest(child)).toBeTruthy();
    });

    test('request is denied for naughty child', () => {
        const child = new ChildBuilder().withNaughtyBehavior().withFeasibleGiftRequest().build();
        expect(service.evaluateRequest(child)).toBeFalsy();
    });

    test('request is denied for naughty child with infeasible gift', () => {
        const child = new ChildBuilder().withNaughtyBehavior().withInfeasibleGiftRequest().build();
        expect(service.evaluateRequest(child)).toBeFalsy();
    });

    test('request is denied for nice child with infeasible gift', () => {
        const child = new ChildBuilder().withNiceBehavior().withInfeasibleGiftRequest().build();
        expect(service.evaluateRequest(child)).toBeFalsy();
    });
});
