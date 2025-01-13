import ChessBoard from "./ChessBoard"
import '../App.css'
import Button from "./Button"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game-over";

const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard]  = useState(chess.board());
    
    console.log("Hello",chess.board())
    useEffect(()=>{
        if(!socket){
            return;
        }

        socket.onmessage = (event)=>{
            const message = JSON.parse(event.data);
            console.log("Ev", message)
            switch (message.type){
                case INIT_GAME:
                    console.log(message.payload.color, 'Hiiiiiiiiiiiii');
                    localStorage.setItem('color', message.payload.color);
                    localStorage.setItem('turn', 'w');
                    setBoard(chess.board());
                    
                    break;
                    
                    case MOVE:
                        
                    const move = message.payload;
                    const color = message.colour;
                    console.log("Move made",move)
                   
                        chess.move(move);
                        setBoard(chess.board()); 
                     if(color=== 'w') {
                        console.log('Now black')
                        localStorage.setItem('turn', 'b');}
                     if(color=== 'b'){ 
                        console.log('Now White')
                        localStorage.setItem('turn', 'w');}
                     


                       
                        // console.log('Board changed despite being returned on error while moving the piece')
                    
                     
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    break;        
            }
        }
    },[socket])

    if(!socket) return <div>Connecting...</div>
  return (
    <div className=" h-screen bg-black justify-center flex">
        <div className="pt-8 max-w-screen-lg">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4 bg-red-100 w-full">
                    <ChessBoard setBoard={setBoard} chess={chess} board={board} socket={socket}/>
                </div>
                <div className="col-span-2 ">
                    <Button onClick={()=>
                        socket.send(JSON.stringify({
                            type: INIT_GAME
                        }))
                    }>Play</Button>
                    
                </div>

            </div>
        </div>
        
    </div>
  )
}

export default Game