export default class ForestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ForestScene' });
  }

  create() {
    // แสดงภาพพื้นหลัง 
    this.add.image(400, 300, 'forestBg').setDepth(-1);
     
    // สร้างพื้นหลังสีเขียวเข้มแทนป่า
    this.cameras.main.setBackgroundColor('#2e8b57'); // forest green

    // เมฆ (สี่เหลี่ยมสีขาวลอย)
    this.cloud = this.add.rectangle(0, 100, 100, 40, 0xffffff);
    this.cloudSpeed = 0.5;

    // ปุ่มปลูกต้นไม้ (สี่เหลี่ยมเขียว)
    this.treeBtn = this.add.rectangle(200, 500, 100, 50, 0x228b22).setInteractive();
    this.add.text(175, 490, 'ปลูกต้นไม้', { fontSize: '12px', fill: '#fff' });

    // ปุ่มสร้างฝาย (สี่เหลี่ยมฟ้า)
    this.damBtn = this.add.rectangle(600, 500, 100, 50, 0x4682b4).setInteractive();
    this.add.text(575, 490, 'สร้างฝาย', { fontSize: '12px', fill: '#fff' });

    // คะแนนฟื้นฟู
    this.restoreScore = 0;
    this.scoreText = this.add.text(20, 20, 'คะแนนฟื้นฟู: 0', { fontSize: '20px', fill: '#ffffff' });

    this.treeBtn.on('pointerdown', () => {
      this.restoreScore += 10;
      this.scoreText.setText('คะแนนฟื้นฟู: ' + this.restoreScore);
    });

    this.damBtn.on('pointerdown', () => {
      this.restoreScore += 15;
      this.scoreText.setText('คะแนนฟื้นฟู: ' + this.restoreScore);
    });

    // ปุ่มไปด่านถัดไป
    this.nextBtn = this.add.rectangle(700, 560, 160, 30, 0x003300).setInteractive();
    this.add.text(645, 552, 'ไปยังพื้นที่เกษตร >>', {
      fontSize: '12px',
      fill: '#00ff88'
    });

    this.nextBtn.on('pointerdown', () => {
      if (this.restoreScore >= 30) {
        this.scene.start('FarmScene'); // ให้แน่ใจว่า scene นี้ถูก import แล้ว
      } else {
        this.scoreText.setText('คะแนนฟื้นฟูไม่พอ! ต้องอย่างน้อย 30');
      }
    });
  }

  update() {
    this.cloud.x += this.cloudSpeed;
    if (this.cloud.x > 800) this.cloud.x = -100;
  }
}
  preload() {
  this.load.image('forestBg', 'assets/images/forest-bg.png.png');
}