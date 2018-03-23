var image = null;
var canvas;

function upload() {
    canvas = document.getElementById("can");
    var fileinput = document.getElementById("finput");
    image = new SimpleImage(fileinput);
    image.drawTo(canvas);
    imgDimensions(image);
}

function imgDimensions(image) {
  var im = new SimpleImage(image);
  var width = im.getWidth();
  var height = im.getHeight();
  document.getElementById("d1").innerHTML = width + " x " + height;
}

function makeGray() {
    if (image == null || !image.complete()) {
        alert("image not loaded");
        return;
    }
    for (var pixel of image.values()) {
        var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
        pixel.setRed(avg);
        pixel.setGreen(avg);
        pixel.setBlue(avg);
    }
    var canvas = document.getElementById("can");
    image.drawTo(canvas);
}

function makeRed() {
    if (image == null || !image.complete()) {
        alert("image not loaded");
        return;
    }
    for (var pixel of image.values()) {
        pixel.setRed(150);
    }
    image.drawTo(canvas);
}

function makeLucky() {
    if (image == null || !image.complete()) {
        alert("image not loaded");
        return;
    }
    for (var pixel of image.values()) {
        var y = pixel.getY();
        var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;

        //red .143
        if (y < image.getHeight() * .143) {
            if (avg < 128) {
                pixel.setRed(2 * avg);
                pixel.setGreen(0)
                pixel.setBlue(0)
            } else {
                pixel.setRed(255);
                pixel.setGreen(2 * avg - 255)
                pixel.setBlue(2 * avg - 255)
            }
        }

        //orange .286
        if ((y > image.getHeight() * .143) && (y < image.getHeight() * .286)) {
            if (avg < 128) {
                pixel.setRed(2 * avg);
                pixel.setGreen(.8 * avg)
                pixel.setBlue(0)
            } else {
                pixel.setRed(255);
                pixel.setGreen(1.2 * avg - 255)
                pixel.setBlue(2 * avg - 255)
            }
        }

        //yellow .429
        if ((y > image.getHeight() * .286) && (y < image.getHeight() * .429)) {
            if (avg < 128) {
                pixel.setRed(2 * avg);
                pixel.setGreen(2 * avg)
                pixel.setBlue(0)
            } else {
                pixel.setRed(255);
                pixel.setGreen(255)
                pixel.setBlue(2 * avg - 255)
            }
        }

        //green .572
        if ((y > image.getHeight() * .429) && (y < image.getHeight() * .572)) {
            if (avg < 128) {
                pixel.setRed(0);
                pixel.setGreen(2 * avg)
                pixel.setBlue(0)
            } else {
                pixel.setRed(2 * avg - 255);
                pixel.setGreen(255)
                pixel.setBlue(2 * avg - 255)
            }
        }

        //blue .715
        if ((y > image.getHeight() * .572) && (y < image.getHeight() * .715)) {
            if (avg < 128) {
                pixel.setRed(0);
                pixel.setGreen(0)
                pixel.setBlue(2 * avg)
            } else {
                pixel.setRed(2 * avg - 255);
                pixel.setGreen(2 * avg - 255)
                pixel.setBlue(255)
            }
        }

        //indigo .858
        if ((y > image.getHeight() * .715) && (y < image.getHeight() * .858)) {
            if (avg < 128) {
                pixel.setRed(.8 * avg);
                pixel.setGreen(0)
                pixel.setBlue(2 * avg)
            } else {
                pixel.setRed(1.2 * avg - 51);
                pixel.setGreen(2 * avg - 255)
                pixel.setBlue(255)
            }
        }

        //violet 1.0
        if (y > image.getHeight() * .858) {
            if (avg < 128) {
                pixel.setRed(1.6 * avg);
                pixel.setGreen(0)
                pixel.setBlue(1.6 * avg)
            } else {
                pixel.setRed(.4 * avg + 153);
                pixel.setGreen(2 * avg - 255)
                pixel.setBlue(.4 * avg + 153)
            }
        }
    }
    image.drawTo(canvas);
}

function makeBlur() {
    if (image == null || !image.complete()) {
        alert("Image Not Loaded");
        return;
    } 
  for (var pixel of image.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    if (getRndInt() < 0.5) {
      image.setPixel(x, y, pixel);
    } else {
      var nearPixel = getNearPixel(image, x, y, 10);
      image.setPixel(x, y, nearPixel)
    }
}
image.drawTo(canvas);
}

function addFrame(thick) {
    if (image == null || !image.complete()) {
        alert("image not loaded");
        return;
    }
  if (thick < 1) {
    alert("Invalid Frame Size");
    return;
  }
    for (var pixel of image.values()) {
        if (pixel.getY() <= thick) {
            setBlack(pixel);
        }
        if (pixel.getY() >= image.getHeight() - thick) {
            setBlack(pixel);
        }
        if (pixel.getX() <= thick) {
            setBlack(pixel);
        }
        if (pixel.getX() >= image.getWidth() - thick) {
            setBlack(pixel);
        }
        if ((pixel.getY() >= image.getHeight() / 2 - thick * .5) && (pixel.getY() <= image.getHeight() / 2 + thick * .5)) {
            setBlack(pixel);
        }
        if ((pixel.getX() >= image.getWidth() / 2 - thick * .5) && (pixel.getX() <= image.getWidth() / 2 + thick * .5)) {
            setBlack(pixel);
        }
        if ((pixel.getX() >= image.getWidth() * .25 - thick * .5) && (pixel.getX() <= image.getWidth() * .25 + thick * .5)) {
            setBlack(pixel);
        }
        if ((pixel.getX() >= image.getWidth() * .75 - thick * .5) && (pixel.getX() <= image.getWidth() * .75 + thick * .5)) {
            setBlack(pixel);
        }
    }
    image.drawTo(canvas);
}

function setBlack(pixel) {
    pixel.setRed(40);
    pixel.setGreen(26);
    pixel.setBlue(13);
}

function reset() {
    if (image == null || !image.complete()) {
        alert("Image Not Loaded");
        return;
    }
    var fileinput = document.getElementById("finput");
    image = new SimpleImage(fileinput);
    image.drawTo(canvas);
}

function clearCan() {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("finput").value = "";
    document.getElementById("d1").innerHTML = "";
    image = null;
}

function getRndInt() {
  return Math.random();
}

function getNearPixel(image, x, y, distance) {
  var newX = x + getRndIn()*distance;
  var newY = y + getRndIn()*distance;
  return image.getPixel (newX, newY);
}