import { Direction, Line } from '../src/Util/Line';

describe('testing Line', () => {
    test('creation', () => {
        const l1 = new Line({ x: 5, y: 10 }, { x: 10, y: 20 });
        expect(l1.p1).toMatchObject({ x: 5, y: 10 });
        expect(l1.p2).toMatchObject({ x: 10, y: 20 });
    });

    const boundingBoxTestCases = [
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: { x: 5, y: 10, w: 5, h: 10 } },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: { x: 5, y: 10, w: 5, h: 10 } },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 10 }, expected: { x: 5, y: 10, w: 0, h: 0 } },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 }, expected: { x: 5, y: 10, w: 0, h: 10 } },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 }, expected: { x: 5, y: 10, w: 5, h: 0 } },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: { x: 5, y: 10, w: 5, h: 10 } },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: { x: 5, y: 10, w: 5, h: 10 } },
        { p1: { x: 5, y: 20 }, p2: { x: 10, y: 10 }, expected: { x: 5, y: 10, w: 5, h: 10 } },
    ];
    test.each(boundingBoxTestCases)('bounding box', ({ p1, p2, expected }) => {
        const line = new Line(p1, p2);
        expect(line.boundingBox).toMatchObject(expected);
    });

    const lengthTestCases = [
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: 11.180 },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: 11.180 },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 10 }, expected: 0 },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 }, expected: 10 },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 }, expected: 5 },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: 11.180 },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: 11.180 },
        { p1: { x: 5, y: 20 }, p2: { x: 10, y: 10 }, expected: 11.180 },
    ];
    test.each(lengthTestCases)('length(($p1.x, $p1.y),($p2.x,$p2.y)) => $expected', ({ p1, p2, expected }) => {
        const line = new Line(p1, p2);
        expect(line.length).toBeCloseTo(expected);
    });

    const angleTestCases = [
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: 1.107 },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: -2.034 },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 10 }, expected: null },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 }, expected: 1.571 },
        { p1: { x: 5, y: 0 }, p2: { x: 10, y: 0 }, expected: 0 },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 }, expected: 0 },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: 1.107 },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: -2.034 },
        { p1: { x: 5, y: 20 }, p2: { x: 10, y: 10 }, expected: -1.107 },
    ];
    test.each(angleTestCases)('angle(($p1.x, $p1.y),($p2.x,$p2.y)) => $expected', ({ p1, p2, expected }) => {
        const line = new Line(p1, p2);
        if (expected === null)
            expect(line.angle).toBeNull();
        else
            expect(line.angle).toBeCloseTo(expected);
    });

    const directionTestCases = [
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: Direction.UP },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: Direction.DOWN },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 10 }, expected: null },
        { p1: { x: 5, y: 10 }, p2: { x: -20, y: 20 }, expected: Direction.LEFT },
        { p1: { x: 5, y: 0 }, p2: { x: 10, y: 0 }, expected: Direction.RIGHT },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 }, expected: Direction.RIGHT },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: Direction.UP },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: Direction.DOWN },
        { p1: { x: 5, y: 20 }, p2: { x: 10, y: 10 }, expected: Direction.DOWN },
    ];
    test.each(directionTestCases)('direction(($p1.x, $p1.y),($p2.x,$p2.y)) => $expected', ({ p1, p2, expected }) => {
        const line = new Line(p1, p2);
        expect(line.direction).toBe(expected);
    });

    const vectorTestCases = [
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: { x: 5, y: 10 } },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: { x: -5, y: -10 } },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 10 }, expected: { x: 0, y: 0 } },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 }, expected: { x: 0, y: 10 } },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 }, expected: { x: 5, y: 0 } },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: { x: 5, y: 10 } },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: { x: -5, y: -10 } },
        { p1: { x: 5, y: 20 }, p2: { x: 10, y: 10 }, expected: { x: 5, y: -10 } },
        { p1: { x: 5, y: -10 }, p2: { x: -10, y: 20 }, expected: { x: -15, y: 30 } },
    ];
    test.each(vectorTestCases)(
        'vector(($p1.x, $p1.y),($p2.x,$p2.y)) => ($expected.x, $expected.y)',
        ({ p1, p2, expected }) => {
            const line = new Line(p1, p2);
            expect(line.vector).toMatchObject(expected);
        });

    const midpointTestCases = [
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: { x: 7.5, y: 15 } },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: { x: 7.5, y: 15 } },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 10 }, expected: { x: 5, y: 10 } },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 }, expected: { x: 5, y: 15 } },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 }, expected: { x: 7.5, y: 10 } },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: { x: 7.5, y: 15 } },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: { x: 7.5, y: 15 } },
        { p1: { x: 5, y: 20 }, p2: { x: 10, y: 10 }, expected: { x: 7.5, y: 15 } },
        { p1: { x: 5, y: -10 }, p2: { x: -10, y: 20 }, expected: { x: -2.5, y: 5 } },
    ];
    test.each(midpointTestCases)(
        'midpoint(($p1.x, $p1.y),($p2.x,$p2.y)) => ($expected.x, $expected.y)',
        ({ p1, p2, expected }) => {
            const line = new Line(p1, p2);
            expect(line.midpoint).toMatchObject(expected);
        });

    const intersectionTestCases = [
        {
            p1: { x: 5, y: 10 },
            p2: { x: 10, y: 20 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
            expected: { x: 7.5, y: 15 },
        },
        {
            p1: { x: 10, y: 20 },
            p2: { x: 5, y: 10 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
            expected: { x: 7.5, y: 15 },
        },
        {
            p1: { x: 5, y: 10 },
            p2: { x: 5, y: 20 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
            expected: { x: 5, y: 20 },
        },
        {
            p1: { x: 5, y: 10 },
            p2: { x: 10, y: 10 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
            expected: { x: 10, y: 10 },
        },
        {
            p1: { x: 5, y: 10 },
            p2: { x: 10, y: 20 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
            expected: { x: 7.5, y: 15 },
        },
        {
            p1: { x: 10, y: 20 },
            p2: { x: 5, y: 10 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
            expected: { x: 7.5, y: 15 },
        },
        {
            p1: { x: 5, y: 20 },
            p2: { x: 10, y: 10 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
            expected: { x: 7.5, y: 15 },
        },
    ];
    test.each(intersectionTestCases)(
        'intersection(($p1.x, $p1.y),($p2.x,$p2.y),($p3.x,$p3.y),($p4.x,$p4.y)) => ($expected.x, $expected.y)',
        ({ p1, p2, p3, p4, expected }) => {
            const line1 = new Line(p1, p2);
            const line2 = new Line(p3, p4);
            expect(line1.getIntersection(line2)).toMatchObject(expected);
        });

    const intersectionNullTestCases = [
        {
            p1: { x: 5, y: -10 },
            p2: { x: -10, y: 20 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
        },
        {
            p1: { x: 5, y: 10 },
            p2: { x: 5, y: 10 },
            p3: { x: 5, y: 20 },
            p4: { x: 10, y: 10 },
        },
        {
            p1: { x: 450, y: -300 },
            p2: { x: 921, y: -475 },
            p3: { x: 900, y: -300 },
            p4: { x: 900, y: -450 },
            expected: { x: 7.5, y: 15 },
        },
    ];
    test.each(intersectionNullTestCases)(
        'intersection(($p1.x, $p1.y),($p2.x,$p2.y),($p3.x,$p3.y),($p4.x,$p4.y)) => null',
        ({ p1, p2, p3, p4 }) => {
            const line1 = new Line(p1, p2);
            const line2 = new Line(p3, p4);
            expect(line1.getIntersection(line2)).toBeNull();
        });

    const toStringTestCases = [
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 20 }, expected: 'Line(5,10 -> 10,20)' },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 10 }, expected: 'Line(10,20 -> 5,10)' },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 }, expected: 'Line(5,10 -> 5,20)' },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 }, expected: 'Line(5,10 -> 10,10)' },
    ];
    test.each(toStringTestCases)(
        'toString(($p1.x, $p1.y),($p2.x,$p2.y)) => $expected',
        ({ p1, p2, expected }) => {
            const line = new Line(p1, p2);
            expect(line.toString()).toBe(expected);
        });

    const normalizeDirectionTestCases = [
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 }, expected: { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 } } },
        { p1: { x: 10, y: 20 }, p2: { x: 5, y: 20 }, expected: { p1: { x: 5, y: 20 }, p2: { x: 10, y: 20 } } },
        { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 }, expected: { p1: { x: 5, y: 10 }, p2: { x: 5, y: 20 } } },
        { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 }, expected: { p1: { x: 5, y: 10 }, p2: { x: 10, y: 10 } } },
    ];
    test.each(normalizeDirectionTestCases)(
        'normalizeDirection(($p1.x, $p1.y),($p2.x,$p2.y)) => ($expected.p1.x, $expected.p1.y),($expected.p2.x,$expected.p2.y)',
        ({ p1, p2, expected }) => {
            const line = new Line(p1, p2);
            expect(line.normaliseDirection()).toMatchObject(expected);
        });
});
