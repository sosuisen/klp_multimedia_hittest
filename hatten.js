import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ antialias: true, width: 800, height: 600 });

document.body.appendChild(app.view);

// 表示をする画像の最大数を指定
// let maxSprites = 100;
const maxSprites = 1000;

const particles = new PIXI.Container();
// （参考）最も処理効率を高くする場合、ParticleContainerを用いる。
// ただし、処理効率の代わりに、マスク、フィルタ、テクスチャの変更などの
// 高度な機能が使えない。
// https://pixijs.download/dev/docs/PIXI.ParticleContainer.html
/*
const particles = new PIXI.ParticleContainer(maxSprites, {
  vertices: true, // scaleを変更する場合はtrue
  position: true, // positionを変更する場合はtrue
  rotation: true, // rotationを変更する場合はtrue
});
*/

app.stage.addChild(particles);

/**
 * スプライトのテクスチャ作成
 */
const createCircleTexture = (color) => {
  const g = new PIXI.Graphics();
  g.beginFill(color, 0.7);
  g.lineStyle({
    color: 0xffffff,
    width: 3,
  });
  g.drawCircle(0, 0, 10);
  g.endFill();
  return app.renderer.generateTexture(g);
};
const blueTexture = createCircleTexture(0xa0a0ff);
const orangeTexture = createCircleTexture(0xffe0a0);

/**
 * スプライトの初期化
 */
const initSprite = (spr) => {
  spr.anchor.set(0.5);
  spr.x = Math.random() * app.screen.width;
  spr.y = - Math.random() * app.screen.height;
  spr.scale.set(0.05 + Math.random());

  // 同じテクスチャを使いまわす
  spr.texture = blueTexture;

  /**
   * 以下は独自プロパティ
   */
  spr.speed = 1 + Math.random() * 3;
  // 元のx座標を別のプロパティに記憶しておく
  spr.orgX = spr.x;

  return spr;
};

for (let i = 0; i < maxSprites; i++) {
  const spr = new PIXI.Sprite();
  initSprite(spr);
  particles.addChild(spr);
}

/**
 * 傘を描く
 */
const umbrellaSize = 128;
const umbrella = new PIXI.Graphics();
umbrella.lineStyle(4, 0xff00ff, 0.7);
umbrella.arc(0, 0, umbrellaSize, 0, Math.PI, true);
app.stage.addChild(umbrella);

/**
 * マウスの位置取得（発展課題で使用）
 */
let mouseX = 0;
let mouseY = 0;
app.stage.eventMode = 'static';
// app.stageのeventModeをstaticにしてstage上のイベントを取得する場合は
// hitArea = app.screenが必須。
app.stage.hitArea = app.screen;
app.stage.on('pointermove', event => {
  console.log(`[stage] screen(${event.screen.x}, ${event.screen.y}))`);
  mouseX = event.screen.x;
  mouseY = event.screen.y;
});

let time = 0.0;
app.ticker.add(delta => {
  time += delta;

  particles.children.forEach(spr => {
    // 発展課題：マウスで傘をさす。





    

    // y座標をそれぞれのspeedの値だけ増やす
    spr.y += spr.speed;

    // 下端に達したスプライトは上へ戻す
    // スプライトの座標原点は中心なので、サイズの半分を足しておく
    if (spr.y > app.screen.height + spr.width / 2.0) {
      initSprite(spr);
    }

    // 傘の位置を移動
    // なおumbrellaに対するhitTestはしていないので、
    // 傘自体は描画しなくても雪の動きに影響しません。
    umbrella.position.set(mouseX, mouseY);
  })
});

