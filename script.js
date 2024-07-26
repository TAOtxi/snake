const start = document.querySelector("#start-btn");
const setting = document.querySelector("#setting-btn");
const border = document.querySelector(".border");
const body = document.querySelector("body")
const canvas = document.querySelector("canvas");
const count = document.querySelector("#count");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
const choseImg = document.querySelector(".img");
const confirmBtn = document.querySelector("#confirm-btn");
const scoreFrame = document.querySelector("#score");
const settingFrame = document.querySelector("#setting");

const eatSound = new Audio("src/eat.mp3")
const backgroundMusic = new Audio("src/background.mp3");
const gameEnd = new Audio("src/gameEnd.mp3");
backgroundMusic.loop = true;
const img = new Image();
const imgList = ["src/fatBlue.webp", "src/BigFatTao.webp",
    "src/BigAircraft.webp", "src/potatoDer.webp"
];
img.src = imgList[0];
choseImg.src = imgList[0];
var imgListIdx = 0;

scoreFrame.addEventListener("mouseenter", () => {
    gameEnd.play();
})
setting.addEventListener("click", () => {
    settingFrame.className = "down";
});

leftBtn.addEventListener("click", () => {
    imgListIdx--;
    if (imgListIdx < 0)
        imgListIdx = imgList.length - 1;
    choseImg.src = imgList[imgListIdx];
});

rightBtn.addEventListener("click", () => {
    imgListIdx++;
    if (imgListIdx === imgList.length)
        imgListIdx = 0;
    choseImg.src = imgList[imgListIdx];
});

confirmBtn.addEventListener("click", () => {
    settingFrame.className = "up";
    img.src = imgList[imgListIdx];
})

var time;
var timeId;

start.addEventListener("click", () => {
    if (!isGame) {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
        isGame = true;
        border.classList.add("out");
        start.textContent = "Restart";
        time = 30;
        count.textContent = time;
        timeId = setInterval(countDown, 1000);

        setTimeout(() => {
            SnakeBody = [new Node(random(radius, width - radius),
                random(radius, height - radius), radius,
                "rgb(62, 204, 167)", 0)];
            requestAnimationFrame(run);
        }, 1500);
    }
    else {
        backgroundMusic.pause();
        ctx.clearRect(0, 0, width, height);
        clearInterval(timeId);
        isGame = false;
        length = 1;
        score.classList.remove("end");
        border.classList.remove("out");
        start.textContent = "Start";
    }
});

function countDown() {
    if (time === -1) {
        gameEnd.play();
        backgroundMusic.pause();
        clearInterval(timeId);
        scoreFrame.classList.add("end");
        scoreFrame.innerHTML = "Your score<br>" + (length - 1) + "🤣🔊";
        return;
    }

    if (time < 10)
        count.textContent = "0" + time;
    else
        count.textContent = time;
    time--;
}
function Node(x, y, r, color, ttl = -1) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.ttl = ttl;

    this.draw = (x = -1, y = -1) => {
        if (x !== -1) this.x = x;
        if (y !== -1) this.y = y;

        if (this.x > width - this.r) this.x = width - this.r;
        if (this.y > height - this.r) this.y = height - this.r;
        if (this.x < this.r) this.x = this.r;
        if (this.y < this.r) this.y = this.r;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.drawImage(img, this.x - radius, this.y - radius, 2 * radius, 2 * radius);

        if (ttl < length)
            this.ttl += 1;
    }
}

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};


window.onmousemove = e => {
    let rect = canvas.getBoundingClientRect();
    let offsetX = e.clientX - rect.x;
    let offsetY = e.clientY - rect.y;
    mouse.x = (offsetX / canvas.clientWidth) * canvas.width;
    mouse.y = (offsetY / canvas.clientHeight) * canvas.height;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function dist(node1, node2) {
    let dx = node1.x - node2.x;
    let dy = node1.y - node2.y;

    return Math.sqrt(dx * dx + dy * dy);
}

var isGame = false;
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
var SnakeBody = [];
var length = 1;
var radius = 60;
const apple = new Node(random(radius, width - radius),
    random(radius, height - radius),
    radius, "red", -1);

const next = {
    deltaX: 0,
    deltaY: 0,

    update() {
        let head = SnakeBody[SnakeBody.length - 1];

        let dx = mouse.x - head.x;
        let dy = mouse.y - head.y;
        let angle = Math.atan(Math.abs(dx / dy));
        let dist = Math.sqrt(dx * dx + dy * dy);

        this.deltaX = Math.sin(angle) * dist * 0.05 * Math.sign(dx);
        this.deltaY = Math.cos(angle) * dist * 0.05 * Math.sign(dy);
    }
}

function run() {
    ctx.clearRect(0, 0, width, height);

    SnakeBody = SnakeBody.filter((item, idx) => item.ttl < length);

    SnakeBody.forEach(item => item.draw());
    SnakeBody[SnakeBody.length - 1].color = "black";
    next.update();

    SnakeBody.push(new Node(SnakeBody[SnakeBody.length - 1].x + next.deltaX,
        SnakeBody[SnakeBody.length - 1].y + next.deltaY,
        radius, "rgb(62, 204, 167)", 0));

    apple.draw();

    if (dist(SnakeBody[SnakeBody.length - 1], apple) <= radius * 2) {
        eatSound.play();
        apple.draw(random(radius, width - radius), random(radius, height - radius));
        length += 1;
    }

    if (time >= 0 && isGame)
        requestAnimationFrame(run);
    if (!isGame)
        ctx.clearRect(0, 0, width, height);
}



