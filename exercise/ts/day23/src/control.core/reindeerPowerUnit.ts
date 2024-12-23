import type { Reindeer } from '../external/deer/reindeer';
import { AmplifierType } from './amplifierType';
import { MagicPowerAmplifier } from './magicPowerAmplifier';

export class ReindeerPowerUnit {
  public reindeer: Reindeer;
  public amplifier: MagicPowerAmplifier;

  constructor(reindeer: Reindeer, amplifier = AmplifierType.BASIC) {
    this.reindeer = reindeer;
    this.amplifier = new MagicPowerAmplifier(amplifier);
  }

  public harnessMagicPower(): number {
    if (!this.reindeer.needsRest()) {
      this.reindeer.timesHarnessing++;
      return this.amplifier.amplify(this.reindeer.getMagicPower());
    }
    return 0;
  }

  public checkMagicPower(): number {
    return this.reindeer.getMagicPower();
  }
}
