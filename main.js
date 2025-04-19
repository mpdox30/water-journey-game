import FarmScene from './scenes/FarmScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [FarmScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  }
};

new Phaser.Game(config);