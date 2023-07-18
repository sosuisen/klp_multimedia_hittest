import * as PIXI from 'pixi.js';
import { EventBoundary } from 'pixi.js';

const app = new PIXI.Application({ antialias: true, backgroundColor: 0xa0a0ff });
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// Line（直線）
const graphics01 = new PIXI.Graphics();
graphics01.lineStyle(4, 0xffd900, 0.5);
graphics01.moveTo(30, 50);
graphics01.lineTo(100, 100);
graphics01.lineTo(200, 50);
graphics01.lineTo(300, 100);
graphics01.eventMode = 'static';
// hitAreaを設定しない限り、当たり判定なし。
// graphics01.hitArea = new PIXI.Rectangle(0, 0, 300, 100);
app.stage.addChild(graphics01);
const boundary01 = new EventBoundary(graphics01);

// Shape（閉じた図形）
const graphics02 = new PIXI.Graphics();
graphics02.beginFill(0x0000ff, 0.3);
graphics02.lineStyle(4, 0xffd900, 1);
graphics02.moveTo(50, 150);
graphics02.lineTo(250, 150);
graphics02.lineTo(100, 200);
graphics02.lineTo(50, 150);
graphics02.closePath();
graphics02.endFill();
graphics02.eventMode = 'static';
app.stage.addChild(graphics02);
const boundary02 = new EventBoundary(graphics02);

// Polygon（多角形）
const graphics03 = new PIXI.Graphics();
const path = [100, 240, 200, 360, 280, 320, 230, 470, 50, 400];
graphics03.lineStyle(0);
// 指定のテクスチャで塗りつぶす
graphics03.beginTextureFill({ texture: PIXI.Texture.from('star.png') });
graphics03.drawPolygon(path);
graphics03.endFill();
graphics03.eventMode = 'static';
app.stage.addChild(graphics03);
const boundary03 = new EventBoundary(graphics03);

// Circle（円＋塗りつぶしなし）
const graphics04 = new PIXI.Graphics();
graphics04.lineStyle(10, 0xffbd01, 1);
graphics04.drawCircle(400, 80, 50);
graphics04.eventMode = 'static';
app.stage.addChild(graphics04);
const boundary04 = new EventBoundary(graphics04);

// Circle（円＋塗りつぶし有り）
const graphics05 = new PIXI.Graphics();
graphics05.lineStyle(10, 0xffbd01, 1);
graphics05.beginFill(0x00ff00, 0.3);
graphics05.drawCircle(400, 280, 50);
graphics03.endFill();
graphics05.eventMode = 'static';
app.stage.addChild(graphics05);
const boundary05 = new EventBoundary(graphics05);


/**
 * マウスの位置取得
 */
app.stage.eventMode = 'static';
// app.stageのeventModeをstaticにしてstage上のイベントを取得する場合は
// hitArea = app.screenが必須。
app.stage.hitArea = app.screen;
app.stage.on('pointerdown', event => {
  /**
   * beginFill または beginTextureFillで塗りつぶされていない図形は
   * hitAreaを設定しない限り当たり判定がありません。
   */
  if(boundary01.hitTest(event.screen.x, event.screen.y)){
    graphics01.tint = 0xff0000;
  }
  else if(boundary02.hitTest(event.screen.x, event.screen.y)){
    graphics02.tint = 0xff0000;
  }
  else if(boundary03.hitTest(event.screen.x, event.screen.y)){
    graphics03.tint = 0xff0000;
  }
  else if(boundary04.hitTest(event.screen.x, event.screen.y)){
    graphics04.tint = 0xff0000;
  }
  else if(boundary05.hitTest(event.screen.x, event.screen.y)){
    graphics05.tint = 0xff0000;
  }
});
