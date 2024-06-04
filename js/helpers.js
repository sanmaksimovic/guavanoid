function clearBlock(block, index) {
    if (block.hasPickup === true) {
        spawnPickup(block);
    }
    game.blocks.splice(index, 1);
}

function decreaseBlockHealth(block) {
    block.health -= 1;
}

function despawnPickup(index) {
    game.spawn.activePickupArray.splice(index, 1);
}

function despawnProjectile(projectile) {
    let index = game.spawn.activeProjectileArray.indexOf(projectile);
    game.spawn.activeProjectileArray.splice(index, 1);
}

function equipLaser(laser) {
    // get the associated pickup type color from the pickup type array of objects
    let index = game.pickupInit.pickupTypeArray.findIndex(obj => obj.type === laser);
    game.player.color = game.pickupInit.pickupTypeArray[index].color;

    // give the player more projectiles
    game.player.numProjectiles = game.projectileInit.numProjectiles;

    if (game.player.armed === false) { game.player.armed = true; }
}

function growPlayer() {
    game.player.growthActive = true;
    if (game.player.width !== game.playerInit.playerWidth*2) {
        game.player.width = game.player.width*2;
    }
    game.gameState.pickupGrowthTimerStartTime = performance.now();
}

function increasePlayerHealth() {
    game.player.lives++;
}

function incrementScore(block) {
    let score;

    switch(block.color) {
        case 'red':
            score = 7;
            break;
        case 'orange':
            score = 6;
            break;
        case 'yellow':
            score = 5;
            break;
        case 'green':
            score = 4;
            break;
        case 'blue':
            score = 3;
            break;
        case 'indigo':
            score = 2;
            break;
        case 'violet':
            score = 1;
            break;
        default:
            score = 1;
            break;
    }

    game.gameState.currentScore += score;
}

function playSound(sound) {
    switch (sound) {
        case game.audio.blockCollisionSound:
            if (game.audio.isSFX) { sound.play(); }
            break;
        case game.audio.failCollisionSound:
            if (game.audio.isSFX) { sound.play(); }
            break;
        case game.audio.laserProjectileSound:
            if (game.audio.isSFX) { sound.play(); }
            break;
        case game.audio.laserProjectileExplosionSound:
            if (game.audio.isSFX) { sound.play(); }
            break;
        case game.audio.pickupCollisionSound:
            if (game.audio.isSFX) { sound.play(); }
            break;
        case game.audio.playerCollisionSound:
            if (game.audio.isSFX) { sound.play(); }
            break;
        default:
            break;
    }
}

function randomlyAssignPickupsToBlocks() {
    for (let i = 0; i < game.pickupInit.numPickups; i++) {
        let randomInt = getRandomInt(0, game.blockInit.blockArray.length-1);
        game.blockInit.blockArray[randomInt].hasPickup = true;
    }
}

function saveHighScore() {
    if (localStorage.highScore === undefined ||
        localStorage.highScore < game.gameState.totalScore) {
            window.localStorage.highScore = JSON.stringify(game.gameState.totalScore);
        }
}

function spawnPickup(block) {
    let pickupX = block.x + (block.width / 2);
    let pickupY = block.y + (block.height / 2);
    let pickupRadius = block.height / 2;
    let pickupColor = 'black'; // for init only bc Pickup extends Ball, this gets overridden below by pickup type
    let pickupSpeedX = 200; // px/s - for init only bc Pickup extends Ball, speedX not used for pickups since they only fall
    let pickupSpeedY = 200; // px/s

    let pickup = new Pickup(pickupX, pickupY, pickupRadius, pickupColor, pickupSpeedX, pickupSpeedY);
    let randomInt = getRandomInt(0, game.pickupInit.pickupTypeArray.length-1);
    pickup.type = game.pickupInit.pickupTypeArray[randomInt].type;
    pickup.color = game.pickupInit.pickupTypeArray[randomInt].color;
    game.spawn.activePickupArray.push(pickup);
}

function spawnProjectile() {
    let projectile = new Projectile();
    let newLength = game.spawn.activeProjectileArray.push(projectile);
    let newIndex = newLength - 1;
    game.spawn.activeProjectileArray[newIndex].x = game.player.x + (game.player.width / 2) - (game.spawn.activeProjectileArray[newIndex].width / 2);
    game.spawn.activeProjectileArray[newIndex].y = game.player.y - game.spawn.activeProjectileArray[newIndex].height;
    playSound(game.audio.laserProjectileSound);
    game.player.numProjectiles--;
}