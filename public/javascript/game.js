/* eslint-disable linebreak-style */
/* eslint-disable no-empty */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* ESLint global variables information */
/* global Setup, Status, Messages*/

// Position constructor for every ship
function Position(col, row) {
    this.col = col;
    this.row = row;
    this.ship = null;
    this.id = null;
}
// Object for every ship containing the type, orientation, position, size, hidden value, URL array, ALT tag
var aircraftCarier = {
    type: 'aircraft-carrier',
    orientation: 'horizontal',
    position: [null, null, null, null, null],
    size: 5,
    hidden: true,
    URL: ['images/ShipPieces/AircraftCarrier1.png', 'images/ShipPieces/AircraftCarrier2.png', 'images/ShipPieces/AircraftCarrier3.png', 'images/ShipPieces/AircraftCarrier4.png', 'images/ShipPieces/AircraftCarrier5.png'],
    ALT: 'Aircraft Carier'
};

var battleShip = {
    type: 'battle-ship',
    orientation: 'horizontal',
    position: [null, null, null, null],
    size: 4,
    hidden: true,
    URL: ['images/ShipPieces/Battleship1.png', 'images/ShipPieces/Battleship2.png', 'images/ShipPieces/Battleship3.png', 'images/ShipPieces/Battleship4.png'],
    ALT: 'Battle Ship'
};

var cruiser = {
    type: 'cruiser',
    orientation: 'horizontal',
    position: [null, null, null],
    size: 3,
    hidden: true,
    URL: ['images/ShipPieces/Cruiser1.png', 'images/ShipPieces/Cruiser2.png', 'images/ShipPieces/Cruiser3.png'],
    ALT: 'Cruiser'
};

var submarineOne = {
    type: 'submarineOne',
    orientation: 'horizontal',
    position: [null, null, null],
    size: 3,
    hidden: true,
    URL: ['images/ShipPieces/Submarine1.png', 'images/ShipPieces/Submarine2.png', 'images/ShipPieces/Submarine3.png'],
    ALT: 'Submarine'
};

var submarineTwo = {
    type: 'submarineTwo',
    orientation: 'horizontal',
    position: [null, null, null],
    size: 3,
    hidden: true,
    URL: ['images/ShipPieces/Submarine1.png', 'images/ShipPieces/Submarine2.png', 'images/ShipPieces/Submarine3.png'],
    ALT: 'Submarine'
};

var destroyerOne = {
    type: 'destroyerOne',
    orientation: 'horizontal',
    position: [null, null],
    size: 2,
    hidden: true,
    URL: ['images/ShipPieces/Destroyer1.png', 'images/ShipPieces/Destroyer2.png'],
    ALT: 'Destroyer'
};

var destroyerTwo = {
    type: 'destroyerTwo',
    orientation: 'horizontal',
    position: [null, null],
    size: 2,
    hidden: true,
    URL: ['images/ShipPieces/Destroyer1.png', 'images/ShipPieces/Destroyer2.png'],
    ALT: 'Destroyer'
};

// Array containing reference to every ship
var marine = [];
marine.push(aircraftCarier);
marine.push(battleShip);
marine.push(cruiser);
marine.push(submarineOne);
marine.push(submarineTwo);
marine.push(destroyerOne);
marine.push(destroyerTwo);

// Constructor for the Ship Container of the player
function shipContainerConstructor(gs) {
    for (let i = 0; i < marine.length; i++) {
        let temp = document.createElement('div');
        temp.id = 'sh' + (i + 1);
        temp.className += marine[i].type;
        gs.gameShipContainer.appendChild(temp);
        for (let k = 0; k <= marine[i].size - 1; k++) {
            let shipImg = document.createElement('img');
            shipImg.src = marine[i].URL[k]; // URL of the image
            shipImg.alt = marine[i].ALT;
            temp.appendChild(shipImg);
            shipImg.id = (k + 1) + '-img';
        }
        temp.hidden = true;
    }
}

// Game board constructor with div elements
function boardConstructor(gs) {
    let rows = 10;
    let cols = 10;
    for (let i = 0; i < cols; i++) {
        for (let k = 0; k < rows; k++) {
            let square = document.createElement('div');
            let squareSize = 50; //we need to evaluate
            square.className += 's' + i + k;
            gs.gameBoardContainer.appendChild(square);
            let topPosition = k * squareSize;
            let leftPosition = i * squareSize;
            square.style.top = topPosition + 'px';
            square.style.left = leftPosition + 'px';
        }
    }
}

// Main game logic, containing the rules for placing a ship on the grid and creating the matrix
function initializingShip(gs, socket) {
    let shipCounter = 0;
    let button = document.createElement('button');
    button.innerHTML = 'Rotate';

    // This function allows the orientation of the ship to be changed
    function rotate() {
        if (shipRead.orientation === 'horizontal') {
            shipRead.orientation = 'vertical';
        } else {
            shipRead.orientation = 'horizontal';
        }
    }
    gs.gameShipContainer.appendChild(button);
    var shipRead = marine[shipCounter];
    var shipBox = gs.gameShipContainer.getElementsByTagName('div')[shipCounter + 1];
    placeShip();

    // This function prepares the next ship to be placed on the grid
    function updateShip() {
        shipCounter++;
        shipRead = marine[shipCounter];
        shipBox = gs.gameShipContainer.getElementsByTagName('div')[shipCounter + 1];
        placeShip();
    }

    // This function allows the player to place his ship on the board, but restricts him from violating the rules
    function placeShip() {
        'use strict';
        button.addEventListener('click', rotate);
        if (shipCounter === 7) {
            gs.ready = true;
            button.remove();
            let outgoingMsg = Messages.O_P_R;
            outgoingMsg.gameBoard = gs.gameBoard;
            socket.send(JSON.stringify(outgoingMsg));
            gs.statusBar.setStatus(Status.startPlaying);
            return;
        }
        shipBox.hidden = false;
        var elementsArray = gs.gameBoardContainer.querySelectorAll('div');
        elementsArray.forEach(function (elem) {
            elem.addEventListener('mouseenter', logMouseEnter);
        });
        let shipPosition = shipRead.position;

        function logMouseEnter(e) {
            let i = 0;
            let position = null;
            let shipClass = e.target.className;
            let x;
            let y;
            let tempCol;
            let tempRow;
            if (shipRead.orientation === 'horizontal') {
                tempCol = parseInt(shipClass.substring(1, 2)) - Math.floor(shipRead.size / 2);
                y = tempCol;
                x = parseInt(shipClass.substring(2, 3));
            } else if (shipRead.orientation === 'vertical') {
                tempRow = parseInt(shipClass.substring(2, 3)) - Math.floor(shipRead.size / 2);
                x = parseInt(shipClass.substring(1, 2));
                y = tempRow;
            }
            while (i < shipRead.size) {
                if (shipRead.orientation === 'horizontal') {
                    position = new Position(y, x);
                    position.ship = shipRead.type;
                    position.id = i + 1;
                } else if (shipRead.orientation === 'vertical') {
                    position = new Position(x, y);
                    position.ship = shipRead.type;
                    position.id = i + 1;
                }
                if (y < 0) {
                    let yErr = ((shipRead.orientation === 'horizontal') ? tempCol : parseInt(shipClass.substring(1, 2)));
                    let xErr = ((shipRead.orientation === 'vertical') ? tempRow : parseInt(shipClass.substring(2, 3)));
                    let positionError;
                    while (i < shipRead.size) {
                        try {
                            if (shipRead.orientation === 'horizontal') {
                                positionError = new Position(yErr, xErr);
                                try {
                                    document.getElementsByClassName('s' + yErr + xErr)[0].style.backgroundColor = 'red';
                                } catch (err) {}
                            } else if (shipRead.orientation === 'vertical') {
                                positionError = new Position(xErr, yErr);
                                try {
                                    document.getElementsByClassName('s' + xErr + yErr)[0].style.backgroundColor = 'red';
                                } catch (err) {}
                            }
                            shipPosition[i] = positionError;
                            yErr++;
                            i++;
                        } catch (err) {
                            yErr++;
                            i++;
                        }
                    }
                } else if (y > 9) {
                    let incrementMore = i;
                    while (incrementMore < shipRead.size) {
                        try {
                            shipPosition[incrementMore] = undefined;
                            incrementMore++;
                        } catch (err) {}
                    }
                    while (i >= 0) {
                        try {
                            if (shipRead.orientation === 'horizontal') {
                                document.getElementsByClassName('s' + y + x)[0].style.backgroundColor = 'red';
                            } else if (shipRead.orientation === 'vertical') {
                                document.getElementsByClassName('s' + x + y)[0].style.backgroundColor = 'red';
                            }
                            y--;
                            i--;
                        } catch (err) {
                            y--;
                            i--;
                        }
                    }
                    i = shipRead.size;
                }
                // else if (((shipRead.orientation === 'horizontal' && gs.gameBoard[x][y] === 1) || (shipRead.orientation === 'vertical' && gs.gameBoard[y][x] === 1)) || ((shipRead.orientation === 'horizontal' && gs.gameBoard[x][y] === 4) || (shipRead.orientation === 'vertical' && gs.gameBoard[y][x] === 4))) {
                //     while (i < shipRead.size) {
                //         i++;
                //     }
                //     while (i >= 0) {
                //         try {
                //             if (shipRead.orientation === 'horizontal') {
                //                 document.getElementsByClassName('s' + parseInt(shipClass.substring(1, 2)) + parseInt(shipClass.substring(2, 3)))[0].style.backgroundColor = 'red';
                //             } else if (shipRead.orientation === 'vertical') {
                //                 document.getElementsByClassName('s' + parseInt(shipClass.substring(1, 2)) + parseInt(shipClass.substring(2, 2)))[0].style.backgroundColor = 'red';
                //             }
                //             y--;
                //             i--;
                //         } catch (err) {
                //             y--;
                //             i--;
                //         }
                //     }
                //     i = shipRead.size;
                // } 
                else {
                    try {
                        if (shipRead.orientation === 'horizontal') {
                            document.getElementsByClassName('s' + y + x)[0].style.backgroundColor = 'limegreen';
                        } else if (shipRead.orientation === 'vertical') {
                            document.getElementsByClassName('s' + x + y)[0].style.backgroundColor = 'limegreen';
                        }
                        shipPosition[i] = position;
                        y++;
                        i++;
                    } catch (err) {
                        y++;
                        i++;
                    }
                }
            }
        }
        // Function that resets the style of the box after the mouse leaves it
        var logMouseOut = function () {
            let i = shipPosition.length;
            while (i >= 0) {
                let item = shipPosition[i];
                if (item !== null) {
                    try {
                        document.getElementsByClassName('s' + item.col + item.row)[0].style.backgroundColor = '';
                        i--;
                    } catch (err) {
                        i--;
                    }
                } else {
                    i--;
                }
            }
        };
        gs.gameBoardContainer.addEventListener('mouseout', logMouseOut);
        // Function that takes the players choice and places the ship in the matrix only if the choice is not violating any rules 
        var logMouseClick = function () {
            try {
                if (shipPosition[0].col >= 0 && shipPosition[shipPosition.length - 1].col <= 9 && shipPosition[0].row >= 0 && shipPosition[shipPosition.length - 1].row <= 9) {
                    let indexContain = 0;
                    let testRules = false;
                    while (indexContain < shipPosition.length) {
                        let rowContain = shipPosition[indexContain].row;
                        let colContain = shipPosition[indexContain].col;
                        if (gs.gameBoard[rowContain][colContain] === 1 || gs.gameBoard[rowContain][colContain] === 4) {
                            testRules = true;
                        }
                        indexContain++;
                    }
                    if (testRules === false) {
                        let i = 0;
                        while (i < shipPosition.length) {
                            let row = shipPosition[i].row;
                            let col = shipPosition[i].col;
                            i++;
                            try {
                                gs.gameBoard[row][col] = 1;
                            } catch (err) {}
                            try {
                                if (gs.gameBoard[row - 1][col - 1] !== 1) {
                                    gs.gameBoard[row - 1][col - 1] = 4;
                                }
                            } catch (err) {}
                            try {
                                if (gs.gameBoard[row][col - 1] !== 1) {
                                    gs.gameBoard[row][col - 1] = 4;
                                }
                            } catch (err) {}
                            try {
                                if (gs.gameBoard[row - 1][col] !== 1) {
                                    gs.gameBoard[row - 1][col] = 4;
                                }
                            } catch (err) {}
                            try {
                                if (gs.gameBoard[row - 1][col + 1] !== 1) {
                                    gs.gameBoard[row - 1][col + 1] = 4;
                                }
                            } catch (err) {}
                            try {
                                if (gs.gameBoard[row + 1][col - 1] !== 1) {

                                    gs.gameBoard[row + 1][col - 1] = 4;

                                }
                            } catch (err) {}
                            try {
                                if (gs.gameBoard[row + 1][col + 1] !== 1) {
                                    gs.gameBoard[row + 1][col + 1] = 4;
                                }
                            } catch (err) {}
                            if (i === shipPosition.length) {
                                try {
                                    if (gs.gameBoard[row][col + 1] !== 1) {
                                        gs.gameBoard[row][col + 1] = 4;
                                    }
                                } catch (err) {}
                            }
                            try {
                                if (gs.gameBoard[row + 1][col] !== 1) {
                                    gs.gameBoard[row + 1][col] = 4;
                                }
                            } catch (err) {}
                            let shipImg = document.createElement('img');
                            shipImg.src = shipRead.URL[i - 1];
                            shipImg.alt = shipRead.ALT;
                            shipImg.id = i + 1;
                            shipImg.className = shipRead.type;
                            document.getElementsByClassName('s' + col + row)[0].appendChild(shipImg);
                            if (shipRead.orientation === 'vertical') {
                                shipImg.className = 'rotated';
                            }
                            document.getElementsByClassName('s' + col + row)[0].style.backgroundColor = '';
                        }
                        finish();
                    } else {
                        alert('You are not allowed to place your ship here!');
                    }
                } else {
                    alert('You are not allowed to place your ship here!');
                }
            } catch (err) {
                console.error(err);
                alert('You are not allowed to place your ship here!');
            }
        };
        gs.gameBoardContainer.addEventListener('click', logMouseClick);
        // Function that closes every listener
        function finish() {
            elementsArray.forEach(function (elem) {
                elem.removeEventListener('mouseenter', logMouseEnter);
            });
            gs.gameBoardContainer.removeEventListener('mouseout', logMouseOut);
            gs.gameBoardContainer.removeEventListener('click', logMouseClick);
            button.removeEventListener('click', rotate);
            updateShip();
        }
    }
}

// Function that implements the game logic and changes the matrix according to the player's input
function hit(gs, position, gameBoard, socket) {
    try {
        let messageServer = null;
        let messageClient = null;
        messageServer = Messages.O_A_R_C;
        let col = position.col;
        let row = position.row;
        if (gameBoard[row][col] == 0 || gameBoard[row][col] == 4) {
            //gs.statusBar.setStatus = Status.enemyMiss;
            new Audio('./public/Water Splash Sound FX 1.mp3').play();
            gameBoard[row][col] = 3;
            messageClient = Messages.O_T_C_MISS_C;
            messageClient.position = position;
            messageClient.moves = gs.moves;
            socket.send(JSON.stringify(messageClient));
        } else if (gameBoard[row][col] == 1) {
            //gs.statusBar.setStatus = Status.enemyHit;
            gameBoard[row][col] = 2;
            //new Audio('./public/Hit - Sound Effect.mp3').play();
            gs.hitCount++;
            try {
                var shipType = document.getElementsByClassName('s' + row + col)[0].getElementsByTagName('img')[0];
                var shipTypeFinal = shipType.className;
                var shipId = parseInt(document.getElementsByClassName('s' + row + col)[0].getElementsByTagName('img')[0].id);
                var targetShip = document.getElementById('ships-player');
                var targetShip1 = targetShip.getElementsByClassName(shipTypeFinal)[0];
                var targetShip2 = targetShip1.getElementById(shipId + '-img');
                targetShip2.style.backgroundColor = 'red';
                messageClient.position.ship = shipTypeFinal;
                messageClient.position.id = shipId;
            } catch (err) {

            }
            messageClient = Messages.O_T_C_HIT_C;
            messageClient.position = position;
            messageClient.moves = gs.moves;
            socket.send(JSON.stringify(messageClient));
            if (gs.hitCount == 22) {
                let messageWin = Messages.O_GAME_WON;
                socket.send(JSON.stringify(messageWin));
                //gs.statusBar.setStatus(Status.gameLost);
                return;
            }
        } else if (gameBoard[row][col] > 1) {
            messageClient = Messages.O_T_C_DBL_C;
            messageClient.position = position;
            messageClient.gameBoard = gameBoard;
            messageClient.moves = gs.moves;
            socket.send(JSON.stringify(messageClient));
            return;
        }
        messageServer.gameBoard = gs.gameBoard;
        socket.send(JSON.stringify(messageServer));
    } catch (err) {}
}

// Function that show the current number of moves that the player has done
function StatusBar() {
    this.setStatus = function (status) {
        document.getElementById('statusbar').innerHTML = status;
    };
}

function chat(socket) {
    'use strict';
    document.getElementById('chat').getElementsByTagName('button')[0].addEventListener('click', messaging);
    document.getElementById('chat').getElementsByTagName('input')[0].addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            messaging();
        }
    });

    function messaging() {
        let message = Messages.O_M_TO_C;
        let messageValue = document.getElementById('msg_text').value;
        if (messageValue !== '') {
            var p = document.createElement('p');
            p.innerText = 'You:' + messageValue;
            p.className = 'msgSender';
            message.data = messageValue;
            document.getElementById('history').appendChild(p);
            socket.send(JSON.stringify(message));
            document.getElementById('msg_text').value = '';
        }
    }
}

function GameState(sb) {
    this.playerType = null;
    this.statusBar = sb;
    this.gameBoard = Setup.GAME_MATRIX;
    this.hitCount = Setup.HIT_COUNT;
    this.moves = Setup.MOVES;
    this.gameShipContainer = document.getElementById('ships-player');
    this.gameBoardContainer = document.getElementById('boardPreStage');
    this.ready = false;
    this.whoWon = null;
    this.getPlayer = function () {
        return this.playerType;
    };
    this.setPlayer = function (playerType) {
        this.playerType = playerType;
    };
}

function screenSize() {
    var warning = document.getElementById('redWarning');
    setInterval(() => {
        if (window.innerWidth < 1200 || window.innerHeight < 720) {
            warning.style.display = 'block';
        } else {
            warning.style.display = 'none';
        }
    }, 100);
}

function hitBox(gs, socket) {
    gs.gameBoardContainer.addEventListener('click', function (e) {
        if (e.target !== e.currentTarget) {
            let col = e.target.className.substring(1, 2);
            let row = e.target.className.substring(2, 3);
            let position = new Position(col, row);
            let outgoingMsg = Messages.O_A_S_C;
            outgoingMsg.position = position;
            gs.moves++;
            outgoingMsg.moves = gs.moves;
            socket.send(JSON.stringify(outgoingMsg));
            gs.gameBoardContainer.removeEventListener('click', hitBox);
        }
    });
}
(function setup() {
    var socket = new WebSocket(Setup.WEB_SOCKET_URL);
    // This will be part of the status bar/ Players will know whose turn it is/ We can add big message on the board to wait on enemy player
    var sb = new StatusBar();
    var gs = new GameState(sb);
    boardConstructor(gs);
    shipContainerConstructor(gs);
    initializingShip(gs, socket);
    sb.setStatus(Status.placeShips);
    screenSize();
    // Check if the player is ready to start the game and send the gameBoard
    chat(socket);
    document.getElementById('chatWindow').style.display = 'block';
    // We need to add a function here so that it runs the application/ I am gonna get rid of JQuery
    try {
        socket.onmessage = function (event) {
            let incomingMsg = JSON.parse(event.data);
            //set player type
            if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
                gs.setPlayer(incomingMsg.data); //should be 'A' or 'B'
            }
            if (incomingMsg.type == Messages.T_C_T) {
                //gs.statusBar.setStatus(Status.playerTurn);
                gs.gameBoardContainer.id = 'board';
                hitBox(gs, socket);
                gs.gameBoardContainer.addEventListener('click', hitBox);
                for (let i = 0; i < 22; i++) {
                    gs.gameBoardContainer.getElementsByTagName('img')[i].hidden = true;
                }
                try {
                    let hitBox = document.getElementById('board').querySelectorAll('#hitBox');
                    for (i = 0; i < hitBox.length; i++) {
                        hitBox[i].style.background = 'red';
                    }
                    let missBox = document.getElementById('board').querySelectorAll('#missBox');
                    for (i = 0; i < missBox.length; i++) {
                        missBox[i].style.background = 'cornflowerblue';
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            if (incomingMsg.type == Messages.T_N_C_T) {
                gs.gameBoardContainer.id = 'boardPreStage';
                try {
                    let hitBox = document.getElementById('boardPreStage').querySelectorAll('#hitBox');
                    for (i = 0; i < hitBox.length; i++) {
                        hitBox[i].style.backgroundColor = 'white';
                    }
                    let missBox = document.getElementById('boardPreStage').querySelectorAll('#missBox');
                    for (i = 0; i < missBox.length; i++) {
                        missBox[i].style.backgroundColor = 'white';
                    }
                } catch (err) {
                    console.error(err);
                }
                // I need to remove the style of the board
                for (let i = 0; i < 22; i++) {
                    gs.gameBoardContainer.getElementsByTagName('img')[i].hidden = false;
                }
                //sb.setStatus(Status.playerWait);
            }

            if (incomingMsg.type == Messages.T_A_S_C) {
                let gameBoard = incomingMsg.gameBoard;
                let position = incomingMsg.position;
                hit(gs, position, gameBoard, socket);
                document.getElementById('movesHis').innerHTML = incomingMsg.moves;
            }

            if (incomingMsg.type == Messages.T_M_TO_C) {
                let chatM = incomingMsg.data;
                let chatMC = document.createElement('p');
                chatMC.innerHTML = 'Opponent:' + chatM;
                chatMC.className = 'msgSender';
                document.getElementById('history').appendChild(chatMC);
            }

            if (incomingMsg.type == Messages.T_C_HIT_C) {
                //let targetShip = document.getElementById('ships-enemy').getElementsByClassName(incomingMsg.position.ship).getElementById(incomingMsg.position.id + '-img');
                //targetShip.style.backgroundColor = 'red';
                let targetBox = document.getElementsByClassName('s' + incomingMsg.position.col + incomingMsg.position.row)[0];
                let audioHit = new Audio('./public/Hit - Sound Effect.mp3');
                audioHit.play();
                targetBox.id = 'hitBox';
                targetBox.style.backgroundColor = 'red';
                document.getElementById('movesMine').innerHTML = gs.moves;
                //sb.setStatus(Status.playerHit);
            }

            if (incomingMsg.type == Messages.T_C_MISS_C) {
                let targetBox = document.getElementsByClassName('s' + incomingMsg.position.col + incomingMsg.position.row)[0];
                let audioMiss = new Audio('./public/Water Splash Sound FX 1.mp3');
                audioMiss.play();
                targetBox.id = 'missBox';
                targetBox.style.backgroundColor = 'cornflowerblue';
                document.getElementById('movesMine').innerHTML = gs.moves;
                //sb.setStatus(Status.playerMiss);
            }

            if (incomingMsg.type == Messages.T_C_DBL_C) {
                hitBox(gs, socket);
                //sb.setStatus(Status.playerTurnAgain);
            }

            if (incomingMsg.type == Messages.T_GAME_WON) {
                gs.whoWon = gs.getPlayer;
                //sb.setStatus(Status.gameWon);
            }

            socket.onopen = function () {
                socket.send('{}');
            };

            socket.onclose = function () {
                if (gs.whoWon == null) {
                    //sb.setStatus(Status.aborted);
                }
            };
            socket.onerror = function () {};
        };
    } catch (err) {}
})();