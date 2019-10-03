let w = 0, h = 0;

let sprites = [];
let markers = [];

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('kaleidoscopeCanvas');
    canvas.width = w;
    canvas.height = h;
}

let bits = [];

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    markers.push({x: 50, y: h/2});
    markers.push({x: w-50, y: h/2, d: w-100});

    for (let i = 0; i < 20; i++) {
        let x = Math.random()*300;
        let y = Math.random()*300;
        let dx = Math.random()*100-50;
        let dy = Math.random()*100-50;
        let r = 0, g = 0, b = 0;
        switch (Math.floor(Math.random()*6)) {
            case 0: r = 255; break;
            case 1: g = 255; break;
            case 2: b = 255; break;
            case 4: r = 255; g = 255; break;
            case 5: g = 255; b = 255; break;
            case 6: b = 255; r = 255; break;
        }
        bits.push({x, y, dx, dy, r, g, b});
    }

    window.requestAnimationFrame(redraw);


}

let lastTimestamp = 0;
let a = 0;

const maskCanvas = new OffscreenCanvas(300, 300);
const bitsCanvas = new OffscreenCanvas(300, 300);

function redraw(timestamp) {

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    a += frameLength;

    for (let bit of bits) {
        bit.x += bit.dx * frameLength;
        bit.y += bit.dy * frameLength;
        if (bit.x < -50) bit.x += 400;
        if (bit.y < -50) bit.y += 400;
        if (bit.x > 300) bit.x -= 400;
        if (bit.y > 300) bit.y -= 400;
    }

    const bitsContext = bitsCanvas.getContext('2d');
    bitsContext.fillStyle = 'black';
    bitsContext.fillRect(0,0,300,300);

    for (let bit of bits) {
        bitsContext.fillStyle = `rgb(${bit.r}, ${bit.g}, ${bit.b})`;
        bitsContext.fillRect(bit.x, bit.y, 50, 50);
    }

    const maskContext = maskCanvas.getContext('2d');

    maskContext.clearRect(0,0,300,300);

    maskContext.fillStyle = 'white';
    maskContext.globalCompositeOperation="source-over";

    maskContext.save();
    maskContext.translate(150,150);
    maskContext.rotate(a/2);
    maskContext.translate(-150,-150);
    maskContext.beginPath();
    maskContext.moveTo(150, 50);
    maskContext.lineTo(50, 250);
    maskContext.lineTo(250, 250);
    maskContext.lineTo(150, 50);
    maskContext.fill();
    maskContext.restore();

    maskContext.save();
    maskContext.translate(150,150);
    maskContext.rotate(-a);
    maskContext.translate(-150,-150);
    maskContext.globalCompositeOperation="source-in";
    maskContext.drawImage(bitsCanvas,0,0);
    maskContext.restore();

    const canvas = document.getElementById('kaleidoscopeCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0,0,w,h);

    context.save();
    context.translate(w/2,h/2);

    for (let j = 0; j < 8; j += 1) {
        context.rotate(a/(j*20));
        for (let i = 0; i < (j*8); i++) {
            context.rotate(Math.PI/(j*4));
            if (i % 2 == 0) context.scale(-1,1);
            if (j % 2 == 0) context.scale(1,-1);
            context.drawImage(maskCanvas,-50+(100*(j-1)),-50+(100*(j-1)));
            if (i % 2 == 0) context.scale(-1,1);
            if (j % 2 == 0) context.scale(1,-1);
        }
    }

    context.restore();

    /*context.strokeStyle = 'white';
    context.fillStyle = 'magenta';
    context.lineWidth = 3;
    context.drawImage(bitsCanvas, 10,10);
    context.strokeRect(10,10,310,310);
    context.fillRect(w-310,10,300,300);
    context.drawImage(maskCanvas, w-300,0);
    context.strokeRect(w-310,10,300,300); */

    window.requestAnimationFrame(redraw);

}
