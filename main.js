import ForestScene from './scenes/ForestScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [ForestScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  }
};

new Phaser.Game(config);
