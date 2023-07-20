import { PathCommand, Vector2 } from '@owlbear-rodeo/sdk';
import { Vector } from '../Geometry/Vector';
import { AABB } from './AABB';

export abstract class Shape {

    public abstract get area (): number;

    public abstract intersectsSquareAmount (square: AABB): number;

    public abstract containsPoint (point: Vector2): boolean;

    public abstract get pathCommand (): PathCommand[];

    public abstract get center (): Vector;

    public abstract getBounds (chunk?: number): AABB;
}
