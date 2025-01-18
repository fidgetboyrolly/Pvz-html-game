const gameBoard = document.getElementById('game-board');
const messages = document.getElementById('messages');
let score = 0;
let sun = 0;
let zombies = [];
let plants = [];
let projectiles = [];
let suns = [];

for (let i = 0; i < 30; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    gameBoard.appendChild(cell);
}

function placePeashooter() {
    if (sun >= 50) {
        sun -= 50;
        updateSun();
        const cells = document.querySelectorAll('.cell');
        const index = 4; // Example: place Peashooter in the first row, middle cell
        const cell = cells[index];
        if (!cell.querySelector('.plant')) {
            const plant = document.createElement('div');
            plant.className = 'peashooter';
            cell.appendChild(plant);
            plants.push({ element: plant, cellIndex: index });
            setInterval(() => shootProjectile(cell, plant), 2000);
        }
    }
}

function placeSunflower() {
    if (sun >= 25) {
        sun -= 25;
        updateSun();
        const cells = document.querySelectorAll('.cell');
        const index = 9; // Example: place Sunflower in the second row, middle cell
        const cell = cells[index];
        if (!cell.querySelector('.plant')) {
            const plant = document.createElement('div');
            plant.className = 'sunflower';
            cell.appendChild(plant);
            plants.push({ element: plant, cellIndex: index });
            setInterval(() => generateSun(cell), 5000);
        }
    }
}

function placeWallnut() {
    if (sun >= 50) {
        sun -= 50;
        updateSun();
        const cells = document.querySelectorAll('.cell');
        const index = 14; // Example: place Wall-nut in the third row, middle cell
        const cell = cells[index];
        if (!cell.querySelector('.plant')) {
            const plant = document.createElement('div');
            plant.className = 'wallnut';
            plant.health = 5;
            cell.appendChild(plant);
            plants.push({ element: plant, cellIndex: index });
        }
    }
}

function spawnZombie() {
    const cells = document.querySelectorAll('.cell');
    const index = 29; // Example: spawn zombie in the last cell
    const cell = cells[index];
    if (!cell.querySelector('.zombie')) {
        const zombie = document.createElement('div');
        zombie.className = 'zombie';
        zombie.health = 3;
        cell.appendChild(zombie);
        zombies.push({ element: zombie, cellIndex: index });
        moveZombie(zombie, index);
    }
}

function moveZombie(zombie, index) {
    let interval = setInterval(() => {
        if (index > 0) {
            let nextCell = document.querySelector(`.cell:nth-child(${index})`);
            if (nextCell && !nextCell.querySelector('.zombie') && !nextCell.querySelector('.plant')) {
                zombie.remove();
                nextCell.appendChild(zombie);
                index--;
            } else if (nextCell && nextCell.querySelector('.plant')) {
                const plant = nextCell.querySelector('.plant');
                if (plant.className.includes('wallnut')) {
                    plant.health -= 1;
                    if (plant.health <= 0) {
                        plant.remove();
                    }
                }
                messages.innerText = "Zombie is attacking a plant!";
                clearInterval(interval);
            } else {
                clearInterval(interval);
            }
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function shootProjectile(cell, plant) {
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    cell.appendChild(projectile);
    projectiles.push(projectile);
    moveProjectile(projectile, cell);
}

function moveProjectile(projectile, cell) {
    let position = 0;
    let interval = setInterval(() => {
        position += 50;
        projectile.style.left = position + 'px';

        if (position >= gameBoard.clientWidth) {
            projectile.remove();
            clearInterval(interval);
        }
        
        zombies.forEach((zombie, index) => {
            const zombieCell = zombie.element.parentElement;
            if (zombieCell === cell.nextElementSibling) {
                zombie.health -= 1;
                if (zombie.health <= 0) {
                    zombie.element.remove();
                    zombies.splice(index, 1);
                    updateScore();
                }
                projectile.remove();
                clearInterval(interval);
            }
        });
    }, 500);
}

function generateSun(cell) {
    const sunElement = document.createElement('div');
    sunElement.className = 'sun';
    sunElement.onclick = collectSun;
    cell.appendChild(sunElement);
    setTimeout(() => sunElement.remove(), 5000);
}

function collectSun(event) {
    sun += 25;
    updateSun();
    event.target.remove();
}

function updateSun() {
    document.getElementById('sun').innerText = sun;
}

function updateScore() {
    score++;
    document.getElementById('score').innerText = score;
}

setInterval(spawnZombie, 5000);
