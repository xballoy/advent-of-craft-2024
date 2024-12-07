import {Gift} from "../src/workshop/gift";
import {Workshop} from "../src/workshop/workshop";
import {Status} from "../src/workshop/status";

const workshopBuilder = () => {
    const workshop = new Workshop();

    return {
        produce: (name: string) => {
            const gift = new Gift(name)
            workshop.addGift(gift);
            return {
                status: () => gift.getStatus(),
                complete: () => {
                    return workshop.completeGift(name);
                },
            }
        },
        complete: (name: string) => {
            return workshop.completeGift(name);
        },
    }
}

describe('Workshop', () => {
    const TOY_NAME = '1 Super Nintendo';

    it('completes a gift and sets its status to produced', () => {
        expect(workshopBuilder().produce(TOY_NAME).complete().getStatus()).toBe(Status.Produced);
    });

    it('returns null when trying to complete a non-existing gift', () => {
        expect(workshopBuilder().complete('NonExistingToy')).toBeNull();
    });
});
