import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager{
    private games: Game[];
    private pendingUser :WebSocket | null;
    private users: WebSocket[];
    
    constructor(){
        this.games = [];
        this.pendingUser = null;
        this.users = [];

    }

    addUser(socket: WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user=>user!=socket);
        //Stop the game logic
    }

    private addHandler(socket:WebSocket){
        socket.on("message", (data)=>{
            const message = JSON.parse(data.toString());

            if(message.type === INIT_GAME){
                if(this.pendingUser){
                    //start a game
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else{
                    this.pendingUser = socket;
                }
            }

            const game = this.games.find(game => game.player1 ===socket || game.player2 === socket);
            if(message.type===MOVE){
                if(game){
                    game.makeMove(socket, message.payload.move)
                }
            }
            if(message.type===GAME_OVER){
                // const game = this.games.find(game => game.player1 ===socket || game.player2 === socket);
                console.log(message.payload.winner)
                if(game)
                game.gameOver(socket,message.payload.winner);
                
            }
        })

    }
}