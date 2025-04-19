export default class FarmScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FarmScene' });
  }

  preload() {
    this.load.image('farmBg', 'assets/images/farm-bg.png');

    // โหลดภาพไอคอนพืช
    this.load.image('icon_rice', 'assets/images/crops/rice.png');
    this.load.image('icon_bean', 'assets/images/crops/bean.png');
    this.load.image('icon_vege', 'assets/images/crops/vege.png');
  }

  create() {
    this.add.image(400, 300, 'farmBg').setDepth(-1);

    this.restoreScore = this.registry.get('restoreScore') || 0;
    this.day = 1;
    this.totalDays = 7;
    this.waterAvailable = this.restoreScore * 2;
    this.score = 0;

    this.add.text(20, 20, 'จัดการน้ำในฟาร์ม', { fontSize: '22px', fill: '#fff' });
    this.dayText = this.add.text(20, 60, 'วันที่: 1 / 7', { fontSize: '18px', fill: '#ffffcc' });
    this.waterText = this.add.text(20, 90, `น้ำคงเหลือ: ${this.waterAvailable}`, { fontSize: '18px', fill: '#ffffcc' });
    this.scoreText = this.add.text(20, 120, `คะแนนสะสม: 0`, { fontSize: '18px', fill: '#ffffcc' });
    this.weatherText = this.add.text(20, 150, '', { fontSize: '18px', fill: '#ffcc00' });

    // 🧱 สร้างแปลงเพาะปลูก
    this.plots = [
      { crop: null, days: 0, water: 0 },
      { crop: null, days: 0, water: 0 },
      { crop: null, days: 0, water: 0 }
    ];
    this.plotTexts = [];
    this.plotSprites = [];

    for (let i = 0; i < this.plots.length; i++) {
      const x = 150 + i * 220;
      this.add.rectangle(x, 400, 180, 100, 0x567d46);
      const text = this.add.text(x - 60, 380, `แปลง ${i + 1}: ว่าง`, { fontSize: '14px', fill: '#fff' });
      this.plotTexts.push(text);

      // 🌾 ไอคอนพืชในแต่ละแปลง (ซ่อนไว้ก่อน)
      const sprite = this.add.image(x, 400, '').setVisible(false).setScale(0.25);
      this.plotSprites.push(sprite);
    }

    // ปุ่มปลูกพืช
    this.createCropButton(100, 250, 'ข้าว', 'rice', 4, 20);
    this.createCropButton(300, 250, 'ถั่ว', 'bean', 3, 10);
    this.createCropButton(500, 250, 'ผัก', 'vege', 2, 5);

    // ปุ่มไปวันถัดไป
    this.nextDayBtn = this.add.rectangle(700, 550, 120, 40, 0x333333).setInteractive();
    this.add.text(660, 540, 'วันถัดไป >>', { fontSize: '14px', fill: '#ffffff' });

    this.nextDayBtn.on('pointerdown', () => {
      if (this.day < this.totalDays) {
        this.day++;
        this.advanceDay();
      } else {
        this.scene.start('SummaryScene', { score: this.score });
      }
    });

    this.advanceDay(); // เริ่มวันแรก
  }

  createCropButton(x, y, label, cropType, growDays, waterPerDay) {
    const btn = this.add.rectangle(x, y, 140, 40, 0x228b22).setInteractive();
    this.add.text(x - 35, y - 10, label, { fontSize: '14px', fill: '#fff' });

    btn.on('pointerdown', () => {
      const emptyIndex = this.plots.findIndex(p => p.crop === null);
      if (emptyIndex === -1) {
        this.weatherText.setText('🪴 ไม่มีแปลงว่างแล้ว!');
        return;
      }

      this.plots[emptyIndex] = {
        crop: cropType,
        days: growDays,
        water: waterPerDay
      };

      // แสดงไอคอนพืชในแปลง
      this.plotSprites[emptyIndex]
        .setTexture('icon_' + cropType)
        .setVisible(true);

      this.plotTexts[emptyIndex].setText(`แปลง ${emptyIndex + 1}: ${label}`);
    });
  }

  advanceDay() {
    const rain = Phaser.Math.Between(0, 1);
    const drought = Phaser.Math.Between(0, 10) < 2;

    if (drought) {
      this.weatherText.setText('🔥 ภัยแล้ง! น้ำลด 20 หน่วย');
      this.waterAvailable = Math.max(0, this.waterAvailable - 20);
    } else if (rain) {
      this.weatherText.setText('🌧 ฝนตก! น้ำเพิ่ม 15 หน่วย');
      this.waterAvailable += 15;
    } else {
      this.weatherText.setText('☀️ อากาศปกติ');
    }

    for (let i = 0; i < this.plots.length; i++) {
      const plot = this.plots[i];

      if (plot.crop !== null) {
        if (this.waterAvailable >= plot.water) {
          this.waterAvailable -= plot.water;
          plot.days--;

          if (plot.days <= 0) {
            this.score += 30;
            this.plotTexts[i].setText(`แปลง ${i + 1}: เก็บเกี่ยวแล้ว!`);
            this.plotSprites[i].setVisible(false);
            this.plots[i] = { crop: null, days: 0, water: 0 };
          } else {
            this.plotTexts[i].setText(`แปลง ${i + 1}: ${plot.crop}, เหลือ ${plot.days} วัน`);
          }
        } else {
          this.plotTexts[i].setText(`แปลง ${i + 1}: น้ำไม่พอ!`);
        }
      }
    }

    this.dayText.setText(`วันที่: ${this.day} / ${this.totalDays}`);
    this.waterText.setText(`น้ำคงเหลือ: ${this.waterAvailable}`);
    this.scoreText.setText(`คะแนนสะสม: ${this.score}`);
  }
}
