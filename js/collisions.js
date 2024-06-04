function testCollisionBallWithWalls(b) {
    // COLLISION WITH VERTICAL WALLS
    if ((b.x + b.radius) > game.canvas.w) {
        // the ball hit the right wall
        // change horizontal direction
        b.speedX = -b.speedX;
        
        // put the ball at the collision point
        b.x = game.canvas.w - b.radius;
    } else if ((b.x - b.radius) < 0) {
        // the ball hit the left wall
        // change horizontal direction
        b.speedX = -b.speedX;
        
        // put the ball at the collision point
        b.x = b.radius;
    }

    // COLLISIONS WTH HORIZONTAL WALLS
    // Not in the else as the ball can touch both
    // vertical and horizontal walls in corners
    if ((b.y + b.radius) > game.canvas.h) {
        // the ball hit the bottom wall
        // change vertical direction
        //b.speedY = -b.speedY;
        
        // put the ball at the collision point
        //b.y = game.canvas.h - b.radius;

        playSound(game.audio.failCollisionSound);
        game.playerFail();
    } else if ((b.y - b.radius) < 0) {
        // the ball hit the top wall
        // change vertical direction
        b.speedY = -b.speedY;
        
        // put the ball at the collision point
        b.y = b.radius;
    }
}

function testCollisionBallWithPlayer(b) {
    if(circRectsOverlap(game.player.x, game.player.y, game.player.width, game.player.height, b.x, b.y, b.radius)) {
        let ballRightSide = b.x + b.radius;
        let ballLeftSide = b.x - b.radius;
        let playerRightSide = game.player.x + game.player.width;
        let playerLeftSide = game.player.x;

        let ballTopSide = b.y - b.radius;
        let ballBottomSide = b.y + b.radius;
        let playerTopSide = game.player.y;
        let playerBottomSide = game.player.y + game.player.height;

        let ballGoingRight = b.speedX > 0;
        let ballGoingLeft = b.speedX < 0;
        let ballGoingUp = b.speedY < 0;
        let ballGoingDown = b.speedY > 0;

        // check if the ball hit the LEFT side of the player
        if (ballRightSide > playerLeftSide && ballGoingRight) {
                
            // also check if the ball centre is within the TOP & BOTTOM bounds of the block
            if (b.y > playerTopSide && b.y < playerBottomSide) {
                // change horizontal direction
                b.speedX = -b.speedX;
                ballGoingRight = false;
                ballGoingLeft = true;
                
                // put the ball at the collision point
                b.x = ballLeftSide - b.radius;
                
                // update the horizontal ball bounds
                ballLeftSide = b.x - b.radius;
                ballRightSide = b.x + b.radius;
            }

        // otherwise check if the ball hit the RIGHT side of the player
        } else if (ballLeftSide < playerRightSide && ballGoingLeft) {
                
            // also check if the ball centre is within the TOP & BOTTOM bounds of the block
            if (b.y > playerTopSide && b.y < playerBottomSide) {
                // change horizontal direction
                b.speedX = -b.speedX;
                ballGoingLeft = false;
                ballGoingRight = true;
                
                // put the ball at the collision point
                b.x = playerRightSide + b.radius;

                // update the horizontal ball bounds
                ballRightSide = b.x + b.radius;
                ballLeftSide = b.x - b.radius;
            }
        }

        // check if the ball hit the TOP side of the player
        if (ballBottomSide > playerTopSide && ballGoingDown) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the block
            if (b.x > playerLeftSide && b.x < playerRightSide) {
                let segment1 = game.player.x + (game.player.width / 5);
                let segment2 = game.player.x + (game.player.width / 5)*2;
                let segment3 = game.player.x + (game.player.width / 5)*3;
                let segment4 = game.player.x + (game.player.width / 5)*4;
                let segment5 = playerRightSide;
                let fullSpeedX = game.ballInit.ballStartSpeedX;
                let medSpeedX = fullSpeedX*0.6;
                let lowSpeedX = fullSpeedX*0.2;

                // change ball horizontal speed based on where 
                // it hit the paddle to simulate a change of angle
                if (b.x > playerLeftSide  && b.x < segment1) {
                    if (b.speedX > 0) { b.speedX = fullSpeedX; }
                    else if (b.speedX < 0) { b.speedX = -fullSpeedX; }
                } else if (b.x > segment1 && b.x < segment2) {
                    if (b.speedX > 0) { b.speedX = medSpeedX; }
                    else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                } else if (b.x > segment2 && b.x < segment3) {
                    if (b.speedX > 0) { b.speedX = lowSpeedX; }
                    else if (b.speedX < 0) { b.speedX = -lowSpeedX; }
                } else if (b.x > segment3 && b.x < segment4) {
                    if (b.speedX > 0) { b.speedX = medSpeedX; }
                    else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                } else if (b.x > segment4 && b.x < segment5) {
                    if (b.speedX > 0) { b.speedX = medSpeedX; }
                    else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                }

                // change vertical direction
                b.speedY = -b.speedY;
                ballGoingDown = false;
                ballGoingUp = true;
                
                // put the ball at the collision point
                b.y = playerTopSide - b.radius;

                // update the vertical ball bounds
                ballTopSide = b.y - b.radius;
                ballBottomSide = b.y + b.radius;
            }
        
        // otherwise check if the ball hit the BOTTOM side of the player
        } else if (ballTopSide < playerBottomSide && ballGoingUp) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the block
            if (b.x > playerLeftSide && b.x < playerRightSide) {
                // change vertical direction
                b.speedY = -b.speedY;
                ballGoingUp = false;
                ballGoingDown = true;
                
                // put the ball at the collision point
                b.y = playerBottomSide + b.radius;

                // update the vertical ball bounds
                ballBottomSide = b.y + b.radius;
                ballTopSide = b.y - b.radius;
            }
        }

        playSound(game.audio.playerCollisionSound);
    }
}

function testCollisionBallWithBlocks(b) {
    game.blocks.forEach(function(block, index) {
        if(circRectsOverlap(block.x, block.y, block.width, block.height, b.x, b.y, b.radius)) {
            let ballRightSide = b.x + b.radius;
            let ballLeftSide = b.x - b.radius;
            let blockRightSide = block.x + block.width;
            let blockLeftSide = block.x;

            let ballTopSide = b.y - b.radius;
            let ballBottomSide = b.y + b.radius;
            let blockTopSide = block.y;
            let blockBottomSide = block.y + block.height;

            let ballGoingRight = b.speedX > 0;
            let ballGoingLeft = b.speedX < 0;
            let ballGoingUp = b.speedY < 0;
            let ballGoingDown = b.speedY > 0;

            // check if the ball hit the LEFT side of the block
            if (ballRightSide > blockLeftSide && ballGoingRight) {
                
                // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                if (b.y > blockTopSide && b.y < blockBottomSide) {
                    // change horizontal direction
                    b.speedX = -b.speedX;
                    ballGoingRight = false;
                    ballGoingLeft = true;
                    
                    // put the ball at the collision point
                    b.x = ballLeftSide - b.radius;
                    
                    // update the horizontal ball bounds
                    ballLeftSide = b.x - b.radius;
                    ballRightSide = b.x + b.radius;
                }
            
            // otherwise check if the ball hit the RIGHT side of the block
            } else if (ballLeftSide < blockRightSide && ballGoingLeft) {
                
                // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                if (b.y > blockTopSide && b.y < blockBottomSide) {
                    // change horizontal direction
                    b.speedX = -b.speedX;
                    ballGoingLeft = false;
                    ballGoingRight = true;
                    
                    // put the ball at the collision point
                    b.x = blockRightSide + b.radius;

                    // update the horizontal ball bounds
                    ballRightSide = b.x + b.radius;
                    ballLeftSide = b.x - b.radius;
                }
            }
            
            // check if the ball hit the TOP side of the block
            if (ballBottomSide > blockTopSide && ballGoingDown) {

                // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                if (b.x > blockLeftSide && b.x < blockRightSide) {
                    // change vertical direction
                    b.speedY = -b.speedY;
                    ballGoingDown = false;
                    ballGoingUp = true;
                    
                    // put the ball at the collision point
                    b.y = blockTopSide - b.radius;

                    // update the vertical ball bounds
                    ballTopSide = b.y - b.radius;
                    ballBottomSide = b.y + b.radius;
                }
            
            // otherwise check if the ball hit the BOTTOM side of the block
            } else if (ballTopSide < blockBottomSide && ballGoingUp) {

                // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                if (b.x > blockLeftSide && b.x < blockRightSide) {
                    // change vertical direction
                    b.speedY = -b.speedY;
                    ballGoingUp = false;
                    ballGoingDown = true;
                    
                    // put the ball at the collision point
                    b.y = blockBottomSide + b.radius;

                    // update the vertical ball bounds
                    ballBottomSide = b.y + b.radius;
                    ballTopSide = b.y - b.radius;
                }
            }

            decreaseBlockHealth(block);

            if (block.health > 0) {
                // update color of breakable block based on health
                block.color = game.blockInit.breakableBlockColor[block.health-1];
            } else {
                clearBlock(block, index);
            }

            incrementScore(block);
            playSound(game.audio.blockCollisionSound);
        }
    });
}

function testCollisionBallWithInnerWalls(b) {
    if(circRectsOverlap(game.wall.x, game.wall.y, game.wall.width, game.wall.height, b.x, b.y, b.radius)) {
        let ballRightSide = b.x + b.radius;
        let ballLeftSide = b.x - b.radius;
        let wallRightSide = game.wall.x + game.wall.width;
        let wallLeftSide = game.wall.x;

        let ballTopSide = b.y - b.radius;
        let ballBottomSide = b.y + b.radius;
        let wallTopSide = game.wall.y;
        let wallBottomSide = game.wall.y + game.wall.height;

        let ballGoingRight = b.speedX > 0;
        let ballGoingLeft = b.speedX < 0;
        let ballGoingUp = b.speedY < 0;
        let ballGoingDown = b.speedY > 0;

        // check if the ball hit the LEFT side of the wall
        if (ballRightSide > wallLeftSide && ballGoingRight) {
            
            // also check if the ball centre is within the TOP & BOTTOM bounds of the wall
            if (b.y > wallTopSide && b.y < wallBottomSide) {
                // change horizontal direction
                b.speedX = -b.speedX;
                ballGoingRight = false;
                ballGoingLeft = true;
                
                // put the ball at the collision point
                b.x = ballLeftSide - b.radius;
                
                // update the horizontal ball bounds
                ballLeftSide = b.x - b.radius;
                ballRightSide = b.x + b.radius;
            }
        
        // otherwise check if the ball hit the RIGHT side of the wall
        } else if (ballLeftSide < wallRightSide && ballGoingLeft) {
            
            // also check if the ball centre is within the TOP & BOTTOM bounds of the wall
            if (b.y > wallTopSide && b.y < wallBottomSide) {
                // change horizontal direction
                b.speedX = -b.speedX;
                ballGoingLeft = false;
                ballGoingRight = true;
                
                // put the ball at the collision point
                b.x = wallRightSide + b.radius;

                // update the horizontal ball bounds
                ballRightSide = b.x + b.radius;
                ballLeftSide = b.x - b.radius;
            }
        }
        
        // check if the ball hit the TOP side of the wall
        if (ballBottomSide > wallTopSide && ballGoingDown) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the wall
            if (b.x > wallLeftSide && b.x < wallRightSide) {
                // change vertical direction
                b.speedY = -b.speedY;
                ballGoingDown = false;
                ballGoingUp = true;
                
                // put the ball at the collision point
                b.y = wallTopSide - b.radius;

                // update the vertical ball bounds
                ballTopSide = b.y - b.radius;
                ballBottomSide = b.y + b.radius;
            }
        
        // otherwise check if the ball hit the BOTTOM side of the wall
        } else if (ballTopSide < wallBottomSide && ballGoingUp) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the wall
            if (b.x > wallLeftSide && b.x < wallRightSide) {
                // change vertical direction
                b.speedY = -b.speedY;
                ballGoingUp = false;
                ballGoingDown = true;
                
                // put the ball at the collision point
                b.y = wallBottomSide + b.radius;

                // update the vertical ball bounds
                ballBottomSide = b.y + b.radius;
                ballTopSide = b.y - b.radius;
            }
        }
    }
}

function testCollisionPickupWithFloor(p, index) {
    if ((p.y + p.radius) > game.canvas.h) {
        despawnPickup(index);
    }
}

function testCollisionPickupWithPlayer(p, index) {
    if(circRectsOverlap(game.player.x, game.player.y, game.player.width, game.player.height, p.x, p.y, p.radius)) {
        let pickupRightSide = p.x + p.radius;
        let pickupLeftSide = p.x - p.radius;
        let playerRightSide = game.player.x + game.player.width;
        let playerLeftSide = game.player.x;

        let pickupTopSide = p.y - p.radius;
        let pickupBottomSide = p.y + p.radius;
        let playerTopSide = game.player.y;
        let playerBottomSide = game.player.y + game.player.height;

        if (((pickupRightSide > playerLeftSide || pickupLeftSide < playerRightSide) &&
            (p.y > playerTopSide && p.y < playerBottomSide)) ||
            ((pickupBottomSide > playerTopSide || pickupTopSide < playerBottomSide) &&
            (p.x > playerLeftSide && p.x < playerRightSide))) {
            
            let growth = 'growth';
            let health = 'health';
            let laser = 'laser';
            let points = 'points';
            
            if (p.type === growth) {
                growPlayer();
            } else if (p.type === health) {
                increasePlayerHealth();
            } else if (p.type === laser) {
                equipLaser(laser);
            } else if (p.type === points) {
                game.gameState.currentScore += 10;
            }
            
            despawnPickup(index);
        }

        playSound(game.audio.pickupCollisionSound);
    }
}

function testCollisionProjectileWithBlocks(p) {
    game.blocks.forEach(function(block, index) {
        if (rectsOverlap(block.x, block.y, block.width, block.height,
            p.x, p.y, p.width, p.height)) {
                clearBlock(block, index);
                despawnProjectile(p);
                incrementScore(block);
                playSound(game.audio.laserProjectileExplosionSound);
            }
        });
}

function testCollisionProjectileWithWalls(p) {
    let projectileTop = p.y;
    let topBoundary = 0;
    if (projectileTop < topBoundary) {
        despawnProjectile(p);
    }
}