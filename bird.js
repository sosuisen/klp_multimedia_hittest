import * as PIXI from 'pixi.js';
const app = new PIXI.Application({ width: 640, height: 480 });

document.body.appendChild(app.view);


const atlasData = {
  frames: {
    walkLeft0: {
      frame: { x: 0, y: 256, w: 128, h: 128 },
    },
    walkLeft1: {
      frame: { x: 128, y: 256, w: 128, h: 128 },
    },
    walkLeft2: {
      frame: { x: 256, y: 256, w: 128, h: 128 },
    },
    walkRight0: {
      frame: { x: 384, y: 256, w: 128, h: 128 },
    },
    walkRight1: {
      frame: { x: 512, y: 256, w: 128, h: 128 },
    },
    walkRight2: {
      frame: { x: 640, y: 256, w: 128, h: 128 },
    },
    walkDown0: {
      frame: { x: 0, y: 128, w: 128, h: 128 },
    },
    walkDown1: {
      frame: { x: 128, y: 128, w: 128, h: 128 },
    },
    walkDown2: {
      frame: { x: 256, y: 128, w: 128, h: 128 },
    },
    walkDown0: {
      frame: { x: 0, y: 128, w: 128, h: 128 },
    },
    walkDown1: {
      frame: { x: 128, y: 128, w: 128, h: 128 },
    },
    walkDown2: {
      frame: { x: 256, y: 128, w: 128, h: 128 },
    },
    walkUp0: {
      frame: { x: 384, y: 128, w: 128, h: 128 },
    },
    walkUp1: {
      frame: { x: 512, y: 128, w: 128, h: 128 },
    },
    walkUp2: {
      frame: { x: 640, y: 128, w: 128, h: 128 },
    },
    fly0: {
      frame: { x: 0, y: 0, w: 128, h: 128 },
    },
    fly1: {
      frame: { x: 128, y: 0, w: 128, h: 128 },
    },
    fly2: {
      frame: { x: 256, y: 0, w: 128, h: 128 },
    },
    fly3: {
      frame: { x: 384, y: 0, w: 128, h: 128 },
    },
    fly4: {
      frame: { x: 512, y: 0, w: 128, h: 128 },
    },
    fly5: {
      frame: { x: 640, y: 0, w: 128, h: 128 },
    },
  },
  meta: {
    image: 'hiyoco.png',
  },
  animations: {
    walkLeft: ['walkLeft0', 'walkLeft1', 'walkLeft2'],
    walkRight: ['walkRight0', 'walkRight1', 'walkRight2'],
    walkDown: ['walkDown0', 'walkDown1', 'walkDown2'],
    walkUp: ['walkUp0', 'walkUp1', 'walkUp2'],
    fly: ['fly0', 'fly1', 'fly2', 'fly3', 'fly4', 'fly5'],
  },
};

// スプライトシートを作成
const spritesheet = new PIXI.Spritesheet(
  PIXI.BaseTexture.from(atlasData.meta.image),
  atlasData
);
await spritesheet.parse();

// 初期値は walkDown
const anime = new PIXI.AnimatedSprite(spritesheet.animations.walkDown);
anime.loop = true;
anime.animationSpeed = 0.1;
anime.play();
app.stage.addChild(anime);

// 現在の移動方向
let currentMove = '';

// アニメ再生
const play = (animeName, loop = true) => {
  if (currentMove === animeName) return;
  anime.textures = spritesheet.animations[animeName];
  if (loop) {
    anime.loop = true;
    anime.play();
  }
  else {
    anime.loop = false;
    anime.gotoAndPlay(0);
  }
  currentMove = animeName;
};

// イベントリスナー登録
window.addEventListener("keydown", event => {
  switch (event.key) {
    case 'ArrowRight':
      play('walkRight');
      break;
    case 'ArrowLeft':
      play('walkLeft');
      break;
    case 'ArrowDown':
      play('walkDown');
      break;
    case 'ArrowUp':
      play('walkUp');
      break;
    case ' ':
      play('fly', false);
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", () => {
  currentMove = '';
});

/**
 * 障害物
 */
const box = new PIXI.Graphics();
box.beginFill(0xe09060);
box.drawRoundedRect(0, 0, 100, 100);
box.endFill();
box.position.set(250, 150);
app.stage.addChild(box);

// 軸平行境界矩形
// (AABB: Axis-Aligned bounding Box）
// を用いた当たり判定
const testAABB = (bounds1, bounds2) => {
  return bounds1.x <= bounds2.x + bounds2.width
    && bounds2.x <= bounds1.x + bounds1.width
    && bounds1.y <= bounds2.y + bounds2.height
    && bounds2.y <= bounds1.y + bounds1.height 
}

app.ticker.add(() => {
  const delta = 2;
  const newBounds = {
    x: anime.x,
    y: anime.y,
    width: anime.width,
    height: anime.height,
  };
  switch (currentMove) {
    case 'walkLeft':
      newBounds.x -= delta;
      break;
    case 'walkRight':
      newBounds.x += delta;
      break;
    case 'walkUp':
      newBounds.y -= delta;
      break;
    case 'walkDown':
      newBounds.y += delta;
      break;
    default: break;
  }
  if (!testAABB(newBounds, { x: box.x, y: box.y, width: box.width, height: box.height })) {
    anime.x = newBounds.x;
    anime.y = newBounds.y;
  }
});

