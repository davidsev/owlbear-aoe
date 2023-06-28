import { Vector2 } from '@owlbear-rodeo/sdk';
import { AABB } from './AABB';

// Adapted from https://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order/6989383#6989383
export function sortPointsClockwise<T extends Vector2> (points: T[]): T[] {
    const center = AABB.boundingBox(points).center.add({ x: 10, y: 10 });

    points.sort((a, b) => {
        if (a.x == b.x && a.y == b.y)
            return 0;

        if (a.x - center.x >= 0 && b.x - center.x < 0)
            return 1;
        if (a.x - center.x < 0 && b.x - center.x >= 0)
            return -1;
        if (a.x - center.x == 0 && b.x - center.x == 0) {
            if (a.y - center.y >= 0 || b.y - center.y >= 0)
                return a.y > b.y ? 1 : -1;
            return b.y > a.y ? 1 : -1;
        }

        // compute the cross product of vectors (center -> a) x (center -> b)
        const det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
        if (det < 0)
            return 1;
        if (det > 0)
            return -1;

        // points a and b are on the same line from the center
        // check which point is closer to the center
        const d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
        const d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
        return d1 > d2 ? 1 : -1;
    });

    return points;
}
