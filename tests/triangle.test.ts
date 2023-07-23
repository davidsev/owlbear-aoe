import { Triangle } from '../src/Util/Shapes';

describe('testing Triangle', () => {
    test('creation', () => {
        const t = new Triangle({ x: 5, y: 10 }, { x: 10, y: 20 }, { x: 15, y: 30 });
        expect(t.p1).toMatchObject({ x: 5, y: 10 });
        expect(t.p2).toMatchObject({ x: 10, y: 20 });
        expect(t.p3).toMatchObject({ x: 15, y: 30 });
    });

    const fromDirectionAndSizeTestCases = [
        { c: { x: 5, y: 5 }, d: Math.PI, s: 5, expected: [{ x: 5, y: 5 }, { x: 10, y: 2.5 }, { x: 10, y: 7.5 }] },
        { c: { x: 5, y: 5 }, d: Math.PI / 2, s: 5, expected: [{ x: 5, y: 5 }, { x: 2.5, y: 0 }, { x: 7.5, y: 0 }] },
        {
            c: { x: -2, y: -8 },
            d: 1,
            s: 3.5,
            expected: [{ x: -2, y: -8 }, { x: -5.36, y: -10 }, { x: -2.42, y: -11.89 }],
        },
    ];
    test.each(fromDirectionAndSizeTestCases)(`fromDirectionAndSize(($c.x,$c.y), $d, $s)`, (data) => {
        const t = Triangle.fromDirectionAndSize(data.c, data.d, data.s);
        expect(t.p1.x).toBeCloseTo(data.expected[0].x);
        expect(t.p1.y).toBeCloseTo(data.expected[0].y);
        expect(t.p2.x).toBeCloseTo(data.expected[1].x);
        expect(t.p2.y).toBeCloseTo(data.expected[1].y);
        expect(t.p3.x).toBeCloseTo(data.expected[2].x);
        expect(t.p3.y).toBeCloseTo(data.expected[2].y);
    });

    const areaTestCases = [
        { p1: { x: 0, y: 0 }, p2: { x: 0, y: 1 }, p3: { x: 1, y: 0 }, expected: 0.5 },
        { p1: { x: 0, y: 0 }, p2: { x: 0, y: 2 }, p3: { x: 2, y: 0 }, expected: 2 },
        { p1: { x: -3, y: 4 }, p2: { x: -5, y: -5 }, p3: { x: 4.223, y: 1 }, expected: 35.5 },
        { // collinear points
            p1: { x: 660.20469847952, y: 514.44990157743 },
            p2: { x: 720.40939695903, y: 450 },
            p3: { x: 600, y: 578.89980315486 },
            expected: 0,
        },
    ];
    test.each(areaTestCases)(`area(($p1.x,$p1.y), ($p2.x,$p2.y), ($p3.x,$p3.y))`, (data) => {
        const t = new Triangle(data.p1, data.p2, data.p3);
        expect(t.area).toBeCloseTo(data.expected);
    });

    const containsPointTestCases = [
        { p1: { x: 0, y: 0 }, p2: { x: 0, y: 1 }, p3: { x: 1, y: 0 }, p: { x: 0.5, y: 0.5 }, expected: false },
        { p1: { x: 0, y: 0 }, p2: { x: 0, y: 1 }, p3: { x: 1, y: 0 }, p: { x: 0.5, y: 1.5 }, expected: false },
        { p1: { x: 0, y: 0 }, p2: { x: 0, y: 2 }, p3: { x: 2, y: 0 }, p: { x: 1, y: 1 }, expected: false },
        { p1: { x: -3, y: 4 }, p2: { x: -5, y: -5 }, p3: { x: 4.223, y: 1 }, p: { x: 0, y: 0 }, expected: true },
        { // collinear points
            p1: { x: 660.20469847952, y: 514.44990157743 },
            p2: { x: 720.40939695903, y: 450 },
            p3: { x: 600, y: 578.89980315486 },
            p: { x: 660.20469847952, y: 514.44990157743 },
            expected: false,
        },
    ];
    test.each(containsPointTestCases)(`containsPoint(($p1.x,$p1.y), ($p2.x,$p2.y), ($p3.x,$p3.y), ($p.x,$p.y))`, (data) => {
        const t = new Triangle(data.p1, data.p2, data.p3);
        expect(t.containsPoint(data.p)).toBe(data.expected);
    });
});
