import type { Reindeer } from '../external/deer/reindeer';
import { MagicStable } from '../external/stable/magicStable';
import { AmplifierType } from './amplifierType';
import { Dashboard } from './dashboard';
import { SleighAction, SleighEngineStatus } from './enums';
import {
  ReindeersNeedRestException,
  SleighNotStartedException,
} from './exceptions';
import { ReindeerPowerUnit } from './reindeerPowerUnit';

export class ControlSystem {
  private XmasSpirit = 40;
  private dashboard: Dashboard;
  private magicStable = new MagicStable();
  private reindeerPowerUnits: ReindeerPowerUnit[];
  public status: SleighEngineStatus;
  public action: SleighAction;
  private controlMagicPower = 0;
  private amplifiers: AmplifierType[];

  constructor(amplifiers: AmplifierType[]) {
    this.dashboard = new Dashboard();
    this.amplifiers = [...amplifiers].sort((it) => it.valueOf() * -1);
    this.reindeerPowerUnits = this.bringAllReindeers();
  }

  private bringAllReindeers(): ReindeerPowerUnit[] {
    const allReindeers = this.magicStable.getAllReindeers();
    const reindeersByMagicPower = [...allReindeers].sort((it) =>
      it.getMagicPower(),
    );

    return reindeersByMagicPower.map((reindeer) =>
      this.attachPowerUnit(reindeer),
    );
  }

  public attachPowerUnit(reindeer: Reindeer): ReindeerPowerUnit {
    return new ReindeerPowerUnit(reindeer, this.nextAmplifier());
  }

  public startSystem() {
    this.dashboard.displayStatus('Starting the sleigh...');
    this.status = SleighEngineStatus.ON;
    this.dashboard.displayStatus('System ready.');
  }

  public ascend() {
    if (this.status === SleighEngineStatus.ON) {
      for (const unit of this.reindeerPowerUnits) {
        this.controlMagicPower += unit.harnessMagicPower();
      }

      if (this.checkReindeerStatus()) {
        this.dashboard.displayStatus('Ascending...');
        this.action = SleighAction.FLYING;
        this.controlMagicPower = 0;
      } else {
        throw new ReindeersNeedRestException();
      }
    } else {
      throw new SleighNotStartedException();
    }
  }

  public descend() {
    if (this.status === SleighEngineStatus.ON) {
      this.dashboard.displayStatus('Descending...');
      this.action = SleighAction.HOVERING;
    } else {
      throw new SleighNotStartedException();
    }
  }

  public park() {
    if (this.status === SleighEngineStatus.ON) {
      this.dashboard.displayStatus('Parking...');

      for (const unit of this.reindeerPowerUnits) {
        unit.reindeer.timesHarnessing = 0;
      }

      this.action = SleighAction.PARKED;
    } else {
      throw new SleighNotStartedException();
    }
  }

  public stopSystem() {
    this.dashboard.displayStatus('Stopping the sleigh...');
    this.status = SleighEngineStatus.OFF;
    this.dashboard.displayStatus('System shutdown.');
  }

  private checkReindeerStatus(): boolean {
    return this.controlMagicPower >= this.XmasSpirit;
  }

  private nextAmplifier(): AmplifierType {
    return this.amplifiers.shift() ?? AmplifierType.BASIC;
  }
}
