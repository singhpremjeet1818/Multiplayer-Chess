import {Square, PieceSymbol, Color, } from 'chess.js'
import { useEffect, useState } from 'react';
import { MOVE } from './Game';

let count = 0;
const ChessBoard = ({setBoard, chess, board, socket}:{
    setBoard: any,
    chess: any
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<String | null>(null);
    const [piece, setPiece] = useState<PieceSymbol>();
    const [color, setColor] = useState<Color>();
    // const [to, setTo] = useState<String |null>(null);
    console.log("Board ",board[0])
    console.log(chess)
    // const [colour, setColour] = useState<string | null>(null);
    // // setColour(localStorage.getItem('color'))
    // useEffect(()=>{
    //     setColour(localStorage.getItem('color'));
    //     console.log(colour)
    // },[])
    // // console.log("Reverse" , board.reverse().reverse());
    
    
  return (
    <div className="text-white w-full ">
        
        {
            board.map((row,i) =>{
                return <div key={8-i} className='flex'>
                    {row.map((square, j)=>{
                        const sR = String(String.fromCharCode(97+(j%8))+ (8 - Math.floor(i%8))) as Square;
                        return <div  onDragOver={(e)=>{e.preventDefault()}} onDrop={(e)=>{
                            console.log("sR", sR, "piece", piece, "color", color);
                                  
                            // console.log(colour, color);
                            if(localStorage.getItem('color')!== color?.toString()){
                                console.log(typeof(color), typeof(localStorage.getItem('color')))
                                console.log('Wrong move detected');
                                return;
                            }
                            if(color.toString() !== localStorage.getItem('turn')){
                                console.log(localStorage.getItem('turn'));
                                console.log('Not your turn');
                                return;
                            }
                            // if((count&1 && color!== 'b')|| !(count&1) && color!=='w'){
                            //     console.log(count);
                            //     console.log('Not your turn bitch..');
                            //     return;
                            // }
                            // console.log(chess.turn(), 'Yooooo');

                            console.log()
                            try{
                                chess.move({
                                    from,
                                    to: sR
                                })

                            }catch(error){
                                console.log('Invalid Move');
                                return
                            }
                            socket.send(JSON.stringify({
                                type: MOVE,
                                payload: {
                                    move: {

                                        from,
                                        to: sR
                                    },
                                    colour: color
                                }
                            }))
                            console.log(count)
                            setBoard (chess.board());
                            if(color=== 'w') {
                                console.log('Now black')
                                localStorage.setItem('turn', 'b');}
                             if(color=== 'b'){ 
                                console.log('Now White')
                                localStorage.setItem('turn', 'w');}
                            count++;
                            setFrom(null);
                            console.log({
                                from,
                                to: sR
                            })
                        // }} onClick={()=>{
                        //     // console.log(i," ", j);
                        //     // console.log(sR);
                        //     console.log("SQUARE", square);
                        //     if(!from){
                        //         setPiece(square?.type);
                        //         setColor(square?.color)
                        //         setFrom(sR);
                        //     }else{
                             

                        //             console.log("sR", sR, "piece", piece, "color", color);
                                  

                        //             socket.send(JSON.stringify({
                        //                 type: MOVE,
                        //                 payload: {
                        //                     move: {
    
                        //                         from,
                        //                         to: sR
                        //                     }
                        //                 }
                        //             }))
                        //             chess.move({
                        //                 from,
                        //                 to: sR
                        //             })
                        //             setBoard (chess.board());
                        //             setFrom(null);
                        //             console.log({
                        //                 from,
                        //                 to: sR
                        //             })
                        //         // }

                        //         // else{
                        //         //     setFrom(null);
                        //         //     setPiece(undefined);
                        //         //     setColor(undefined)
                        //         // }
                               
                        //     }
                           
                            
                            
                        }} key={8-j} className={`flex justify-center items-center w-20 h-20 ${(i+j)%2==0 ? 'bg-blue-500': 'bg-white'}`}>
                        
                            {square ? (<img draggable onDragStart={()=>{
                                setPiece(square?.type);
                                setColor(square?.color)
                                setFrom(sR);
                            }} className='z-20 w-14' src={`/${square?.color === 'b' ? `b${square.type}` : `w${square.type}`}.png`} alt={square.type}/>):("")}
                        </div>
                    })}
                </div>
            })
        }
    </div>
  )
}

export default ChessBoard