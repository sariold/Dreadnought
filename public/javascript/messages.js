(function (exports) {

    /* 
     * Client to server: game is complete, the winner is ... 
     */
    exports.T_GAME_WON = 'GAME-WON';
    exports.O_GAME_WON = {
        type: exports.T_GAME_WON,
        data: null
    };

    /*
     * Server to client: abort game (e.g. if second player exited the game) 
     */
    exports.O_GAME_ABORTED = {
        type: 'GAME-ABORTED'
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
     * Server to client: set as player A 
     */
    exports.T_PLAYER_TYPE = 'PLAYER-TYPE';
    exports.O_PLAYER_A = {
        type: exports.T_PLAYER_TYPE,
        data: 'A'
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

    /* 
     * Server to client: set as player B 
     */
    exports.O_PLAYER_B = {
        type: exports.T_PLAYER_TYPE,
        data: 'B'
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

    /* 
     * Client to Server: PLAYER A hit PLAYER B ship
     */
    exports.T_C_HIT_C = 'C-HIT-C';
    exports.O_T_C_HIT_C = {
        type: exports.T_C_HIT_C,
        position: null,
        moves: null
    };

    /* 
     * Client to Server: PLAYER A miss PLAYER B ship
     */
    exports.T_C_MISS_C = 'C-MISS-C';
    exports.O_T_C_MISS_C = {
        type: exports.T_C_MISS_C,
        position: null,
        moves: null
    };

    /* 
     * Client to Server: PLAYER A doubleClicked B marked box
     */
    exports.T_C_DBL_C = 'C-DBL-C';
    exports.O_C_DBL_C = {
        type: exports.T_C_DBL_C,
        gameBoard: null,
        position: null,
    };

    /* 
     * Client to Server: PLAYER  send a message to OPPONENT 
     */
    exports.T_M_TO_C = 'M-TO-C';
    exports.O_M_TO_C = {
        type: exports.T_M_TO_C,
        data: ''
    };

    /* 
     * Client to Server: PLAYER took an action
     */
    exports.T_A_S_C = 'A-S-C';
    exports.O_A_S_C = {
        type: exports.T_A_S_C,
        position: null,
        gameBoard: null,
        moves: null
    };

    /* 
     * Client to Server: PLAYER took an action
     */
    exports.T_A_R_C = 'A-R-C';
    exports.O_A_R_C = {
        type: exports.T_A_R_C,
        gameBoard: null,
    };

    /* 
     * Server to Client: PLAYER turn
     */
    exports.T_C_T = 'C-T';
    exports.O_C_T = {
        type: exports.T_C_T,
        data: null,
    };

    /* 
     * Server to Client: not PLAYER turn
     */
    exports.T_N_C_T = 'N-C-T';
    exports.O_N_C_T = {
        type: exports.T_N_C_T,
        data: null,
    };

    /* 
     * Client to Server: PLAYER ready
     */
    exports.T_P_R = 'P-R';
    exports.O_P_R = {
        type: exports.T_P_R,
        gameBoard: null,
    };

    /* 
     * Client to Server: PLAYER ready
     */
    exports.T_P_P = 'P-P';
    exports.O_P_P = {
        type: exports.T_P_R,
    };

}(typeof exports === 'undefined' ? this.Messages = {} : exports));
//if exports is undefined, we are on the client; else the server