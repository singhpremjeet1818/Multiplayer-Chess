"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "w"
            },
            moves: this.board.fen()
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'b'
            },
            moves: this.board.fen()
        }));
    }
    gameOver(socket, winner) {
        console.log(winner);
        if (socket === this.player1 && socket !== this.player2) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    type: 'Time out',
                    winStatus: winner
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    type: 'Time out',
                    winStatus: winner
                }
            }));
        }
        else if (socket !== this.player1 && socket === this.player2) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    type: 'Time out',
                    winStatus: 'winner'
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    type: 'Time out',
                    winStatus: 'lost'
                }
            }));
        }
    }
    makeMove(socket, move) {
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("Wrong turn");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("Wrong turn  *");
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            console.log('Hiii');
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
            return;
        }
        if (this.moveCount % 2 == 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
                colour: 'w'
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
                colour: 'b'
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
