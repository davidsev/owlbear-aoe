import '../src/Util/AABB';
import { Polygon } from '../src/Util/Polygon';

describe('testing Polygon', () => {
    test('creation', () => {
        const l1 = new Polygon([{ x: 5, y: 10 }, { x: 10, y: 20 }, { x: 7.5, y: 20 }]);
        expect(l1.points).toHaveLength(3);
        expect(l1.points[0]).toMatchObject({ x: 5, y: 10 });
        expect(l1.points[1]).toMatchObject({ x: 10, y: 20 });
        expect(l1.points[2]).toMatchObject({ x: 7.5, y: 20 });
    });

    test('fromUnsortedPoints', () => {
        const l1 = Polygon.fromUnsortedPoints([{ x: 5, y: 10 }, { x: 10, y: 20 }, { x: 7.5, y: 20 }]);
        expect(l1.points).toHaveLength(3);
        expect(l1.points[0]).toMatchObject({ x: 7.5, y: 20 });
        expect(l1.points[1]).toMatchObject({ x: 10, y: 20 });
        expect(l1.points[2]).toMatchObject({ x: 5, y: 10 });
    });

    const testCases = [
        // Triangles
        {
            points: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }],
            area: 0.5,
            center: { x: 1 / 3, y: 1 / 3 },
            bounds: { x: 0, y: 0, w: 1, h: 1 },
        },
        {
            points: [{ x: 0, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 0 }],
            area: 2,
            center: { x: 2 / 3, y: 2 / 3 },
            bounds: { x: 0, y: 0, w: 2, h: 2 },
        },
        {
            points: [{ x: -3, y: 4 }, { x: -5, y: -5 }, { x: 4.223, y: 1 }],
            area: 35.5,
            center: { x: -1.259, y: 0 },
            bounds: { x: -5, y: -5, w: 10, h: 9 },
        },
        // collinear points
        {
            points: [
                { x: 660.20469847952, y: 514.44990157743 },
                { x: 720.40939695903, y: 450 },
                { x: 600, y: 578.89980315486 },
            ],
            area: 0,
            center: { x: 660.20469847952, y: 514.44990157743 },
            bounds: { x: 600, y: 450, w: 121, h: 129 },
        },
        // More sides
        {
            points: [{ x: -3, y: 4 }, { x: -5, y: -5 }, { x: 6, y: -2 }, { x: 4.223, y: 1 }, { x: 1, y: 8 }],
            area: 75.115,
            center: { x: 0.644, y: 1.2 },
            bounds: { x: -5, y: -5, w: 11, h: 13 },
        },
    ];
    test.each(testCases)('test $#', (data) => {
        const p = new Polygon(data.points);
        expect(p.area).toBeCloseTo(data.area);
        expect(p.center.x).toBeCloseTo(data.center.x);
        expect(p.center.y).toBeCloseTo(data.center.y);
        expect(p.getBounds().x).toBeCloseTo(data.bounds.x);
        expect(p.getBounds().y).toBeCloseTo(data.bounds.y);
        expect(p.getBounds().w).toBeCloseTo(data.bounds.w);
        expect(p.getBounds().h).toBeCloseTo(data.bounds.h);
    });

});
