import * as PIXI from 'pixi.js'
import { EventBoundary, Graphics } from 'pixi.js';

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
 * マウスの位置取得
 */
let mouseX = 0;
let mouseY = 0;
app.stage.interactive = true;
app.stage.hitArea = app.screen; // app.stageをinteractiveにするときは必須。
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

    // hitTestを用いない
    // マウスカーソルとの距離がumbrellaSize以内、
    // かつカーソルよりも上にあるスプライトは
    // カーソルを中心とする円を描いて避ける。

    // スプライトの中心位置と傘の中心位置の間の距離
    let len = Math.sqrt(Math.pow(spr.x - mouseX, 2) + Math.pow(spr.y - mouseY, 2));
    // この距離が「傘の半径とスプライトの半径の和」（radius）より小さいと衝突状態。
    const radius = umbrellaSize + spr.width / 2;
    if (len < radius) {
      // ベクトル((spr.x - mouseX), (spr.y - mouseY))と
      // ベクトル(0, -1)との内積innerを用いて、そのなす角のcosを求める

      const inner = (spr.x - mouseX) * 0 + (spr.y - mouseY) * (-1);
      const cos = inner / (len + 1);

      // スプライトは傘よりも上かどうか判定。
      // 下側なら無視
      if (cos > 0) {
        // 衝突した雪は、傘の円に沿って移動させる。

        // アークコサインMath.acos()はcosの値に対応する角度をラジアンで返す。
        const currentAngle = Math.acos(cos);
        // 現在の角度に 1度（Math.PI/180ラジアン）加える。
        // ただし 90度を越えない
        const newAngle = Math.min(currentAngle + Math.PI / 180, Math.PI / 2);

        // スプライトはカーソルの左側か右側か？
        let sign = 1;
        if (spr.x - mouseX < 0) {
          // 左側の場合
          sign = -1;
        }

        // スプライトの座標を三角関数を用いて円に沿って移動させる
        spr.x = mouseX + sign * radius * Math.sin(newAngle);
        spr.y = mouseY - radius * Math.cos(newAngle);

        // 三角関数を使わず、
        // spr.yも変更せず、
        // spr.xだけ次のように変更してもそれなりには描けます。
        // spr.x += sign * spr.speed;
      }
      else {
        spr.y += spr.speed;
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

    // 傘の位置を移動
    // なおumbrellaに対するhitTestはしていないので、
    // 傘自体は描画しなくても雪の動きに影響しません。
    umbrella.position.set(mouseX, mouseY);
  })
});

