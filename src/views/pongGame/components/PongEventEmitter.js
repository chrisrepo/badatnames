import Phaser from 'phaser';

let instance = null;
/**
 * Singleton class to make sure both phaser and react components can speak to eachother via the same instance
 */
export class PongEventEmitter extends Phaser.Events.EventEmitter {
  static getInstance() {
    if (instance == null) {
      instance = new PongEventEmitter();
    }
    return instance;
  }
}
