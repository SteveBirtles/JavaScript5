let w = 0, h = 0;
const opp = 240/5, adj = 416/5, hyp = 480/5, bitSize = 50/5;

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

    for (let i = 0; i < 100; i++) {
        let x = Math.random()*hyp;
        let y = Math.random()*hyp;
        let dx = Math.random()*50-25;
        let dy = Math.random()*50-25;
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

const bitsCanvas = new OffscreenCanvas(hyp, hyp);
const maskCanvas = new OffscreenCanvas(opp, adj);
const segmentCanvas = new OffscreenCanvas(2*hyp, 2*adj);

function redraw(timestamp) {

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    a += frameLength/2;

    for (let bit of bits) {
        bit.x += bit.dx * frameLength;
        bit.y += bit.dy * frameLength;
        if (bit.x < -bitSize) bit.x += hyp+bitSize;
        if (bit.y < -bitSize) bit.y += hyp+bitSize;
        if (bit.x > hyp) bit.x -= hyp+bitSize;
        if (bit.y > hyp) bit.y -= hyp+bitSize;
    }

    const bitsContext = bitsCanvas.getContext('2d');
    bitsContext.fillStyle = 'black';
    bitsContext.fillRect(0,0,hyp,hyp);

    for (let bit of bits) {
        bitsContext.fillStyle = `rgb(${bit.r}, ${bit.g}, ${bit.b})`;
        bitsContext.fillRect(bit.x, bit.y, bitSize, bitSize);
    }

    const maskContext = maskCanvas.getContext('2d');
    maskContext.clearRect(0,0,opp,adj);

    maskContext.fillStyle = 'white';
    maskContext.globalCompositeOperation="source-over";

    maskContext.beginPath();
    maskContext.moveTo(0, 0);
    maskContext.lineTo(0, adj);
    maskContext.lineTo(opp, adj);
    maskContext.lineTo(0, 0);
    maskContext.fill();

    maskContext.globalCompositeOperation="source-in";
    maskContext.save();
    maskContext.translate(opp/2, adj/2)
    maskContext.rotate(a);
    maskContext.drawImage(bitsCanvas, -opp, -opp);
    maskContext.restore();

    const segmentContext = segmentCanvas.getContext('2d');

    segmentContext.save();
    segmentContext.translate(hyp,adj);
    for (let j = 0; j < 6; j ++) {
        segmentContext.rotate(Math.PI/3);
        segmentContext.drawImage(maskCanvas,0,0);
        segmentContext.scale(-1,1);
        segmentContext.drawImage(maskCanvas,0,0);
        segmentContext.scale(-1,1);
    }
    segmentContext.restore();

    const canvas = document.getElementById('kaleidoscopeCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0,0,w,h);

    context.save();
    context.translate(w/2-hyp, h/2-adj);
    context.globalAlpha = 1;
    context.drawImage(segmentCanvas, 0,0);
    context.globalAlpha = 0.5;
    for (let i = 0; i < 6; i++) {
        context.drawImage(segmentCanvas, 2*adj*Math.sin(i*Math.PI/3),2*adj*Math.cos(i*Math.PI/3));
    }
    context.restore();

    window.requestAnimationFrame(redraw);

}
