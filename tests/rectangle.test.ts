import '../src/Util/AABB';
import { Rectangle } from '../src/Util/Rectangle';
import { Vector2 } from '@owlbear-rodeo/sdk';
import { Line } from '../src/Util/Line';

describe('testing Rectangle', () => {
    test('creation', () => {
        const r = new Rectangle({ x: 10, y: 10 }, { x: 10, y: 20 }, { x: 20, y: 20 }, { x: 20, y: 10 });
        expect(r.p1).toMatchObject({ x: 10, y: 10 });
        expect(r.p2).toMatchObject({ x: 10, y: 20 });
        expect(r.p3).toMatchObject({ x: 20, y: 20 });
        expect(r.p4).toMatchObject({ x: 20, y: 10 });
    });

    test('invalid creation', () => {
        const t = async () => {new Rectangle({ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 }, { x: 40, y: 40 }); };
        expect(t).rejects.toThrow('Rectangle is not a rectangle');
    });

    const rectangleTestCases = [
        {
            rect: [{ x: 15, y: 15 }, { x: 35, y: 15 }, { x: 35, y: 35 }, { x: 15, y: 35 }],
            expected1: { x: 15, y: 15, w: 20, h: 20 },
            expected10: { x: 10, y: 10, w: 30, h: 30 },
            area: 400,
            center: { x: 25, y: 25 },
        },
        {
            rect: [{ x: -15, y: -15 }, { x: -35, y: -15 }, { x: -35, y: -35 }, { x: -15, y: -35 }],
            expected1: { x: -35, y: -35, w: 20, h: 20 },
            expected10: { x: -40, y: -40, w: 30, h: 30 },
            area: 400,
            center: { x: -25, y: -25 },
        },
        {
            rect: [{ x: -15, y: -15 }, { x: 15, y: -15 }, { x: 15, y: 15 }, { x: -15, y: 15 }],
            expected1: { x: -15, y: -15, w: 30, h: 30 },
            expected10: { x: -20, y: -20, w: 40, h: 40 },
            area: 900,
            center: { x: 0, y: 0 },
        },
        {
            rect: [{ x: 15, y: -15 }, { x: 15, y: -15 }, { x: 15, y: 15 }, { x: 15, y: 15 }],
            expected1: { x: 15, y: -15, w: 0, h: 30 },
            expected10: { x: 10, y: -20, w: 10, h: 40 },
            area: 0,
            center: { x: 15, y: 0 },
        },
        {
            rect: [{ x: 15, y: 15 }, { x: 10, y: 20 }, { x: 15, y: 25 }, { x: 20, y: 20 }],
            expected1: { x: 10, y: 15, w: 10, h: 10 },
            expected10: { x: 10, y: 10, w: 10, h: 20 },
            area: 50,
            center: { x: 15, y: 20 },
        },
        {
            rect: [{ x: 0, y: 0 }, { x: -10, y: 10 }, { x: -25, y: -5 }, { x: -15, y: -15 }],
            expected1: { x: -25, y: -15, w: 25, h: 25 },
            expected10: { x: -30, y: -20, w: 30, h: 30 },
            area: 300,
            center: { x: -12.5, y: -2.5 },
        },
    ];
    test.each(rectangleTestCases)('(($rect.0.x, $rect.0.y), ($rect.1.x, $rect.1.y), ($rect.2.x, $rect.2.y), ($rect.3.x, $rect.3.y))', (testCase) => {
        const r = new Rectangle(...testCase.rect as [Vector2, Vector2, Vector2, Vector2]);
        expect(r.getBounds(1)).toMatchObject(testCase.expected1);
        expect(r.getBounds(10)).toMatchObject(testCase.expected10);
        expect(r.area).toBeCloseTo(testCase.area);
        expect(r.center).toMatchObject(testCase.center);
    });

    const fromLineWidthTestCases = [
        {
            line: [{ x: 15, y: 15 }, { x: 35, y: 15 }],
            width: 10,
            rect: [{ x: 15, y: 20 }, { x: 15, y: 10 }, { x: 35, y: 10 }, { x: 35, y: 20 }],
        },
        {
            line: [{ x: 15, y: 15 }, { x: 15, y: 35 }],
            width: 10,
            rect: [{ x: 10, y: 15 }, { x: 20, y: 15 }, { x: 20, y: 35 }, { x: 10, y: 35 }],
        },
        {
            line: [{ x: 15, y: 15 }, { x: 35, y: 35 }],
            width: 14.14,
            rect: [{ x: 10, y: 20 }, { x: 20, y: 10 }, { x: 40, y: 30 }, { x: 30, y: 40 }],
        },
        {
            line: [{ x: -15, y: -15 }, { x: -35, y: -35 }],
            width: 14.14,
            rect: [{ x: -10, y: -20 }, { x: -20, y: -10 }, { x: -40, y: -30 }, { x: -30, y: -40 }],
        },
    ];
    test.each(fromLineWidthTestCases)('FromLineAndWidth(($line.0.x, $line.0.y), ($line.1.x, $line.1.y), $width)', (testCase) => {
        const r = Rectangle.fromLineAndWidth(new Line(testCase.line[0], testCase.line[1]), testCase.width);
        expect(r.p1.x).toBeCloseTo(testCase.rect[0].x);
        expect(r.p1.y).toBeCloseTo(testCase.rect[0].y);
        expect(r.p2.x).toBeCloseTo(testCase.rect[1].x);
        expect(r.p2.y).toBeCloseTo(testCase.rect[1].y);
        expect(r.p3.x).toBeCloseTo(testCase.rect[2].x);
        expect(r.p3.y).toBeCloseTo(testCase.rect[2].y);
        expect(r.p4.x).toBeCloseTo(testCase.rect[3].x);
        expect(r.p4.y).toBeCloseTo(testCase.rect[3].y);
    });
});
