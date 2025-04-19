// FarmScene.js พร้อมระบบน้ำไหล
export default class FarmScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FarmScene' });
  }

  preload() {
    this.load.image('tiles', 'assets/tilesets/farmtiles.png');
    this.load.tilemapTiledJSON('farmmap', 'assets/tilemaps/farm_sim_map.json');
  }

  create() {
    // โหลด tilemap และ layer
    this.map = this.make.tilemap({ key: 'farmmap' });
    const tileset = this.map.addTilesetImage('farmtiles', 'tiles');
    this.groundLayer = this.map.createLayer('Ground', tileset, 0, 0);

    // สร้างรายการ tile ที่เป็นเส้นน้ำ (index = 3)
    this.waterTiles = [];
    this.groundLayer.forEachTile(tile => {
      if (tile.index === 3) {
        this.waterTiles.push({ x: tile.x, y: tile.y, hasWater: false });
      }
    });

    // หา tile บริเวณต้นน้ำ (ด้านบนของแผนที่)
    this.sourceTiles = this.waterTiles.filter(t => t.y <= 2);

    // ให้ tile ต้นน้ำมีน้ำตั้งแต่เริ่มต้น
    this.sourceTiles.forEach(t => {
      const tile = this.groundLayer.getTileAt(t.x, t.y);
      tile.tint = 0x66ccff; // เปลี่ยนสีเพื่อแสดงว่ามีน้ำ
      this.getWaterTile(t.x, t.y).hasWater = true;
    });

    // เรียกน้ำไหลต่อเนื่องทุกวินาที
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.updateWaterFlow();
      }
    });
  }

  // ฟังก์ชันหาตำแหน่ง tile น้ำจากตำแหน่ง x, y
  getWaterTile(x, y) {
    return this.waterTiles.find(t => t.x === x && t.y === y);
  }

  // ฟังก์ชันน้ำไหลลง tile ด้านล่าง
  updateWaterFlow() {
    const newFlow = [];

    this.waterTiles.forEach(tile => {
      if (tile.hasWater) {
        const below = this.getWaterTile(tile.x, tile.y + 1);
        if (below && !below.hasWater) {
          below.hasWater = true;
          const t = this.groundLayer.getTileAt(below.x, below.y);
          t.tint = 0x66ccff;
          newFlow.push(below);
        }
      }
    });
  }
} 
