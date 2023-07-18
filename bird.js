import * as PIXI from 'pixi.js';
import { EventBoundary } from 'pixi.js';
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
anime.eventMode = 'static';
// 衝突判定を実施する範囲を指定
const animeBoundary = new EventBoundary(anime);

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
const orangeTexture = createCircleTexture(0xffe0a0);
const initSprite = (spr) => {
  spr.anchor.set(0.5);
  spr.x = Math.random() * app.screen.width;
  spr.y = Math.random() * app.screen.height;
  spr.texture = orangeTexture;
  return spr;
};
const maxSprites = 100;
const particles = new PIXI.Container();
for (let i = 0; i < maxSprites; i++) {
  const spr = new PIXI.Sprite();
  initSprite(spr);
  particles.addChild(spr);
}
app.stage.addChild(particles);

app.ticker.add(() => {
  const delta = 2;
  switch (currentMove) {
    case 'walkLeft':
      anime.x -= delta;
      break;
    case 'walkRight':
      anime.x += delta;
      break;
    case 'walkUp':
      anime.y -= delta;
      break;
    case 'walkDown':
      anime.y += delta;
      break;
    default: break;
  }
  for(let i = 0; i < particles.children.length; i++) {
    const spr = particles.children[i];
    if(animeBoundary.hitTest(spr.x, spr.y)){
      particles.removeChild(spr);
    }
  }
});

