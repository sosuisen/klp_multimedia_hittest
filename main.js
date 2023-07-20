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
  // position: true, // positionを変更する場合はtrue
  // rotation: true, // rotationを変更する場合はtrue
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

  // 以下は独自プロパティ
  spr.speed = 1 + Math.random() * 3;

  return spr;
};

for (let i = 0; i < maxSprites; i++) {
  const spr = new PIXI.Sprite();
  initSprite(spr);
  particles.addChild(spr);
}

/**
 * 障害物1（角丸の矩形）
 */
const box = new PIXI.Graphics();
box.beginFill(0xe09060);
box.drawRoundedRect(0, 0, 200, 32);
box.endFill();
box.position.set(100, 250);
// 衝突判定対象とする場合、eventModeは必ずstatic
box.eventMode = 'static';
box.angle = 10;
app.stage.addChild(box);

// 衝突判定を実施する範囲を指定
const boxBoundary = new PIXI.EventBoundary(box);


/**
 * 障害物2（イラスト）
 */
const kyoco = PIXI.Sprite.from('kyoco_trans256x256.png');
kyoco.position.set(450, 150);
kyoco.eventMode = 'static';
app.stage.addChild(kyoco);

// 判定範囲を絵に合わせて設定
kyoco.hitArea = new PIXI.Circle(142, 90, 64);

const textBoundary = new PIXI.EventBoundary(kyoco);

/**
 *  障害物3（基本課題）
 */
const bar = new PIXI.Graphics();
bar.beginFill(0xa0ffa0);
bar.drawRect(0, 0, 400, 20);
bar.endFill();
bar.position.set(200, 390);
bar.eventMode = 'static';
app.stage.addChild(bar);
const barBoundary = new PIXI.EventBoundary(bar);

/**
 * マウスの位置取得
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

/**
 * 衝突時の処理
 */
const pattern1 = spr => {
  // yだけ増やす
  spr.y += spr.speed;
};

const pattern2 = spr => {
  // xだけ増やす
  spr.x += spr.speed;;
};

const pattern3 = spr => {
  // 何もしない
};

let time = 0.0;
app.ticker.add(delta => {
  time += delta;

  particles.children.forEach(spr => {
    // hitTest
    // PixiJS v7以降はこの方法なので注意
    // https://github.com/pixijs/pixijs/wiki/v7-Migration-Guide#using-hittest-with-events
    // スプライトの位置と衝突しているオブジェクトがあれば返す
    const hitObj1 = boxBoundary.hitTest(spr.x, spr.y);
    const hitObj2 = textBoundary.hitTest(spr.x, spr.y);
    const hitObj3 = barBoundary.hitTest(spr.x, spr.y);    
    if (hitObj1) {
      spr.texture = orangeTexture;

      /**
       * 下記のパターン(1)(2)(3)はどれか1つだけ有効にしてください。
       * （2つ以上同時に有効にしないこと）
       */
      // (1) そのまま通過する
      // pattern1(spr);

      // (2) 矩形の上を右へ転がる
      pattern2(spr);

      // (3) 矩形の上に積もる
      // pattern3(spr);

    }
    else if (hitObj2) {
      //pattern1(spr);
      pattern2(spr);
      // pattern3(spr);
    }
    else if (hitObj3) {
      if(spr.x < bar.x + bar.width/2) {
        spr.x -= spr.speed;
      }
      else {
        spr.x += spr.speed;
      }
    }
    else {
      // y座標をそれぞれのspeedの値だけ増やす
      spr.y += spr.speed;
    }

    // 下端に達したスプライトは上へ戻す
    // スプライトの座標原点は中心なので、サイズの半分を足しておく
    if (spr.y > app.screen.height + spr.width / 2.0) {
      initSprite(spr);
    }
  })
});

