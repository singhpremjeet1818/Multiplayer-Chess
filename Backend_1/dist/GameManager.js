"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user != socket);
        //Stop the game logic
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    //start a game
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
            if (message.type === messages_1.MOVE) {
                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
            if (message.type === messages_1.GAME_OVER) {
                // const game = this.games.find(game => game.player1 ===socket || game.player2 === socket);
                console.log(message.payload.winner);
                if (game)
                    game.gameOver(socket, message.payload.winner);
            }
        });
    }
}
exports.GameManager = GameManager;
