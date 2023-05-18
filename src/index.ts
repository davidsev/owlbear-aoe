import { init, registerInitFunction } from './init';
import { initBackground } from './background';
import { initSettingsForm } from './SettingsForm/form';
import './base.scss';
import { initStyleForm } from './StyleForm/form';

(window as any).init = init;

registerInitFunction('background', initBackground);
registerInitFunction('settings-form', initSettingsForm);
registerInitFunction('style-form', initStyleForm);
