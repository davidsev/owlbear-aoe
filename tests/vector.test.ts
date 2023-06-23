import Vector from '../src/Util/Vector';
import { Direction } from '../src/Util/Line';

describe('testing Vector', () => {
    test('creation', () => {
        const v1 = new Vector({ x: 5, y: 10 });
        expect(v1.x).toBe(5);
        expect(v1.y).toBe(10);
    });

    const subtractionTestCases = [
        { a: { x: 5, y: 10 }, b: { x: 2, y: 3 }, expected: { x: 3, y: 7 } },
        { a: { x: 5, y: 10 }, b: { x: 5, y: 10 }, expected: { x: 0, y: 0 } },
        { a: { x: 5, y: 10 }, b: { x: -5, y: -10 }, expected: { x: 10, y: 20 } },
        { a: { x: 5, y: 10 }, b: { x: 0.01, y: 9.999 }, expected: { x: 4.99, y: 0.001 } },
    ];
    test.each(subtractionTestCases)('($a.x, $a.y) - ($b.x, $b.y) = ($expected.x, $expected.y)', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.sub(data.b);
        expect(answer.x).toBeCloseTo(data.expected.x);
        expect(answer.y).toBeCloseTo(data.expected.y);
    });

    const additionTestCases = [
        { a: { x: 5, y: 10 }, b: { x: 2, y: 3 }, expected: { x: 7, y: 13 } },
        { a: { x: 5, y: 10 }, b: { x: 0, y: 0 }, expected: { x: 5, y: 10 } },
        { a: { x: 5, y: 10 }, b: { x: -2, y: -3 }, expected: { x: 3, y: 7 } },
        { a: { x: 5, y: 10 }, b: { x: 0.01, y: 9.999 }, expected: { x: 5.01, y: 19.999 } },
    ];
    test.each(additionTestCases)('($a.x, $a.y) + ($b.x, $b.y) = ($expected.x, $expected.y)', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.add(data.b);
        expect(answer.x).toBeCloseTo(data.expected.x);
        expect(answer.y).toBeCloseTo(data.expected.y);
    });

    const dotTestCases = [
        { a: { x: 5, y: 10 }, b: { x: 2, y: 3 }, expected: 40 },
        { a: { x: 5, y: 10 }, b: { x: -2, y: -3 }, expected: -40 },
        { a: { x: 5, y: 10 }, b: { x: 0, y: 0 }, expected: 0 },
        { a: { x: 5, y: 10 }, b: { x: 0.01, y: 9.999 }, expected: 100.04 },
    ];
    test.each(dotTestCases)('($a.x, $a.y).dot($b.x, $b.y) = $expected', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.dot(data.b);
        expect(answer).toBeCloseTo(data.expected);
    });

    const crossTestCases = [
        { a: { x: 5, y: 10 }, b: { x: 2, y: 3 }, expected: -5 },
        { a: { x: 5, y: 10 }, b: { x: -2, y: -3 }, expected: 5 },
        { a: { x: 5, y: 10 }, b: { x: 0, y: 0 }, expected: 0 },
        { a: { x: 5, y: 10 }, b: { x: 0.01, y: 9.999 }, expected: 49.895 },
    ];
    test.each(crossTestCases)('($a.x, $a.y).cross($b.x, $b.y) = $expected', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.cross(data.b);
        expect(answer).toBeCloseTo(data.expected);
    });

    const roundToNearestTestCases = [
        { a: { x: 5, y: 10 }, nearest: 5, expected: { x: 5, y: 10 } },
        { a: { x: 5, y: 10 }, nearest: 7, expected: { x: 7, y: 7 } },
        { a: { x: 3.5678, y: 2.5 }, nearest: 5, expected: { x: 5, y: 5 } },
    ];
    test.each(roundToNearestTestCases)('($a.x, $a.y).roundToNearest($nearest) = ($expected.x, $expected.y)', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.roundToNearest(data.nearest);
        expect(answer).toMatchObject(data.expected);
    });

    const roundUpToNearestTestCases = [
        { a: { x: 5, y: 10 }, nearest: 5, expected: { x: 5, y: 10 } },
        { a: { x: 5, y: 10 }, nearest: 7, expected: { x: 7, y: 14 } },
        { a: { x: 3.5678, y: 2.5 }, nearest: 5, expected: { x: 5, y: 5 } },
    ];
    test.each(roundUpToNearestTestCases)('($a.x, $a.y).roundUpToNearest($nearest) = ($expected.x, $expected.y)', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.roundUpToNearest(data.nearest);
        expect(answer).toMatchObject(data.expected);
    });

    const roundDownToNearestTestCases = [
        { a: { x: 5, y: 10 }, nearest: 5, expected: { x: 5, y: 10 } },
        { a: { x: 5, y: 10 }, nearest: 7, expected: { x: 0, y: 7 } },
        { a: { x: 3.5678, y: 2.5 }, nearest: 5, expected: { x: 0, y: 0 } },
    ];
    test.each(roundDownToNearestTestCases)('($a.x, $a.y).roundDownToNearest($nearest) = ($expected.x, $expected.y)', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.roundDownToNearest(data.nearest);
        expect(answer).toMatchObject(data.expected);
    });

    const distanceToTestCases = [
        { a: { x: 5, y: 10 }, b: { x: 2, y: 3 }, expected: 7.616 },
        { a: { x: 5, y: 10 }, b: { x: -5, y: 0 }, expected: 14.142 },
        { a: { x: 5, y: 10 }, b: { x: 5, y: 10 }, expected: 0 },
        { a: { x: 5, y: 10 }, b: { x: 5, y: 0 }, expected: 10 },
        { a: { x: 5, y: 10 }, b: { x: 0, y: 0 }, expected: 11.180 },
    ];
    test.each(distanceToTestCases)('($a.x, $a.y).distanceTo($b.x, $b.y) = $expected', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.distanceTo(data.b);
        expect(answer).toBeCloseTo(data.expected);
    });

    const equalsTestCases = [
        { a: { x: 5, y: 10 }, b: { x: 5, y: 10 }, expected: true },
        { a: { x: 5, y: 10 }, b: { x: 5, y: 0 }, expected: false },
        { a: { x: 5, y: 10 }, b: { x: 0, y: 10 }, expected: false },
        { a: { x: 5, y: 10 }, b: { x: 0, y: 0 }, expected: false },
    ];
    test.each(equalsTestCases)('($a.x, $a.y).equals($b.x, $b.y) = $expected', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.equals(data.b);
        expect(answer).toBe(data.expected);
    });

    const toStringTestCases = [
        { a: { x: 5, y: 10 }, expected: '(5, 10)' },
        { a: { x: 5.123, y: 10.456 }, expected: '(5, 10)' },
        { a: { x: 5.9, y: 10.9 }, expected: '(6, 11)' },
    ];
    test.each(toStringTestCases)('($a.x, $a.y).toString() = $expected', (data) => {
        const v1 = new Vector(data.a);
        const answer = v1.toString();
        expect(answer).toBe(data.expected);
    });

    const angleTestCases = [
        { x: 5, y: 10, expected: 1.107 },
        { x: -5, y: -10, expected: -2.034 },
        { x: 0, y: 0, expected: null },
        { x: 0, y: 10, expected: 1.571 },
        { x: 5, y: 0, expected: 0 },
        { x: 5, y: 0, expected: 0 },
        { x: 5, y: 10, expected: 1.107 },
        { x: 5, y: -10, expected: -1.107 },
    ];
    test.each(angleTestCases)('($x, $y).angle() => $expected', ({ x, y, expected }) => {
        const vector = new Vector({ x, y });
        if (expected === null)
            expect(vector.angle).toBeNull();
        else
            expect(vector.angle).toBeCloseTo(expected);
    });

    const directionTestCases = [
        { x: 5, y: 10, expected: Direction.UP },
        { x: -5, y: -10, expected: Direction.DOWN },
        { x: 0, y: 0, expected: null },
        { x: -25, y: 10, expected: Direction.LEFT },
        { x: 5, y: 0, expected: Direction.RIGHT },
        { x: 5, y: 0, expected: Direction.RIGHT },
        { x: 5, y: 10, expected: Direction.UP },
        { x: 5, y: -10, expected: Direction.DOWN },
    ];
    test.each(directionTestCases)('($x, $y).direction() => $expected', ({ x, y, expected }) => {
        const vector = new Vector({ x, y });
        expect(vector.direction).toBe(expected);
    });

});
