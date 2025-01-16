import { WebSocket } from "ws";
import {Chess} from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game{
    public player1 :WebSocket;
    public player2 :WebSocket;
    private board : Chess;
    private moves : string[];
    private startTime: Date;
    private moveCount = 0;

    constructor(player1:WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color: "w"
            },
            moves: this.board.fen()
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color:'b'
            },
            moves: this.board.fen()
        }))
    }

    gameOver(socket:WebSocket,winner:string){
        console.log(winner)
        if(socket===this.player1 && socket!==this.player2){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    type:'Time out',
                    winStatus:winner
                }
            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    type:'Time out',
                    winStatus:winner
                }
            }))
        }
        else if(socket!==this.player1 && socket===this.player2){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    type:'Time out',
                    winStatus:'winner'
                }
            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    type:'Time out',
                    winStatus:'lost'
                }
            }))
        }
    }
    makeMove(socket: WebSocket, move: {
        from:string;
        to:string;
    }){
        if(this.moveCount%2===0 && socket!== this.player1){
            console.log("Wrong turn");
            return;
            
        }
        if(this.moveCount%2 ===1 && socket!== this.player2){
            console.log("Wrong turn  *");
            return;
        }
        try{
            this.board.move(move);
            

        }catch(e){
            console.log(e);
            console.log('Hiii')
            return;
        }

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w'? 'black' : 'white'
                }
            }))

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w'? 'black' : 'white'
                }
            }))

            return;
        }

        if(this.moveCount%2==0){
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move,
                colour: 'w'
                
            }))
        }
        else{
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move,
                colour: 'b'
              
            }))
        }
        this.moveCount++;
    }

}