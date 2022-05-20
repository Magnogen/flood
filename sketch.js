// jshint esversion: 10

const $ = query => document.querySelector(query);
const c = $('canvas');
const ctx = c.getContext('2d');
let list = [];

c.width  = c.offsetWidth;
c.height = c.offsetHeight;
// c.width  = 1920*2;
// c.height = 1920*2;
let imgdata = ctx.getImageData(0, 0, c.width, c.height);

const mouse = {
  state: 'idle',
  states: {
    idle: {
      move() {},
      down(e) {
        mouse.state = 'drawing';
        mouse.states[mouse.state].move(e)
      },
      up() {}
    },
    drawing: {
      move(e) {
        let x = 0|(c.width*e.layerX/innerWidth);
        let y = 0|(c.height*e.layerY/innerHeight);
        const i = 4 * (y * c.width + x);
        if (imgdata.data[i+3] == 0) {
          imgdata.data[i+0] = 0|(Math.random()*256);
          imgdata.data[i+1] = 0|(Math.random()*256);
          imgdata.data[i+2] = 0|(Math.random()*256);
          // imgdata.data[i+0] = 128;
          // imgdata.data[i+1] = 128;
          // imgdata.data[i+2] = 128;
          imgdata.data[i+3] = 255;
          ctx.putImageData(imgdata, 0, 0);
          list.push( i );
        }
      },
      down() {},
      up() {
        mouse.state = 'idle';
      }
    }
  }
}

c.addEventListener('mousedown', e => mouse.states[mouse.state].down(e));
c.addEventListener('mousemove', e => mouse.states[mouse.state].move(e));
c.addEventListener('mouseup', e => mouse.states[mouse.state].up(e));

// function random_bm() {
//   let u = 0, v = 0;
//   while (u == 0) u = Math.random();
//   while (v == 0) v = Math.random();
//   const num = 0.1*Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) + 0.5;
//   if (num > 1 || num < 0) return random_bm();
//   return num*2-1;
// }

function random_bm() {
  return 2*Math.random() - 1
}

(async () => {
  
  const deltaColour = 6;
  
  let last = performance.now();
  while (true) {
    if (list.length == 0) {
      ctx.putImageData(imgdata, 0, 0);
      await new Promise(requestAnimationFrame);
      continue;
    }
    
    let index = 0|(Math.random()*list.length);
    index = 0|(9999*list.length/10000);
    // index = 0;
    const i = list[index];
    const [x, y] = [(i/4)%c.width, 0|((i/4)/c.width)];
    let [r, g, b] = [imgdata.data[i], imgdata.data[i+1], imgdata.data[i+2]];
    
    let i_ = 4 * ((y-1) * c.width + x);
    if (y-1 >= 0 && imgdata.data[i_+3] == 0) {
      imgdata.data[i_+0] = r + deltaColour*random_bm();
      imgdata.data[i_+1] = g + deltaColour*random_bm();
      imgdata.data[i_+2] = b + deltaColour*random_bm();
      imgdata.data[i_+3] = 255;
      list.push( i_ );
    }
    i_ = 4 * (y * c.width + x-1);
    if (x-1 >= 0 && imgdata.data[i_+3] == 0) {
      imgdata.data[i_+0] = r + deltaColour*random_bm();
      imgdata.data[i_+1] = g + deltaColour*random_bm();
      imgdata.data[i_+2] = b + deltaColour*random_bm();
      imgdata.data[i_+3] = 255;
      list.push( i_ );
    }
    i_ = 4 * ((y+1) * c.width + x);
    if (y+1 < c.height && imgdata.data[i_+3] == 0) {
      imgdata.data[i_+0] = r + deltaColour*random_bm();
      imgdata.data[i_+1] = g + deltaColour*random_bm();
      imgdata.data[i_+2] = b + deltaColour*random_bm();
      imgdata.data[i_+3] = 255;
      list.push( i_ );
    }
    i_ = 4 * (y * c.width + x+1);
    if (x+1 < c.width && imgdata.data[i_+3] == 0) {
      imgdata.data[i_+0] = r + deltaColour*random_bm();
      imgdata.data[i_+1] = g + deltaColour*random_bm();
      imgdata.data[i_+2] = b + deltaColour*random_bm();
      imgdata.data[i_+3] = 255;
      list.push( i_ );
    }
    
    list.splice(index, 1);
    
    if (performance.now() - last > (1000 >> 6)) {
      ctx.putImageData(imgdata, 0, 0);
      await new Promise(requestAnimationFrame);
      last = performance.now();
    }
    
  }
})()
