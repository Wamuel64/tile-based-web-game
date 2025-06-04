//Implement helper guide and notification what the player has picked up

function getRandomNum(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function player(health, attack, weapon) {
    this.health = health;
    this.attack = attack;
    this.weapon = weapon;
}
var player1 = new player(100, 10, "defaultWeapon");
var player2 = new player(100, 10, "defaultWeapon");

var tiles = document.getElementById("Board").querySelectorAll("td");
var tilesArray = [];
var i = 0;
var w = 0;

var spawnedWeaponsArea = [];
var weaponDrops = ["weapon1", "weapon2", "weapon3", "weapon4"];

function spawnWeapon() {
    if (spawnedWeaponsArea.length > 0 && !(spawnedWeaponsArea.includes(randomTileNumber))) {
        randomTile.id = weaponDrops[w];
        tilesArray.push(randomTile);
        spawnedWeaponsArea.push(randomTileNumber, randomTileNumber + 1, randomTileNumber + 2, randomTileNumber -1, randomTileNumber -2, randomTileNumber + 10, randomTileNumber + 20, randomTileNumber -10, randomTileNumber - 20);
        w++;
        i++;
        
    } else if (spawnedWeaponsArea.length === 0) {
        randomTile.id = weaponDrops[w];
        tilesArray.push(randomTile);
        spawnedWeaponsArea.push(randomTileNumber, randomTileNumber + 1, randomTileNumber + 2, randomTileNumber -1, randomTileNumber -2, randomTileNumber + 10, randomTileNumber + 20, randomTileNumber -10, randomTileNumber - 20);
        w++;
        i++;  
    }
}

//Generate the map
while (i < 16) {
    var randomTileNumber = getRandomNum(100);
    var randomTile = tiles[randomTileNumber];
    
    //Generate Blocked tiles
    if (!tilesArray.includes(randomTile) && i < 10) {
        randomTile.classList.add("blocked");
        tilesArray.push(randomTile);
        i++;
    
    //Generate Weapons
    } else if (!tilesArray.includes(randomTile) && i > 9 && i < 14) {
        spawnWeapon();
        
    //Player 1
    } else if (!tilesArray.includes(randomTile) && i === 14) {
        var player1TileNumber = randomTileNumber;
        var player1Tile = randomTile;
        player1Tile.id = "player1";
        tilesArray.push(player1Tile);
        i++;
        
    //Player 2 and does not spawn next to Player 1
    } else if (!tilesArray.includes(randomTile) && i === 15) {
        var player2TileNumber = randomTileNumber;
        if (!(player2TileNumber === (player1TileNumber - 1) || player2TileNumber === (player1TileNumber + 1) || player2TileNumber === (player1TileNumber + 10) || player2TileNumber === (player1TileNumber + 11) || player2TileNumber === (player1TileNumber + 9) || player2TileNumber === (player1TileNumber - 10) || player2TileNumber === (player1TileNumber - 11) || player2TileNumber === (player1TileNumber - 9))) {
            var player2Tile = randomTile;
            player2Tile.id = "player2";
            tilesArray.push(player2Tile);
            i++;
        }
    }
} 

function findIdNumber(element) {
    var finder = $("#Board td");
    for (var i = 0; i < 100; i++) {
        if (finder[i].id === element) {
            return i;
        }
    }
}

function findTargetNumber(target) {
    var board = document.getElementById("Board").querySelectorAll("td");
    for (var i = 0; i < 100; i++) {
        if (target === board[i]) {
            return i;
        }
    }
}

var playerRegex = /player/;
var weaponRegex = /weapon(?!default)/;

//Define areas players can move to
function moveArea(player) {
    var whichPlayer = player[player.length - 1];
    var playerPosition = document.getElementById(player);
    var playerPositionNumber = findIdNumber(player);
    var playerRow = playerPosition.parentElement;
    var playerRowTile = playerRow.querySelectorAll("td");
    var playerRowNumber = 0;
    
    //Finds out what number on the row the player is
    while (playerRowTile[playerRowNumber].id !== player) {
        playerRowNumber++;
    }

    //Place move tiles on left of player
    var left = -1;
    while (left > -4) {
        var playerLeftReach = playerRowTile[playerRowNumber + left];
        var playerLeftReachNumber = playerRowNumber + left;

        if (playerLeftReachNumber < 0) {
            break;
        } else {
            if (!playerLeftReach.classList.contains("blocked") && !(playerRegex.test(playerLeftReach.id))) {
                playerLeftReach.classList.add("move-area-p" + whichPlayer);
                left--;
            } else {
                break;
            }
        }
    }
    
    //Place move tiles on right of player
    var right = 1;
    while (right < 4) {
        var playerRightReach = playerRowTile[playerRowNumber + right];
        var playerRightReachNumber = playerRowNumber + right;

        if (playerRightReachNumber > 9) {
            break;
        } else {
            if (!playerRightReach.classList.contains("blocked") && !(playerRegex.test(playerRightReach.id))) {
                playerRightReach.classList.add("move-area-p" + whichPlayer);
                right++; 
            } else {
                break;
            }
        }
    }   
    
    //Place move tiles on top of player
    var above = -10;
    while (above > -40) {
        var playerTopReachNumber = playerPositionNumber + above;
        var playerTopReach = tiles[playerTopReachNumber];

        if (playerTopReachNumber < 0) {
            break;
        } else {
            if (!playerTopReach.classList.contains("blocked") && !(playerRegex.test(playerTopReach.id))) {
                playerTopReach.classList.add("move-area-p" + whichPlayer);
                above -= 10;
            } else {
                break;
            }
        }
    }

    //Place move tiles on bottom of player
    var below = 10;
    while (below < 40) {
        var playerBelowReachNumber = playerPositionNumber + below;
        var playerBelowReach = tiles[playerBelowReachNumber];
            
        if (playerBelowReachNumber > 99) {
            break;
        } else {
            if (!playerBelowReach.classList.contains("blocked") && !(playerRegex.test(playerBelowReach.id))) {
                playerBelowReach.classList.add("move-area-p" + whichPlayer);
                below += 10;
            } else {
                break;
            }
        }
    }
}

//Call first moveArea for start of game
moveArea("player1");

//Decide player turn
var switchPlayer = 1;
function isOdd(num) { return num % 2; }

function removeOldArea(player) {
    var whichPlayer = player[player.length - 1];
    var allMoveArea = document.getElementsByClassName("move-area-p" + whichPlayer);
    var i = 0;
    while (i < allMoveArea.length) {
        allMoveArea[i].classList.remove("move-area-p" + whichPlayer);
    }
}

//Player attacks and weaponDrops
var p1Attack = document.getElementById("p1Attack");
var p2Attack = document.getElementById("p2Attack");
var lastWeaponArrayP1 = [];
var lastWeaponArrayP2 = [];
var player1OnWeapon = false;
var player2OnWeapon = false;

//If player is on a weapon and moves, render weapon, else remove player id
function dropWeaoponOnSpotOrRemovePlayer(player) {
    var lastTile = document.getElementById(player);
    
    if (player1OnWeapon === true && player === "player1") {
        lastTile.id = previousP1Weapon;
        player1OnWeapon = false;
    } else if (player2OnWeapon === true && player === "player2") {
        lastTile.id = previousP2Weapon;
        player2OnWeapon = false;
    } else {
        lastTile.id = "";
    }
}

var previousP1Weapon;
var previousP2Weapon;

//Drop and equip weapons
function switchWeapon(newWeapon, player, target) {
    var playerVar = player === "player1" ? player1 : player2;
    var newWeaponElement = document.getElementById(newWeapon);
    var oldWeapon = playerVar.weapon;
    var lastWeaponArray = player === "player1" ? lastWeaponArrayP1 : lastWeaponArrayP2; 
    player === "player1" ? previousP1Weapon = player1.weapon : previousP2Weapon = player2.weapon;
    
    switch(newWeapon) {
        case "weapon1":
            playerVar.attack = 25;
            playerVar.weapon = "weapon1";
            feed("weapon1", player);
            break;
        case "weapon2":
            playerVar.attack = 30;
            playerVar.weapon = "weapon2";
            feed("weapon2", player);
            break;
        case "weapon3":
            playerVar.attack = 40;
            playerVar.weapon = "weapon3";
            feed("weapon3", player);
            break;
        case "weapon4":
            playerVar.attack = 30;
            playerVar.weapon = "weapon4";
            feed("weapon4", player);
            break;
    }
    
    //Render attack value
    if (player === "player1") {
        p1Attack.innerHTML = player1.attack;
        lastWeaponArrayP1.push(playerVar.weapon);
    } else {
        p2Attack.innerHTML = player2.attack;
        lastWeaponArrayP2.push(playerVar.weapon);
    }
    
    //Drop/take weapon
    if (lastWeaponArray.length > 1 && !(weaponRegex.test(target.id))) {
        newWeaponElement.id = oldWeapon;
        lastWeaponArray.shift();
    } else if (lastWeaponArray.length > 1 && weaponRegex.test(target.id)) {
        newWeaponElement.id = oldWeapon;
        lastWeaponArray.shift();
        player === "player1" ? player1OnWeapon = true : player2OnWeapon = true;
    } else {
        newWeaponElement.id = "";
    }
}

var moveAreaRegEx = /move-area/;

var weapon1Number = findIdNumber("weapon1");
var weapon2Number = findIdNumber("weapon2");
var weapon3Number = findIdNumber("weapon3");
var weapon4Number = findIdNumber("weapon4");
var weaponTileNumbers = [weapon1Number, weapon2Number, weapon3Number, weapon4Number];

//Detect weapon
function weaponEquip(target, player, playerNum) {
    var newPlayerTileNumber = findTargetNumber(target);
    
    var weapon1Element = document.getElementById("weapon1");
    var weapon2Element = document.getElementById("weapon2");
    var weapon3Element = document.getElementById("weapon3");
    var weapon4Element = document.getElementById("weapon4");

    weapon1Number = findIdNumber("weapon1");
    weapon2Number = findIdNumber("weapon2");
    weapon3Number = findIdNumber("weapon3");
    weapon4Number = findIdNumber("weapon4");
    
    weaponTileNumbers = [weapon1Number, weapon2Number, weapon3Number, weapon4Number];
    var weaponTiles = [weapon1Element, weapon2Element, weapon3Element, weapon4Element]; 
    
    //IF player goes over tile with a weapon in certain direction (100 tile index based)
    for (var i = 0; i < 4; i++) {
        if (newPlayerTileNumber < playerNum && newPlayerTileNumber > (playerNum - 4) && weaponTileNumbers[i] >= newPlayerTileNumber && weaponTileNumbers[i] < playerNum && moveAreaRegEx.test(weaponTiles[i].classList)) {//left
            switchWeapon(weaponDrops[i], player, target);
        
        } else if (newPlayerTileNumber < playerNum && newPlayerTileNumber < (playerNum -4) && weaponTileNumbers[i] >= newPlayerTileNumber && weaponTileNumbers[i] < (playerNum - 4) && moveAreaRegEx.test(weaponTiles[i].classList)) {//Up
            switchWeapon(weaponDrops[i], player, target);
        
        } else if (newPlayerTileNumber > playerNum && newPlayerTileNumber < (playerNum + 4) && weaponTileNumbers[i] <= newPlayerTileNumber && weaponTileNumbers[i] > playerNum && moveAreaRegEx.test(weaponTiles[i].classList)) {//Right
            switchWeapon(weaponDrops[i], player, target);
            
        } else if (newPlayerTileNumber > playerNum && newPlayerTileNumber > (playerNum + 4) && weaponTileNumbers[i] <= newPlayerTileNumber && weaponTileNumbers[i] > (playerNum + 4) && moveAreaRegEx.test(weaponTiles[i].classList)) {//Down
            switchWeapon(weaponDrops[i], player, target);
        
        }
    }    
}

//Create and delete elements to make repeated animation possible
function classToggle(element) {
    var element = document.getElementById(element);
    var cloneElement = element.cloneNode();
    element.parentNode.replaceChild(cloneElement, element);
}

var adjacentCalledOnce = false;
//Check if players are adjacent
function playerAdjacent(player, enemy) {
    var playerElement = document.getElementById(player);
    var playerNumber = findIdNumber(player);
    var playerRow = document.getElementById(player).parentElement;
    var playerRowTiles = playerRow.querySelectorAll("td");
    var playerRowNumber = 0;
    
    while (playerRowTiles[playerRowNumber].id !== player) {
        playerRowNumber++;
    }

    var leftOfPlayer = playerRowTiles[playerRowNumber - 1];
    var rightOfPlayer = playerRowTiles[playerRowNumber + 1];
    var topOfPlayer = tiles[playerNumber - 10];
    var bottomOfPlayer = tiles[playerNumber + 10];
    
    //Attack Animations
    if (!(playerRowNumber - 1 < 0) && playerRegex.test(leftOfPlayer.id)) {
        if (adjacentCalledOnce === true) {
            playerElement.classList.add("attackPlayer-left");
            classToggle(player);
        } else {
            adjacentCalledOnce = true;
            return true;
        }
    } else if (!(playerRowNumber + 1 > 9) && playerRegex.test(rightOfPlayer.id)) {
        if (adjacentCalledOnce === true) {
            playerElement.classList.add("attackPlayer-right");
            classToggle(player);
        } else {
            adjacentCalledOnce = true;
            return true;
        }
    } else if (!(playerNumber - 10 < 0) && playerRegex.test(topOfPlayer.id)) {
        if (adjacentCalledOnce === true) {
            playerElement.classList.add("attackPlayer-top");
            classToggle(player);
        } else {
            adjacentCalledOnce = true;
            return true;
        }
    } else if (!(playerNumber + 10 > 99) && playerRegex.test(bottomOfPlayer.id)) {
        if (adjacentCalledOnce === true) {
            playerElement.classList.add("attackPlayer-bottom");
            classToggle(player);
        } else {
            adjacentCalledOnce = true;
            return true;
        }
    }
}

function defendAnimation(player) {
    var defendPlayer = document.getElementById(player + "Defense");
    defendPlayer.style.visibility = "visible";
    defendPlayer.classList.add("defend-animation");
    classToggle(player + "Defense");
}

function renewFeed(playerFeed) {
    var feedVar = document.getElementById(playerFeed);
    while (feedVar.hasChildNodes()) {
        feedVar.removeChild(feedVar.firstChild);
    }
}

function winnerAnimation(player) {
    $("#winner").addClass("show-win-div");
    $("#winner-name").html(player.toUpperCase() + " WINS!");
    $("#winner-name").addClass("show-win-h1");
}


//Messages
var winner = " WINS!";
var hurt = "Careful, your health is low";
var critical = "You are at critical health!";
var weaponNames = ["Politics", "a Bad Playlist", "a Frown", "a Fidget Spinner"];

//Update feed below player interface
function feed(message, player) {
    var playerVar = player === "player1" ? player1 : player2;
    var playerFeed = player === "player1" ? "p1Feed" : "p2Feed";
    var playerFeedVar = player === "player1" ? $("#p1Feed") : $("#p2Feed");
    var enemyPlayerFeed = player === "player1" ? "p2Feed" : "p1Feed";
    
    renewFeed(playerFeed);
    switch (message) {
        case ("winner"):
        renewFeed(enemyPlayerFeed);
        winnerAnimation(player);
        break;
                
        case ("hurt"):
        playerFeedVar.html("<p>" + hurt + "</p>");
        break;
                
        case ("critical"):
        playerFeedVar.html("<p>" + critical + "</p>");
        break;
                
        case ("attack"):
        playerFeedVar.html("<p>" + player + " dealt " + playerVar.attack + " damage!" + "</p>");
        break;
                
        case ("blockedAttack"):
        playerFeedVar.html("<p>" + player + " only dealt " + playerVar.attack/2 + " damage" + "</p>");
        break;
        }
    for (var i = 0; i < 4; i++) {
        if (("weapon" + String(i + 1)) === message) {
            playerFeedVar.html("<p>" + player + " has equipped " + weaponNames[i] + "</p>");
        }
    }
}

var defenseClicked = false;

//Calculate attack damage
function attack(player) {
    var playerVar = player === "player1" ? player1 : player2;
    var enemyPlayer = player === "player1" ? "player2" : "player1";
    var enemyPlayerVar = player === "player1" ? player2 : player1;
    
    if (defenseClicked === false) {
        enemyPlayerVar.health -= playerVar.attack;
        feed("attack", player);
        health(enemyPlayer);
    } else if (defenseClicked === true) {
        enemyPlayerVar.health -= playerVar.attack/2;
        feed("blockedAttack", player);
        health(enemyPlayer);
    }
}

//Update and change player health and health color
function health(player) {
    var playerVar = player === "player1" ? player1 : player2;
    var enemyPlayerVar = player === "player1" ? "player2" : "player1";
    var playerHealthVar = player === "player1" ? $("#p1Health") : $("#p2Health");
    var playerHealthColorVar = player === "player1" ? $("#p1HealthColor") : $("#p2HealthColor");
    
    if (playerVar.health > 0) {
        playerHealthVar.html(playerVar.health);
        
        if (playerVar.health <= 60 && playerVar.health > 25) {
            playerHealthColorVar.css("background-color", "#f7b527");
            feed("hurt", player);
        } else if (playerVar.health <= 25) {
            playerHealthColorVar.css("background-color", "#ef2617");
            feed("critical", player);
        }
    } else {
        playerVar.health = 0;
        playerHealthVar.html(playerVar.health);
        if (playerVar.health <= 0) {
            winEffect();
            pauseMusic();
            feed("winner", enemyPlayerVar);
            blockButtons(player + "Buttons");
        }
    }
}

//Displays which player turn it is
function activateButtons(playerButtons) {
    var buttons = playerButtons === "player1Buttons" ? $("#player1Interface button") : $("#player2Interface button");
    buttons.addClass("activeButtons");
}

function blockButtons(playerButtons) {
    var buttons = playerButtons === "player1Buttons" ? $("#player1Interface button") : $("#player2Interface button");
    buttons.removeClass("activeButtons");
}

//Player moving/picking up weapons
function moveRoutine(e, player, enemy) {
    var target = e.target;
    var playerNumber = findIdNumber(player);
    dropWeaoponOnSpotOrRemovePlayer(player);
    weaponEquip(target, player, playerNumber);
    removeOldArea(player);
    target.setAttribute("id", player);
    //No call move-area ones adjacent
    if (playerAdjacent(player) === true) {
        activateButtons(player + "Buttons");
    } else {
        moveArea(enemy);
        switchPlayer++;  
    }
}

//Attack button clicked
function attackRoutine(player, enemy) {
    blockButtons(player + "Buttons");
    activateButtons(enemy + "Buttons");
    attack(player);
    playerAdjacent(player);
    punchEffect(player);
    defenseClicked = false;
    var defendPlayer = document.getElementById(enemy + "Defense");
    defendPlayer.style.visibility = "hidden";
    switchPlayer++;
}

//Defend button clicked
function defendRoutine(player, enemy) {
    blockButtons(player + "Buttons");
    activateButtons(enemy + "Buttons");
    defendAnimation(player);
    defendEffect();
    defenseClicked = true;
    switchPlayer++;
}

//Handle Clicks
$(document).ready(function() {
  $(document).on("click", function(e) {
    if (isOdd(switchPlayer) === 1 && e.target.className === "move-area-p1") {
        moveRoutine(e, "player1", "player2");
    } else if (isOdd(switchPlayer) === 0 && e.target.className === "move-area-p2") {
        moveRoutine(e, "player2", "player1");
        
    //Players adjacent can now press buttons
    } else if (player1.health > 0 && player2.health > 0 && adjacentCalledOnce === true) {  
        if (e.target.id === "p1Attack" && isOdd(switchPlayer) === 1) {
            attackRoutine("player1", "player2");
        } else if (e.target.id === "p2Attack" && isOdd(switchPlayer) === 0) {
            attackRoutine("player2", "player1");
        } else if (e.target.id === "p1Defend" && isOdd(switchPlayer) === 1) {
            defendRoutine("player1", "player2");
        } else if (e.target.id === "p2Defend" && isOdd(switchPlayer) === 0) {
            defendRoutine("player2", "player1");
        }
    }
  });
});

//Sounds and effects
//Object constructor for effects
function effect(src) {
    this.effect = document.createElement("audio");
    this.effect.src = src;
    this.effect.style.display = "none";
    document.body.appendChild(this.effect);
    this.effect.play();
}

var throwHitP1;
var throwHitP2;
function punchEffect(player) {
    if (player === "player1") {
        throwHitP1 = new effect("audio/punch.wav");
    } else {
        setTimeout(function() {
            throwHitP2 = new effect("audio/slap.wav");
        }, 400);
    }
}

var defendSound;
function defendEffect() {
    defendSound = new effect("audio/defend.wav");
}

var winSound;
function winEffect() {
    winSound = new effect("audio/winner.wav");
}

var bgMusic = new Audio('audio/oneDropReggae.mp3');
var playButton = $("#music");
function playMusic() {
    playButton.attr("src", "Images/pause-symbol.png");
    bgMusic.play();
    bgMusic.loop = true;
    $("#music").parent().attr("onclick", "pauseMusic()");
}
function pauseMusic() {
    playButton.attr("src", "Images/play.png");
    bgMusic.pause();
    $("#music").parent().attr("onclick", "playMusic()");
}
function lowerVolume() {
    bgMusic.volume -= 0.1;
}
function higherVolume() {
    bgMusic.volume += 0.1;
}

//How to play guide
function showGuide() {
    $("#how-to-guide").css("display", "block");
}
function hideGuide() {
    $("#how-to-guide").css("display", "none");
}