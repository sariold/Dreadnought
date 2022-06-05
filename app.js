/* eslint-disable no-console */

/** Every game has two players
 * 
 */

var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.gameBoardA = null;
    this.gameBoardB = null;
    this.id = gameID;
    this.gameState = '0 JOINT';
};

game.prototype.transitionStates = {};
game.prototype.transitionStates['0 JOINT'] = 0;
game.prototype.transitionStates['1 JOINT'] = 1;
game.prototype.transitionStates['2 JOINT'] = 2;
game.prototype.transitionStates['A'] = 3; //A won
game.prototype.transitionStates['B'] = 4; //B won
game.prototype.transitionStates['ABORTED'] = 5; //ABORTED

game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0], //0 JOINT
    [1, 0, 1, 0, 0, 1], //1 JOINT
    [0, 0, 0, 1, 1, 1], //2 JOINT (note: once we have two players, there is no way back!)
    [0, 0, 0, 0, 0, 0], //A WON
    [0, 0, 0, 0, 0, 0], //B WON
    [0, 0, 0, 0, 0, 0] //ABORTED
];

game.prototype.isValidTransition = function (from, to) {
    let i, j;
    if (!(from in game.prototype.transitionStates)) {
        return false;
    } else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    } else {
        j = game.prototype.transitionStates[to];
    }

    return (game.prototype.transitionMatrix[i][j] > 0);
};

game.prototype.isValidState = function (s) {
    return (s in game.prototype.transitionStates);
};

game.prototype.setStatus = function (w) {
    if (game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)) {
        this.gameState = w;
        console.log('[STATUS] %s', this.gameState);
    } else {
        return new Error('Impossible status change from %s to %s', this.gameState, w);
    }
};

game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == '2 JOINT');
};

game.prototype.addPlayer = function (p) {
    if (this.gameState != '0 JOINT' && this.gameState != '1 JOINT') {
        return new Error('Invalid call to addPlayer, current state is %s', this.gameState);
    }

    /*
     * revise the game state
     */
    var error = this.setStatus('1 JOINT');
    if (error instanceof Error) {
        this.setStatus('2 JOINT');
    }

    if (this.playerA == null) {
        this.playerA = p;
        return 'A';
    } else {
        this.playerB = p;
        return 'B';
    }
};

var express = require('express');
var http = require('http');
var websocket = require('ws');
var messages = require('./public/javascript/messages');
var port = process.argv[2];
var app = express();
var indexRouter = require('./routes/index');
var gameStatus = require('./statTracker');
var cookies = require('cookie-parser');
var sessions = require('express-session');
var credentials = require('./credentials');
var server = http.createServer(app);
server.listen(process.env.PORT || 3000);

app.use(cookies(credentials.cookieSecret));
var sessionConfiguration = {
    // Code is slightly adjusted to avoid deprecation warnings when running the code.
    secret: credentials.cookieSecret,
    resave: true,
    saveUninitialized: true,
};
app.use(sessions(sessionConfiguration));

const wss = new websocket.Server({
    server
});
var websockets = {};

app.use(express.static(__dirname + '/public'));

app.get('/game', indexRouter);
// app.get('/', indexRouter);
// app.get('/splash', indexRouter);

//TODO: move to routes/index
app.get('/', (req, res, next) => {
    var session = req.session;
    if (session.views) {
        session.views++;
        gameStatus.pageVisits++;
    }
    else {
        gameStatus.pageVisits++;
    }
    res.render('splash.ejs', {
        pageVisits: gameStatus.pageVisits,
        gamesInitialized: gameStatus.gamesInitialized,
        gamesCompleted: gameStatus.gamesCompleted
    });
    next();
});

var currentGame = new game(gameStatus.gamesInitialized++);
var connectionId = 0;

wss.on('connection', function connection(ws) {
    let con = ws;
    con.id = connectionId++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    console.log('Player %s placed in game %s as %s', (con.id + 1), currentGame.id, playerType);

    con.send((playerType == 'A') ? messages.S_PLAYER_A : messages.S_PLAYER_B);

    /*
     * once we have two players, there is no way back; 
     * a new game object is created;
     * if a player now leaves, the game is aborted (player is not preplaced)
     */
    setInterval(function interval() {
        if ((currentGame.hasTwoConnectedPlayers()) && (currentGame.gameBoardA !== null && currentGame.gameBoardB !== null)) {
            currentGame.playerA.send(JSON.stringify(messages.O_C_T));
            currentGame.playerB.send(JSON.stringify(messages.O_N_C_T));
            currentGame = new game(gameStatus.gamesInitialized++);
            clearInterval(interval);
        }
    }, 5000);


    con.on('message', function incoming(message) {
        let outgoingMsg = null;
        let gameObj = websockets[con.id];
        if (playerType === 'A') {
            if (JSON.parse(message).type === 'P-R') {
                gameObj.gameBoardA = JSON.parse(message).gameBoard;
            }
            if (gameObj.hasTwoConnectedPlayers()) {
                if (JSON.parse(message).type === 'M-TO-C') {
                    gameObj.playerB.send(message);
                }
                if (JSON.parse(message).type === 'A-S-C') {
                    outgoingMsg = JSON.parse(message);
                    outgoingMsg.gameBoard = gameObj.gameBoardB;
                    gameObj.playerB.send(JSON.stringify(outgoingMsg));
                }
                if (JSON.parse(message).type === 'A-R-C') {
                    gameObj.gameBoardA = JSON.parse(message).gameBoard;
                    gameObj.playerA.send(JSON.stringify(messages.O_C_T));
                }
                if (JSON.parse(message).type === 'C-HIT-C' || JSON.parse(message).type === 'C-MISS-C') {
                    outgoingMsg = messages.O_N_C_T;
                    gameObj.playerB.send(JSON.stringify(outgoingMsg));
                    gameObj.playerB.send(message);
                }
                if (JSON.parse(message).type === 'C-DBL-C') {
                    gameObj.gameBoardA = JSON.parse(message).gameBoard;
                    gameObj.playerB.send(message);
                }
                if (JSON.parse(message).type === 'GAME-WON') {
                    gameObj.setStatus('B');
                    gameObj.playerB.send(message);
                    gameStatus.gamesCompleted++;
                }
            }
        } else if (playerType === 'B') {
            if (JSON.parse(message).type === 'P-R') {
                gameObj.gameBoardB = JSON.parse(message).gameBoard;
            }
            if (gameObj.hasTwoConnectedPlayers()) {
                if (JSON.parse(message).type === 'M-TO-C') {
                    gameObj.playerA.send(message);
                }
                if (JSON.parse(message).type === 'A-S-C') {
                    outgoingMsg = JSON.parse(message);
                    outgoingMsg.gameBoard = gameObj.gameBoardA;
                    gameObj.playerA.send(JSON.stringify(outgoingMsg));
                }
                if (JSON.parse(message).type === 'A-R-C') {
                    gameObj.gameBoardB = JSON.parse(message).gameBoard;
                    gameObj.playerB.send(JSON.stringify(messages.O_C_T));
                }
                if (JSON.parse(message).type === 'C-HIT-C' || JSON.parse(message).type === 'C-MISS-C') {
                    outgoingMsg = messages.O_N_C_T;
                    gameObj.playerA.send(JSON.stringify(outgoingMsg));
                    gameObj.playerA.send(message);
                }
                if (JSON.parse(message).type === 'C-DBL-C') {
                    gameObj.gameBoardB = JSON.parse(message).gameBoard;
                    gameObj.playerA.send(message);
                }
                if (JSON.parse(message).type === 'GAME-WON') {
                    gameObj.setStatus('A');
                    gameObj.playerA.send(message);
                    gameStatus.gamesCompleted++;
                }
            }
        }
    });
    con.on('close', function (code) {
        console.log((con.id + 1) + ' disconnected...');

        if (code == '1001') {
            let gameObj = websockets[con.id];
            if (gameObj.isValidTransition(gameObj.gameState, 'ABORTED')) {
                gameObj.setStatus('ABORTED');
                gameStatus.gameAborted++;
                if (!(currentGame.hasTwoConnectedPlayers()) && ((gameObj.playerB !== null))) {
                    currentGame = new game(gameStatus.gamesInitialized++);
                }
                try {
                    gameObj.playerA.close();
                    gameObj.playerA = null;
                } catch (e) {
                    console.log('Player A closing: ' + e);
                }

                try {
                    gameObj.playerB.close();
                    gameObj.playerB = null;
                } catch (e) {
                    console.log('Player B closing: ' + e);
                    currentGame = new game(gameStatus.gamesInitialized++);
                }
            }
        }
    });

});
