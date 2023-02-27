import init,{mandelbrot} from "./calc-wasm/pkg/calc_wasm.js";
//startup
var canvas = document.getElementById("canvas");
canvas.height = canvas.style.height = window.innerHeight;
canvas.width = canvas.style.width = window.innerWidth;
var aspectRatio = canvas.width/canvas.height;
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
var imageData;
var steps = 200;
var complexNum = {
    r:0,
    i:0,
    cr:0,
    ci:0,
    escStep:0
};
var i = {
    x:0 ,
    y:0,
    z:0,
    cr:0,
    ci:0,
    angle:0,
    sqr: function(real, imaginary) {
        complexNum.r = real*real-imaginary*imaginary;
        complexNum.i = 2*real*imaginary;
    },
    add:function(real1, imaginary1, real2, imaginary2) {
        complexNum.r = real1+real2;
        complexNum.i = imaginary1+imaginary2;
    }
};
var zoom = {
    x:0,
    y:0,
    height:4,
    step:0.2
};

setTimeout(await(init()).then(updateCanvas),1000);
canvas.addEventListener("click", handleInput);
//setTimeout(updateCanvas,1000);


function basicbrot() { //mandelbrotset calculation
    //console.log("starting!");
    for(let n = 0; n < canvas.width; n++) {
        //debugger;
        for(let n1 = 0; n1 < canvas.height; n1++) {
            complexNum.r = 0;
            complexNum.i = 0;
            let num = pixelToNumber(n,n1);
            complexNum.cr = num[0];
            complexNum.ci = num[1];
            complexNum.escStep = mandelbrot(complexNum.r,complexNum.i,complexNum.cr,complexNum.ci,steps);

            //draw
            if(complexNum.escStep >= 0) {
                for(let m = 0; m < 4; m++){
                    imageData.data[4*n+4*n1*imageData.width+m] = 255-complexNum.escStep;
                    if(m==3){imageData.data[4*n+4*n1*imageData.width+m] = 255;}
                }
            } else if(complexNum.escStep == steps+1) {
                for(let m = 0; m < 4; m++){
                    imageData.data[4*n+4*n1*imageData.width+m] = 255;
                    if(m==3){imageData.data[4*n+4*n1*imageData.width+m] = 255;}
                }
            } else {console.log("Error")}
        }
    }
    ctx.putImageData(imageData,0,0)
    //console.log("done!");
}
function pixelToNumber(x,y){
    return [x*zoom.height*aspectRatio/canvas.width-zoom.height/2*aspectRatio-zoom.x, -(y*zoom.height/canvas.height)+zoom.height/2+zoom.y]
}

export function updateCanvas(){ //updates canvas and variables
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageData = ctx.createImageData(canvas.width,canvas.height);
    console.log("updating...");

    setTimeout(basicbrot,10);
    console.log("done!");
}

function handleInput(e){
    console.log(e)
    let zoomXY = pixelToNumber(e.clientX, e.clientY);
    zoom.x = -zoomXY[0];
    zoom.y = zoomXY[1];
    zoom.height *= zoom.step;


    updateCanvas();
}