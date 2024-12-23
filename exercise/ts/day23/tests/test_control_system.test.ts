import { AmplifierType } from '../src/control.core/amplifierType';
import { ControlSystem } from '../src/control.core/controlSystem';
import { SleighAction, SleighEngineStatus } from '../src/control.core/enums';

let originalLog: typeof console.log;
let logOutput: string[];

beforeEach(() => {
  originalLog = console.log;
  logOutput = [];
  console.log = (message: string) => logOutput.push(message);
});

afterEach(() => {
  console.log = originalLog;
});

const amplifiers = [
  AmplifierType.BLESSED,
  AmplifierType.BLESSED,
  AmplifierType.DIVINE,
];
describe('ControlSystem', () => {
  it('should start the system', () => {
    // The system has been started
    const controlSystem = new ControlSystem(amplifiers);
    controlSystem.action = SleighAction.FLYING;
    controlSystem.status = SleighEngineStatus.OFF;
    controlSystem.startSystem();
    expect(controlSystem.status).toBe(SleighEngineStatus.ON);
    expect(logOutput.join('\n')).toBe('Starting the sleigh...\nSystem ready.');
  });

  it('should ascend the system', () => {
    const controlSystem = new ControlSystem(amplifiers);
    controlSystem.startSystem();
    controlSystem.ascend();
    expect(controlSystem.action).toBe(SleighAction.FLYING);
    expect(logOutput.join('\n')).toBe(
      'Starting the sleigh...\nSystem ready.\nAscending...',
    );
  });

  it('should descend the system', () => {
    const controlSystem = new ControlSystem(amplifiers);
    controlSystem.startSystem();
    controlSystem.ascend();
    controlSystem.descend();
    expect(controlSystem.action).toBe(SleighAction.HOVERING);
    expect(logOutput.join('\n')).toBe(
      'Starting the sleigh...\nSystem ready.\nAscending...\nDescending...',
    );
  });

  it('should park the system', () => {
    const controlSystem = new ControlSystem(amplifiers);
    controlSystem.startSystem();
    controlSystem.park();
    expect(controlSystem.action).toBe(SleighAction.PARKED);
  });
});
