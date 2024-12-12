import { Schedule } from '../../src/routine/schedule';
import type { ScheduleService } from '../../src/routine/scheduleService';

export class ScheduleServiceDouble implements ScheduleService {
  todaySchedule() {
    return new Schedule();
  }

  private _organizeMyDayCalled = false;
  get organizeMyDayCalled() {
    return this._organizeMyDayCalled;
  }
  organizeMyDay(_schedule: Schedule) {
    this._organizeMyDayCalled = true;
  }

  private _continueDayCalled = false;
  get continueDayCalled() {
    return this._continueDayCalled;
  }
  continueDay() {
    this._continueDayCalled = true;
  }
}
