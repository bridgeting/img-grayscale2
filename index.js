const fs = require('fs');
const path = require('path');
const { createCanvas, Image } = require('canvas');

const canvas = createCanvas();
const context = canvas.getContext('2d');

fs.readFile('./assets/sky.png', (err, data) => {
    if (err) throw err;
    const img = new Image();
    img.onerror = err => { throw err }
    img.onload = () => {
        const imgWidth = img.width, imgHeight = img.height;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        context.clearRect(0, 0, imgWidth, imgHeight);
        context.drawImage(img, 0, 0);
        const imgData = context.getImageData(0, 0, imgWidth, imgHeight);
        grayscale(imgData);
    }
    img.src = data
})

function grayscale(imgData) {
    const { width, height, data } = imgData;
    for (let i = 0; i < width * height * 4; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        data.set([v, v, v, a].map(v => v), i);
    }
    context.putImageData(imgData, 0, 0);
    fs.writeFile(path.resolve(__dirname, 'filter/sky-grayscale.png'), canvas.toBuffer(), (err) => {
        if (err) throw err;
        console.log('grayscale created!');
    })
}

