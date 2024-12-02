import {fizzbuzz} from '../src/fizzbuzz';
import * as O from 'fp-ts/Option';
import {isNone, isSome} from 'fp-ts/Option';
import * as fc from 'fast-check';
import {pipe} from 'fp-ts/function';

describe('FizzBuzz should return', () => {
    const config = {
        min: 1,
        max: 100,
        mapping: new Map<number, string>([
            [15, 'FizzBuzz'],
            [3, 'Fizz'],
            [5, 'Buzz'],
        ])
    }

    test.each([
        [1, '1'],
        [67, '67'],
        [82, '82'],
        [3, 'Fizz'],
        [66, 'Fizz'],
        [99, 'Fizz'],
        [5, 'Buzz'],
        [50, 'Buzz'],
        [85, 'Buzz'],
        [15, 'FizzBuzz'],
        [30, 'FizzBuzz'],
        [45, 'FizzBuzz']
    ])('its representation %s -> %s', (input, expectedResult) => {
        const conversionResult = fizzbuzz(config)(input);
        expect(isSome(conversionResult)).toBeTruthy();

        if (isSome(conversionResult)) {
            expect(conversionResult.value).toBe(expectedResult);
        }
    });

    test('valid strings for numbers between 1 and 100', () => {
        fc.assert(
            fc.property(
                fc.integer().filter(n => n >= config.min && n <= config.max),
                (n) => isConvertValid(n)
            )
        );
    });

    const isConvertValid = (input: number): boolean => pipe(
        fizzbuzz(config)(input),
        O.exists(result => validStringsFor(input).includes(result))
    );

    const validStringsFor = (x: number): string[] => ['Fizz', 'Buzz', 'FizzBuzz', x.toString()];

    test('none for numbers out of range', () => {
        fc.assert(
            fc.property(
                fc.integer().filter(n => n < config.min || n > config.max),
                (n) => isNone(fizzbuzz(config)(n))
            )
        );
    });
});
