const canvasEl = document.querySelector("canvas");
const canvasCtx = canvasEl.getContext("2d");

const gapX = 10;

const mouse = { x: 0, y: 0 };

const field = {
    w: window.innerWidth,
    h: window.innerHeight,

    resize: function () {
        this.w = window.innerWidth;
        this.h = window.innerHeight;

        if (window.innerWidth < window.innerHeight) {
            this.w = window.innerHeight;
            this.h = window.innerWidth;
            canvasEl.style.transform = 'rotate(90deg)';
            canvasEl.style.transformOrigin = 'center center';
        } else {
            canvasEl.style.transform = 'rotate(0deg)';
        }

        if (window.innerWidth < 768) {
            this.w = window.innerWidth;
            this.h = window.innerWidth * (3 / 4);
        }
    },

    draw: function () {
        canvasCtx.fillStyle = "#286047";
        canvasCtx.fillRect(0, 0, this.w, this.h);
    },
}

const line = {
    w: 15,
    h: field.h,
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";

        canvasCtx.fillRect(
            field.w / 2 - this.w / 2,
            0,
            this.w,
            this.h,
        )
    },
}

const leftPadle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function () {
        this.y = mouse.y - this.h / 2;
        if (this.y < 0) this.y = 0;
        if (this.y + this.h > field.h) this.y = field.h - this.h;
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    },
}

const rightPadle = {
    x: field.w - line.w - gapX,
    y: 0,
    w: line.w,
    h: 200,
    speed: 5,
    _move: function () {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
        if (this.y < 0) this.y = 0;
        if (this.y + this.h > field.h) this.y = field.h - this.h;
    },

    speedUp: function () {
        this.speed += 1;
    },

    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    },
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++;
    },
    increaseComputer: function () {
        this.computer++;
    },
    draw: function () {
        canvasCtx.font = "bold 72px Arial";
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseline = "top";
        canvasCtx.fillStyle = "#01341D";
        canvasCtx.fillText(this.human, field.w / 4, 50);
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50);
    }
}

const ball = {
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function () {

        if (this.x > field.w - this.r - rightPadle.w - gapX) {
            if (
                this.y + this.r > rightPadle.y &&
                this.y - this.r < rightPadle.y + rightPadle.h
            ) {
                this._reversex();
                this._speedUp();
            } else {
                score.increaseHuman();
                this._pointUp();
            }
        }

        if (this.x < this.r + leftPadle.w + gapX) {
            if (
                this.y + this.r > leftPadle.y &&
                this.y - this.r < leftPadle.y + leftPadle.h
            ) {
                this._reversex();
                this._speedUp();
            } else {
                score.increaseComputer();
                this._pointUp();
            }
        }

        if (
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)
        ) {
            this._reverseY();
        }
    },

    _speedUp: function () {
        this.speed += 0.5;
    },

    _reversex: function () {
        this.directionX *= -1;
    },
    _reverseY: function () {
        this.directionY *= -1;
    },

    _pointUp: function () {
        rightPadle.speedUp();
        this.speed = 5;

        this.x = field.w / 2;
        this.y = field.h / 2;
    },

    _move: function () {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        canvasCtx.fill();

        this._calcPosition();
        this._move();
    },
}

function setup() {
    field.resize();
    canvasEl.width = field.w;
    canvasEl.height = field.h;
}

function draw() {
    field.draw();

    line.draw();

    leftPadle.draw();

    rightPadle.draw();

    ball.draw();

    score.draw();
}

setup();
draw();

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    );
})();

let isPlaying = false;

function main() {
    if (isPlaying) {
        animateFrame(main);
        draw();
    }
}

canvasEl.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});

canvasEl.addEventListener('touchstart', function (e) {
    mouse.x = e.touches[0].pageX;
    mouse.y = e.touches[0].pageY;
});

canvasEl.addEventListener('touchmove', function (e) {
    mouse.x = e.touches[0].pageX;
    mouse.y = e.touches[0].pageY;
    e.preventDefault();
});

canvasEl.addEventListener('touchend', function () {
    mouse.x = 0;
    mouse.y = 0;
})


window.addEventListener('resize', function () {
    setup();
    if (!isPlaying) {
        draw();
    }
});

document.getElementById("playButton").addEventListener('click', function () {
    if (!isPlaying) {
        isPlaying = true;
        main();
    }
});

document.getElementById("pauseButton").addEventListener('click', function () {
    isPlaying = false;
});


if (window.screen.orientation) {
    window.screen.orientation.lock('landscape').catch(function (error) {
        console.log(error);
    });
}
