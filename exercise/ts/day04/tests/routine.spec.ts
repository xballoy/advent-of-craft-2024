import type { EmailService } from '../src/routine/emailService';
import type { ReindeerFeeder } from '../src/routine/reindeerFeeder';
import { Routine } from '../src/routine/routine';
import { Schedule } from '../src/routine/schedule';
import type { ScheduleService } from '../src/routine/scheduleService';
import { EmailServiceDouble } from './doubles/emailService';
import { ReindeerFeederDouble } from './doubles/reindeerFeeder';
import { ScheduleServiceDouble } from './doubles/scheduleService';

describe('Routine', () => {
  test('start routine with Jest', () => {
    const schedule = new Schedule();
    const emailService: EmailService = {
      readNewEmails: jest.fn(),
    };
    const scheduleService: ScheduleService = {
      todaySchedule: () => schedule,
      continueDay: jest.fn(),
      organizeMyDay: jest.fn(),
    };
    const reindeerFeeder: ReindeerFeeder = {
      feedReindeers: jest.fn(),
    };
    const underTest = new Routine(
      emailService,
      scheduleService,
      reindeerFeeder,
    );

    underTest.start();

    expect(scheduleService.organizeMyDay).toHaveBeenCalledWith(schedule);
    expect(reindeerFeeder.feedReindeers).toHaveBeenCalled();
    expect(emailService.readNewEmails).toHaveBeenCalled();
    expect(scheduleService.continueDay).toHaveBeenCalled();
  });

  test('start routine with manual test doubles', () => {
    const emailService = new EmailServiceDouble();
    const scheduleService = new ScheduleServiceDouble();
    const reindeerFeeder = new ReindeerFeederDouble();
    const underTest = new Routine(
      emailService,
      scheduleService,
      reindeerFeeder,
    );

    underTest.start();

    expect(scheduleService.organizeMyDayCalled).toBe(true);
    expect(reindeerFeeder.feedReindeersCalled).toBe(true);
    expect(emailService.readNewEmailsCalled).toBe(true);
    expect(scheduleService.continueDayCalled).toBe(true);
  });
});
