import { Direction, Vector } from '../src/Util/Geometry';

describe('testing Vector', () => {
    test('creation', () => {
        const v1 = new Vector({ x: 5, y: 10 });
        expect(v1.x).toBe(5);
        expect(v1.y).toBe(10);
    });

    const testCases = [
        {
            a: { x: 5, y: 10 },
            b: { x: 2, y: 3 },
            sub: { x: 3, y: 7 },
            add: { x: 7, y: 13 },
            dot: 40,
            cross: -5,
            nearest5: { x: 5, y: 10 },
            nearest7: { x: 7, y: 7 },
            nearestUp5: { x: 5, y: 10 },
            nearestUp7: { x: 7, y: 14 },
            nearestDown5: { x: 5, y: 10 },
            nearestDown7: { x: 0, y: 7 },
            distance: 7.616,
            equals: false,
            string: '(5, 10)',
            angle: 0.540,
            direction4: Direction.RIGHT,
            direction8: Direction.RIGHT,
            scale2: { x: 10, y: 20 },
            scaleMinus1: { x: -5, y: -10 },
            magnitude: 11.180,
            normalised: { x: 0.447, y: 0.894 },
        },
        {
            a: { x: 5, y: 10 },
            b: { x: 5, y: 10 },
            sub: { x: 0, y: 0 },
            add: { x: 10, y: 20 },
            dot: 125,
            cross: 0,
            nearest5: { x: 5, y: 10 },
            nearest7: { x: 7, y: 7 },
            nearestUp5: { x: 5, y: 10 },
            nearestUp7: { x: 7, y: 14 },
            nearestDown5: { x: 5, y: 10 },
            nearestDown7: { x: 0, y: 7 },
            distance: 0,
            equals: true,
            string: '(5, 10)',
            angle: null,
            direction4: null,
            direction8: null,
            scale2: { x: 10, y: 20 },
            scaleMinus1: { x: -5, y: -10 },
            magnitude: 11.180,
            normalised: { x: 0.447, y: 0.894 },
        },
        {
            a: { x: 5, y: 10 },
            b: { x: 0, y: 0 },
            sub: { x: 5, y: 10 },
            add: { x: 5, y: 10 },
            dot: 0,
            cross: 0,
            nearest5: { x: 5, y: 10 },
            nearest7: { x: 7, y: 7 },
            nearestUp5: { x: 5, y: 10 },
            nearestUp7: { x: 7, y: 14 },
            nearestDown5: { x: 5, y: 10 },
            nearestDown7: { x: 0, y: 7 },
            distance: 11.180,
            equals: false,
            string: '(5, 10)',
            angle: 1.571,
            direction4: Direction.DOWN,
            direction8: Direction.DOWN,
            scale2: { x: 10, y: 20 },
            scaleMinus1: { x: -5, y: -10 },
            magnitude: 11.180,
            normalised: { x: 0.447, y: 0.894 },
        },
        {
            a: { x: 0, y: 0 },
            b: { x: 0, y: 0 },
            sub: { x: 0, y: 0 },
            add: { x: 0, y: 0 },
            dot: 0,
            cross: 0,
            nearest5: { x: 0, y: 0 },
            nearest7: { x: 0, y: 0 },
            nearestUp5: { x: 0, y: 0 },
            nearestUp7: { x: 0, y: 0 },
            nearestDown5: { x: 0, y: 0 },
            nearestDown7: { x: 0, y: 0 },
            distance: 0,
            equals: true,
            string: '(0, 0)',
            angle: null,
            direction4: null,
            direction8: null,
            scale2: { x: 0, y: 0 },
            scaleMinus1: { x: 0, y: 0 },
            magnitude: 0,
            normalised: { x: 0, y: 0 },
        },
        {
            a: { x: 5, y: 10 },
            b: { x: -5, y: -10 },
            sub: { x: 10, y: 20 },
            add: { x: 0, y: 0 },
            dot: -125,
            cross: 0,
            nearest5: { x: 5, y: 10 },
            nearest7: { x: 7, y: 7 },
            nearestUp5: { x: 5, y: 10 },
            nearestUp7: { x: 7, y: 14 },
            nearestDown5: { x: 5, y: 10 },
            nearestDown7: { x: 0, y: 7 },
            distance: 22.36,
            equals: false,
            string: '(5, 10)',
            angle: -1.571,
            direction4: Direction.UP,
            direction8: Direction.UP,
            scale2: { x: 10, y: 20 },
            scaleMinus1: { x: -5, y: -10 },
            magnitude: 11.180,
            normalised: { x: 0.447, y: 0.894 },
        },
        {
            a: { x: 5, y: 10 },
            b: { x: 0.01, y: 9.999 },
            sub: { x: 4.99, y: 0.001 },
            add: { x: 5.01, y: 19.999 },
            dot: 100.04,
            cross: 49.895,
            nearest5: { x: 5, y: 10 },
            nearest7: { x: 7, y: 7 },
            nearestUp5: { x: 5, y: 10 },
            nearestUp7: { x: 7, y: 14 },
            nearestDown5: { x: 5, y: 10 },
            nearestDown7: { x: 0, y: 7 },
            distance: 4.99,
            equals: false,
            string: '(5, 10)',
            angle: 1.571,
            direction4: Direction.DOWN,
            direction8: Direction.DOWN,
            scale2: { x: 10, y: 20 },
            scaleMinus1: { x: -5, y: -10 },
            magnitude: 11.180,
            normalised: { x: 0.447, y: 0.894 },
        },
    ];
    test.each(testCases)('$#: ($a.x, $a.y), ($b.x, $b.y) ', (testCase) => {
        const v1 = new Vector(testCase.a);

        const sub = v1.sub(testCase.b);
        expect(sub.x).toBeCloseTo(testCase.sub.x);
        expect(sub.y).toBeCloseTo(testCase.sub.y);
        const add = v1.add(testCase.b);
        expect(add.x).toBeCloseTo(testCase.add.x);
        expect(add.y).toBeCloseTo(testCase.add.y);
        const normalised = v1.normalised;
        expect(normalised.x).toBeCloseTo(testCase.normalised.x);
        expect(normalised.y).toBeCloseTo(testCase.normalised.y);
        const scale2 = v1.scale(2);
        expect(scale2.x).toBeCloseTo(testCase.scale2.x);
        expect(scale2.y).toBeCloseTo(testCase.scale2.y);
        const scaleMinus1 = v1.scale(-1);
        expect(scaleMinus1.x).toBeCloseTo(testCase.scaleMinus1.x);
        expect(scaleMinus1.y).toBeCloseTo(testCase.scaleMinus1.y);

        expect(v1.dot(testCase.b)).toBeCloseTo(testCase.dot);
        expect(v1.cross(testCase.b)).toBeCloseTo(testCase.cross);
        expect(v1.distanceTo(testCase.b)).toBeCloseTo(testCase.distance);
        expect(v1.roundToNearest(5)).toMatchObject(testCase.nearest5);
        expect(v1.roundToNearest(7)).toMatchObject(testCase.nearest7);
        expect(v1.roundUpToNearest(5)).toMatchObject(testCase.nearestUp5);
        expect(v1.roundUpToNearest(7)).toMatchObject(testCase.nearestUp7);
        expect(v1.roundDownToNearest(5)).toMatchObject(testCase.nearestDown5);
        expect(v1.roundDownToNearest(7)).toMatchObject(testCase.nearestDown7);
        expect(v1.equals(testCase.b)).toBe(testCase.equals);
        expect(v1.toString()).toBe(testCase.string);
        expect(v1.magnitude).toBeCloseTo(testCase.magnitude);
    });

    // Extra tests for direction stuff.
    const directionTestCases = [
        { x: 0, y: 0, expected4: null, expected8: null },
        { x: 5, y: 0, expected4: Direction.RIGHT, expected8: Direction.RIGHT },
        { x: 10, y: 5, expected4: Direction.RIGHT, expected8: Direction.DOWNRIGHT },
        { x: 10, y: 10, expected4: Direction.DOWN, expected8: Direction.DOWNRIGHT },
        { x: 5, y: 10, expected4: Direction.DOWN, expected8: Direction.DOWNRIGHT },
        { x: 0, y: 10, expected4: Direction.DOWN, expected8: Direction.DOWN },
        { x: -5, y: 10, expected4: Direction.DOWN, expected8: Direction.DOWNLEFT },
        { x: -10, y: 10, expected4: Direction.DOWN, expected8: Direction.DOWNLEFT },
        { x: -10, y: 5, expected4: Direction.LEFT, expected8: Direction.DOWNLEFT },
        { x: -10, y: 0, expected4: Direction.LEFT, expected8: Direction.LEFT },
        { x: -10, y: -5, expected4: Direction.LEFT, expected8: Direction.UPLEFT },
        { x: -10, y: -10, expected4: Direction.UP, expected8: Direction.UPLEFT },
        { x: -5, y: -10, expected4: Direction.UP, expected8: Direction.UPLEFT },
        { x: 0, y: -10, expected4: Direction.UP, expected8: Direction.UP },
        { x: 5, y: -10, expected4: Direction.UP, expected8: Direction.UPRIGHT },
        { x: 10, y: -10, expected4: Direction.UP, expected8: Direction.UPRIGHT },
    ];
    test.each(directionTestCases)('($x, $y).direction4() => $expected', (testCase) => {
        const vector = new Vector(testCase);
        expect(vector.direction4).toBe(testCase.expected4);
        expect(vector.direction8).toBe(testCase.expected8);
    });
});
