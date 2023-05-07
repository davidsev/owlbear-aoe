import { init, registerInitFunction } from './init';
import { initBackground } from './background';

(window as any).init = init;

registerInitFunction('background', initBackground);
