import { LineSegment } from '../src/Util/Geometry/LineSegment';

describe('testing Line', () => {
    test('creation', () => {
        const l1 = new LineSegment({ x: 5, y: 10 }, { x: 10, y: 20 });
        expect(l1.p1).toMatchObject({ x: 5, y: 10 });
        expect(l1.p2).toMatchObject({ x: 10, y: 20 });
    });

    const testCases = [
        {
            p1: { x: 5, y: 10 },
            p2: { x: 10, y: 20 },
            box: { x: 5, y: 10, w: 5, h: 10 },
            length: 11.180,
            midpoint: { x: 7.5, y: 15 },
            string: 'Line(5,10 -> 10,20)',
        },
        {
            p1: { x: 10, y: 20 },
            p2: { x: 5, y: 10 },
            box: { x: 5, y: 10, w: 5, h: 10 },
            length: 11.180,
            midpoint: { x: 7.5, y: 15 },
            string: 'Line(5,10 -> 10,20)',
        },
        {
            p1: { x: 5, y: 10 },
            p2: { x: 5, y: 20 },
            box: { x: 5, y: 10, w: 0, h: 10 },
            length: 10,
            midpoint: { x: 5, y: 15 },
            string: 'Line(5,10 -> 5,20)',
        },
        {
            p1: { x: 5, y: 10 },
            p2: { x: 10, y: 10 },
            box: { x: 5, y: 10, w: 5, h: 0 },
            length: 5,
            midpoint: { x: 7.5, y: 10 },
            string: 'Line(5,10 -> 10,10)',
        },
        {
            p1: { x: 5, y: 10 },
            p2: { x: 10, y: 20 },
            box: { x: 5, y: 10, w: 5, h: 10 },
            length: 11.180,
            midpoint: { x: 7.5, y: 15 },
            string: 'Line(5,10 -> 10,20)',
        },
        {
            p1: { x: 10, y: 20 },
            p2: { x: 5, y: 10 },
            box: { x: 5, y: 10, w: 5, h: 10 },
            length: 11.180,
            midpoint: { x: 7.5, y: 15 },
            string: 'Line(5,10 -> 10,20)',
        },
        {
            p1: { x: 5, y: 20 },
            p2: { x: 10, y: 10 },
            box: { x: 5, y: 10, w: 5, h: 10 },
            length: 11.180,
            midpoint: { x: 7.5, y: 15 },
            string: 'Line(5,20 -> 10,10)',
        },
    ];
    test.each(testCases)('$string', (testCase) => {
        const line = new LineSegment(testCase.p1, testCase.p2);
        expect(line.boundingBox).toMatchObject(testCase.box);
        expect(line.length).toBeCloseTo(testCase.length);
        expect(line.midpoint).toMatchObject(testCase.midpoint);
        expect(line.toString()).toBe(testCase.string);
    });

    test('invalid line', () => {
        expect(() => {
            new LineSegment({ x: 5, y: 10 }, { x: 5, y: 10 });
        }).toThrow('Cannot create a line with two identical points');
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
            const line1 = new LineSegment(p1, p2);
            const line2 = new LineSegment(p3, p4);
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
            const line1 = new LineSegment(p1, p2);
            const line2 = new LineSegment(p3, p4);
            expect(line1.getIntersection(line2)).toBeNull();
        });
});
