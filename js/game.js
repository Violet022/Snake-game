function incScore() {
    score++;
    if (highScore < score) {
        highScore = score;
    }
    drawScores();
}
function drawScores() {
    scoreBlock.innerHTML = score;
    highScoreBlock.innerHTML = highScore;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    lonelyPokemon.draw();
    drawChain();
}

function check(elem) {
    for (let i = 0; i < chain.tail.length; i++) {
        if(elem.x == chain.tail[i].x && elem.y == chain.tail[i].x) {
            return true;
        }
    }
    return false;
}

function newLonelyPokemon() {
    lonelyPokemon.x = getRandomInt(0, 10);
    lonelyPokemon.y = getRandomInt(0, 10);
    while (check(lonelyPokemon)) {
        lonelyPokemon.x = getRandomInt(0, 10);
        lonelyPokemon.y = getRandomInt(0, 10);
    }
    lonelyPokemon.url = pokemons[getRandomInt(1, 14)];
}

function changeCoordinates(el) {
    el.xPrev = el.x;
    el.yPrev = el.y;
}

function collision() {
    if (head.x < 0 || head.x > cellNumber - 1 || head.y < 0 || head.y > cellNumber - 1) {
        return true;
    }
    for(let i = 1; i < chain.tail.length; i++) {
        if (head.x == chain.tail[i].x && head.y == chain.tail[i].y) {
            return true;
        }
    }
    return false;
}
function drawChain() {
    changeCoordinates(head);
    head.x += chain.dx;
    head.y += chain.dy;

    for (let i = 1; i < chain.tail.length; i++) {
        changeCoordinates(chain.tail[i]);
        chain.tail[i].x = chain.tail[i - 1].xPrev;
        chain.tail[i].y = chain.tail[i - 1].yPrev;
    }

    if (head.x == lonelyPokemon.x && head.y == lonelyPokemon.y) {
        let pokemon = Object.assign({}, lonelyPokemon);
        changeCoordinates(pokemon);
        pokemon.x = chain.tail[chain.tail.length - 1].xPrev;
        pokemon.y = chain.tail[chain.tail.length - 1].yPrev;
        chain.tail.push(pokemon);
        newLonelyPokemon();
        incScore();
    }

    if (collision()) {
        refreshGame();
    }
    chain.tail.forEach(el => el.draw());
}

function whichKey(e) {
    if (e.code == "ArrowUp" && direction != "down") {
        direction = "up";
    } else if (e.code == "ArrowLeft" && direction != "right") {
        direction = "left";     
    } else if (e.code == "ArrowDown" && direction != "up") {
        direction = "down";
    } else if (e.code == "ArrowRight" && direction != "left") {
        direction = "right";
    }
    setDirection(direction);
    if(direction != undefined) {
        head.orientation = orientations[direction];
    }
}
function whichButton(e) {
    let buttonId = e.target.id;
    if ((buttonId == "up" || buttonId == "ar_up") && direction != "down") {
        direction = "up";
    } else if ((buttonId == "left" || buttonId == "ar_left") && direction != "right") {
        direction = "left";      
    } else if ((buttonId == "down" || buttonId == "ar_down")  && direction != "up") {
        direction = "down";
    } else if ((buttonId == "right" || buttonId == "ar_right") && direction != "left") {
        direction = "right";
    }
    setDirection(direction);
    head.orientation = orientations[direction];
}
function setDirection(dir) {
    switch(dir) {
        case "up":
            chain.dx = 0;
            chain.dy = -1;
            break;
        case "left":
            chain.dx = -1;
            chain.dy = 0;
            break;
        case "down":
            chain.dx = 0;
            chain.dy = 1;
            break;
        case "right":
            chain.dx = 1;
            chain.dy = 0;
            break;
    }
}

function refreshGame() {
    clearInterval(gameLooper);
    context.clearRect(0, 0, canvas.width, canvas.height);
    score = 0;
    direction = "";
    numberOfGames++;
	drawScores();

	head.x = 4;
	head.y = 5;
    chain.dx = 0;
	chain.dy = 0;
	chain.tail = [];
    chain.tail.push(head);

	newLonelyPokemon();
    gameLooper = setInterval(drawGame, speed);
}

function startTheGame() {
    head = new Element(4, 5, "../img/ash.png");
    chain.tail.push(head);

    lonelyPokemon = new Element();
    newLonelyPokemon();

    gameLooper = setInterval(drawGame, speed);
}

function checkSpeed(e) {
    if (e.code == "Enter") {
        if (speedBlock.value != "") {
            speed = speedBlock.value;
            speedBlock.blur();
            if (numberOfGames == 0) {
                startTheGame();
            }
            else {
                refreshGame();
            }
        }
        else {
            alert("Для начала игры введите скорость и нажмите клавишу Enter");
        }
    }
}

let pokemons = {
    1: "../img/pokemons/001.png",
    2: "../img/pokemons/002.png",
    3: "../img/pokemons/003.png",
    4: "../img/pokemons/004.png",
    5: "../img/pokemons/005.png",
    6: "../img/pokemons/006.png",
    7: "../img/pokemons/007.png",
    8: "../img/pokemons/008.png",
    9: "../img/pokemons/009.png",
    10: "../img/pokemons/010.png",
    11: "../img/pokemons/011.png",
    12: "../img/pokemons/012.png",
    13: "../img/pokemons/013.png"
}

let chain = {
    dx: 0,
    dy: 0,
    tail: [],
}

let orientations = {
    up: 1,
    right: 2,
    down: 3,
    left: 4,
}

function styleImage(img, orientation) {
    switch(orientation) {
        case 1:
            img.style.transform = "rotate(270deg)";
            break;
        case 2:
            break;
        case 3:
            img.style.transform = "rotate(270deg)";
            img.style.transform = "scale(-1, 1)";
            break;
        case 4:
            img.style.transform = "scaleX(-1)"; 
            break;
    }
    return img;
}
function Element(x = 0, y = 0, url = "") {
    this.x = x;
    this.y = y;
    this.url = url;
    this.xPrev = undefined;
    this.yPrev = undefined;
    this.orientation = orientations.right;

    this.draw = function() {
        let image = new Image();
        image.src = this.url;
        image.setAttribute('style', 'transform: scaleX(-1);');
        pc.appendChild(image);
        //image = styleImage(image, this.orientation);
        context.drawImage(image, this.x * cellSize, this.y * cellSize, cellSize, cellSize);
    };
}

let canvas;
let context;
let scoreBlock;
let highScoreBlock;
let speed;
let speedBlock;
let direction;
let head;
let lonelyPokemon;
let gameLooper;

let score = 0;
let highScore = 0;
let numberOfGames = 0;
let cellNumber = 10;
let cellSize = 50;
let mayStart = false;

let pc;

window.onload = function() {
    pc = document.getElementById("pic");
    canvas = document.querySelector("#field");
    context = canvas.getContext("2d");

    scoreBlock = document.querySelector(".score");
    highScoreBlock = document.querySelector('.highScore');
    let buttons = document.querySelectorAll(".game__button");
    speedBlock = document.querySelector(".speed__number");

    document.addEventListener("keydown", whichKey);
    document.addEventListener("keydown", checkSpeed);
    buttons.forEach(function(btn) {
        btn.addEventListener("click", whichButton);
    });
    alert("Для начала игры введите скорость и нажмите клавишу Enter");
}
