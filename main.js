import ForestScene from './scenes/ForestScene.js';
import FarmScene from './scenes/FarmScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [ForestScene, FarmScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  }
};

new Phaser.Game(config);