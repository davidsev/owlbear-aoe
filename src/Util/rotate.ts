import { Vector2 } from '@owlbear-rodeo/sdk';
import { Vector } from './Vector';

export default function rotate (center: Vector2, point2: Vector2, rads: number): Vector {

    const cos = Math.cos(rads);
    const sin = Math.sin(rads);

    const x = (sin * (point2.x - center.x)) + (cos * (point2.y - center.y)) + center.x;
    const y = (sin * (point2.y - center.y)) - (cos * (point2.x - center.x)) + center.y;

    return new Vector({ x, y });
}
