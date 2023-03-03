import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ width: 800, height: 600 });

document.body.appendChild(app.view);

// 表示をする画像の最大数を指定
// let maxSprites = 100;
let maxSprites = 1000;

let sprites = new PIXI.ParticleContainer(maxSprites, {
  vertices: true, // scaleを変更する場合はtrue
  position: true, // positionを変更する場合はtrue
  rotation: true, // rotationを変更する場合はtrue
});

app.stage.addChild(sprites);

const g = new PIXI.Graphics();
g.beginFill(0xffffff, 0.5);
g.lineStyle({
  color: 0x9090f0,
  width: 3,
  alpha: 0.3,
})
g.drawCircle(0, 0, 10);
g.endFill();
const tx = app.renderer.generateTexture(g);

const setRandomProps = (spr) => {
  spr.anchor.set(0.5);
  spr.x = Math.random() * app.screen.width;
  spr.orgX = Math.random() * app.screen.width;
  spr.y = - Math.random() * app.screen.height;
  spr.scale.set(0.05 + Math.random());
  spr.speed = 1 + Math.random() * 3;
  return spr;
};

for (let i = 0; i < maxSprites; i++){
  // 同じテクスチャを使いまわす
  const spr = PIXI.Sprite.from(tx);
  setRandomProps(spr);
  sprites.addChild(spr);
}

const umbrellaSize = 128;

const umbrella = new PIXI.Graphics();
umbrella.lineStyle(4, 0xff00ff, 0.7);
umbrella.arc(0, 0, umbrellaSize - 10 , 0, Math.PI, true);
// umbrella.pivot.set(0, -64);
// graphics.closePath();
app.stage.addChild(umbrella);

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

  sprites.children.forEach(spr => {
    // 発展課題：マウスで傘をさす。
    // マウスカーソルとの距離がumbrellaSize以内、
    // かつカーソルよりも上にあるスプライトは
    // カーソルを中心とする円を描いて避ける。

    // カーソルの位置(mouseX, mouseY)からスプライトの位置(spr.x, spr.y)へ向かう
    // ベクトル(spr.x - mouseX, spr.y - mouseY)の長さ
    let len = Math.sqrt(Math.pow(spr.x - mouseX, 2) + Math.pow(spr.y - mouseY, 2));
    if (len < umbrellaSize){
      // ベクトル((spr.x - mouseX), (spr.y - mouseY))と
      // ベクトル(0, -1)との内積を用いて、そのなす角のcosを求めることができる。

      // 発展課題：以下計算して、新しいspr.xの値とspr.yの値をセットしよう。





    }

    
    // y座標をそれぞれのspeedの値だけ増やす
    spr.y += spr.speed;

    // 下端に達したスプライトは上へ戻す
    // スプライトの座標原点は中心なので、サイズの半分を足しておく
    if (spr.y > app.screen.height + spr.width / 2.0) {
      setRandomProps(spr);
    }

    // 傘の位置をマウスカーソルの位置へ動かす。
    // なお、今回は物理的な当たり判定の計算はしていないので、
    // 傘を描画しなくても雪の動作は同じ。
    umbrella.position.set(mouseX, mouseY);
  })
});
