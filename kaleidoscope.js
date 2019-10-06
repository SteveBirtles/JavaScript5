let w = 0, h = 0;
const opp = 240, adj = 416, hyp = 480;
const source = new Image();

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('kaleidoscopeCanvas');
    canvas.width = w;
    canvas.height = h;
}

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    source.src = 'source3.jpg';
    source.onload = () => window.requestAnimationFrame(redraw);

}

let lastTimestamp = 0;
let a = 0;

const triangleCanvas = new OffscreenCanvas(opp, adj);
const hexagonCanvas = new OffscreenCanvas(2*hyp, 2*adj);

function redraw(timestamp) {

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    a += frameLength/2;

    const triCtx = triangleCanvas.getContext('2d');
    triCtx.clearRect(0,0,opp,adj);

    triCtx.fillStyle = 'white';
    triCtx.globalCompositeOperation="source-over";

    triCtx.beginPath();
    triCtx.moveTo(0, 0);
    triCtx.lineTo(0, adj);
    triCtx.lineTo(opp, adj);
    triCtx.lineTo(0, 0);
    triCtx.fill();

    triCtx.globalCompositeOperation="source-in";
    triCtx.save();
    triCtx.translate(opp/2, adj/2)
    triCtx.rotate(a);
    triCtx.drawImage(source, -source.width/2, -source.height/2);
    triCtx.restore();

    const hexCtx = hexagonCanvas.getContext('2d');

    hexCtx.save();
    hexCtx.translate(hyp,adj);
    for (let j = 0; j < 6; j ++) {
        hexCtx.rotate(Math.PI/3);
        hexCtx.drawImage(triangleCanvas,0,0);
        hexCtx.scale(-1,1);
        hexCtx.drawImage(triangleCanvas,0,0);
        hexCtx.scale(-1,1);
    }
    hexCtx.restore();

    const canvas = document.getElementById('kaleidoscopeCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0,0,w,h);

    context.save();
    context.translate(w/2-hyp, h/2-adj);
    context.globalAlpha = 1;
    context.drawImage(hexagonCanvas, 0,0);
    context.globalAlpha = 0.5;
    for (let i = 0; i < 6; i++) {
        context.drawImage(hexagonCanvas, 2*adj*Math.sin(i*Math.PI/3),2*adj*Math.cos(i*Math.PI/3));
    }
    context.restore();

    window.requestAnimationFrame(redraw);

}
