import ChessBoard from "./ChessBoard"
import '../App.css'
import Button from "./Button"
import { useSocket } from "../hooks/useSocket"
import { useEffect, useState,useRef } from "react";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game-over";
import move from '../../src/assets/sound-effects/Move.mp3'
import GameStart from '../../src/assets/sound-effects/GameStart.mp3'
import buttonpress from '../../src/assets/sound-effects/buttonpress.mp3'
import WinnerModal from "./WinnerModal";
import SelectPromotion from "./SelectPromotion";

const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard]  = useState(chess.board());
    const moveAudio = useRef<HTMLAudioElement>();
    const startAudio = useRef<HTMLAudioElement>();
    const buttonAudio = useRef<HTMLAudioElement>();
    const [isgameStarted,setIsGameStarted] = useState(false);
    const [winStatus,setWinStatus] = useState<string>('');
    const [isOver,setIsOver] = useState(false);
    
    const handleCloseModal = () => {
        setIsOver(false);  // Reset game state or restart the game logic
        setWinStatus('');
      };
    useEffect(()=>{
        
        moveAudio.current =new Audio(move);
        startAudio.current =new Audio(GameStart);
        buttonAudio.current = new Audio(buttonpress)
      },[])
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
                    
                    console.log(message)
                    console.log(message.payload.color, 'Hiiiiiiiiiiiii');
                    localStorage.setItem('color', message.payload.color);
                    localStorage.setItem('turn', 'w');
                    startAudio.current?.play();
                    setIsGameStarted(true);
                    setBoard(chess.board());
                    
                    
                    break;
                    
                    case MOVE:
                        
                    const move = message.payload;
                    const color = message.colour;
                    console.log("Move made",move)
                    chess.move(move);
                    setBoard(chess.board()); 
                    moveAudio.current?.play()
                     if(color=== 'w') {
                        console.log('Now black')
                        localStorage.setItem('turn', 'b');}
                     if(color=== 'b'){ 
                        console.log('Now White')
                        localStorage.setItem('turn', 'w');}
                     


                       
                        // console.log('Board changed despite being returned on error while moving the piece')
                    
                     
                    break;
                case GAME_OVER:
                    console.log("Game over", message.payload.winStatus,localStorage.getItem('color'))
                    setWinStatus(message.payload.winStatus==localStorage.getItem('color')?'Win':"Lost");
                    setIsOver(true)
                    
                    
                    break;        
            }
        }
    },[socket])

    if(!socket) return <div>Connecting...</div>
  return (
    <div className="min-h-screen  justify-center flex  bg-game relative">
        <div className="pt-8 max-w-screen">
            <div className="flex sm:flex-row flex-col gap-16 sm:gap-4 w-full">
                <div className=" w-full">
                    <ChessBoard setBoard={setBoard} chess={chess} board={board} socket={socket} moveAudio={moveAudio.current} isStarted={isgameStarted}/>
                </div>
                <div className="">
                    <Button onClick={()=>{
                     buttonAudio.current?.play();
                        socket.send(JSON.stringify({
                            type: INIT_GAME

                        }))}
                    }>Play</Button>
                    
                </div>

                

            </div>
        </div>
        {isOver && <WinnerModal winStatus={winStatus} onClose={handleCloseModal}/>}
    </div>
  )
}

export default Game