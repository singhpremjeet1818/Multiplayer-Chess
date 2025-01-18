import { Square, PieceSymbol, Color, SQUARES } from "chess.js";
import { useEffect, useState, useRef } from "react";
import { GAME_OVER, MOVE } from "./Game";
import wrongMove from "../../src/assets/sound-effects/wrong.mp3";
import capture from "../../src/assets/sound-effects/Capture.mp3";
import check from "../../src/assets/sound-effects/check.mp3";
import borderC from '../../src/assets/Border.png'
import SelectPromotion from "./SelectPromotion";
let count = 0;
const ChessBoard = ({
  setBoard,
  chess,
  board,
  socket,
  moveAudio,
  isStarted,
}: {
  setBoard: any;
  chess: any;
  isStarted: boolean;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  moveAudio: any;
}) => {
  const [from, setFrom] = useState<String | null>(null);
  const [piece, setPiece] = useState<PieceSymbol>();
  const [color, setColor] = useState<Color>();
  const [highlightedSq, setHighlightedSq] = useState<Square[]>([]);
  const [capSq, setCapSq] = useState<any>([]);
  const [shake, setShake] = useState(false);
  const [trigger, setTrigger] = useState<Square | null>(null);
  const [turn, setTurn] = useState<string | null>();
  const [king, setKing] = useState<string | null>();
  const captureAudio = useRef<HTMLAudioElement | null>(null);
  const checkAudio = useRef<HTMLAudioElement | null>(null);
  const [dragOver, setDragover] = useState<string>('');
  const [isPausedW, setIsPausedW] = useState(true);
  const [isPausedB, setIsPausedB] = useState(true);
  const [playerW, setPlayerW] = useState({ minutes: 0, seconds: 10 });
  const [playerB, setPlayerB] = useState({ minutes: 0, seconds: 10 });
  const [target,setTarget] = useState<string>('')
  // const [startAudio, setStartAudio] = useState<HTMLAudioElement>();
  const invalidAudio = useRef<HTMLAudioElement | null>(null);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false)
  const [lastPromotedPiece, setLastPromotedPiece] = useState<string | null>(null)

  const handlePawnReachLastRank = () => {
    setIsPromotionOpen(true)
  }
  const promote = (sR)=>{
    chess.move({
      from,
      to: sR,
      promotion: lastPromotedPiece
    });
  }
  const handlePromotion = (piece: 'q' | 'r' | 'b' | 'n', sR:string) => {
    setLastPromotedPiece(piece)
    setIsPromotionOpen(false)
    try {
      chess.move({
        from,
        to: sR,
        promotion: piece || 'q'
      });
      if (capSq.includes(sR)) captureAudio.current?.play();
    } catch (error) {
      console.log("Invalid Move");
      return;
    }
    socket.send(
      JSON.stringify({
        type: MOVE,
        payload: {
          move: {
            from,
            to: sR,
            promotion: piece || 'q'
          },
          colour: color,
        },
      })
    );
    console.log(count);
    setBoard(chess.board());
    if (color === "w") {
      console.log("Now black");
      localStorage.setItem("turn", "b");
    }
    if (color === "b") {
      console.log("Now White");
      localStorage.setItem("turn", "w");
    }
    count++;
    setFrom(null);
    setCapSq([]);
    console.log({
      from,
      to: sR,
    });
    
  }
  const [colorPawn, setColorPawn] = useState('w')
  // console.log(SQUARES);
  // Trigger shake animation
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 1000); // Reset after animation
  };

  useEffect(() => {
    captureAudio.current = new Audio(capture);
    checkAudio.current = new Audio(check);
    invalidAudio.current = new Audio(wrongMove);
  }, []);

  useEffect(() => {
    if (isPausedW || playerW.minutes < 0) return;
    if (playerW.minutes === 0 && playerW.seconds === 0) {
      console.log("Game over");
      setPlayerW((prev) => ({
        minutes: prev.minutes - 1,
        seconds: prev.seconds,
      }));
      console.log("Black");
      socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: "b",
          },
        })
      );
      return; // Prevent further countdown
    }

    if (playerW.seconds === 0 && playerW.minutes > 0) {
      setPlayerW((prev) => ({
        minutes: prev.minutes - 1,
        seconds: prev.seconds,
      }));
      setPlayerW((prev) => ({ minutes: prev.minutes, seconds: 59 }));
      return;
    }

    const timer = setTimeout(() => {
      setPlayerW((prev) => ({
        minutes: prev.minutes,
        seconds: prev.seconds - 1,
      }));
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timeout on component unmount or before re-running the effect
  }, [playerW, turn, isPausedW]);
  useEffect(() => {
    if (isPausedB || playerB.minutes < 0) return;
    if (playerB.minutes === 0 && playerB.seconds === 0) {
      console.log("Game over");
      setPlayerB((prev) => ({
        minutes: prev.minutes - 1,
        seconds: prev.seconds,
      }));
      console.log("white");
      socket.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: "w",
          },
        })
      );
      return; // Prevent further countdown
    }

    if (playerB.seconds === 0 && playerB.minutes > 0) {
      setPlayerB((prev) => ({
        minutes: prev.minutes - 1,
        seconds: prev.seconds,
      }));
      setPlayerB((prev) => ({ minutes: prev.minutes, seconds: 59 }));
      return;
    }

    const timer = setTimeout(() => {
      setPlayerB((prev) => ({
        minutes: prev.minutes,
        seconds: prev.seconds - 1,
      }));
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timeout on component unmount or before re-running the effect
  }, [playerB, turn, isPausedB]);

  useEffect(() => {
    setTurn(localStorage.getItem("turn"));
    if (localStorage.getItem("turn") === "w" && isStarted === true) {
      setIsPausedW(false);
      setIsPausedB(true);
    } else if (localStorage.getItem("turn") === "b" && isStarted === true) {
      setIsPausedW(true);
      setIsPausedB(false);
    } else if (localStorage.getItem("turn") == null && isStarted === true) {
      setIsPausedW(true);
      setIsPausedB(false);
    }
  }, [localStorage.getItem("turn"), isStarted]);

  useEffect(() => {
    if (chess.inCheck()) {
      moveAudio.pause();
      moveAudio.currentTime = 0;
      checkAudio.current?.play();

      setKing(localStorage.getItem("turn"));
    } else setKing(null);
  }, [localStorage.getItem("turn")]);
  // const [to, setTo] = useState<String |null>(null);
  // console.log("Board ",board[0])
  // const ColorChanger=(sR: Square)=>{
  //     return chess.moves({square:from,verbose:false}).includes(sR)
  // }
  const isCapture = () => {
    let arr: Square[] = [];
    let cap: any = [];

    //@ts-ignore
    chess.moves({ square: from, verbose: true }).forEach((element) => {
      arr = [...arr, element.san];
    });
    arr.forEach((elem) => {
      if (elem[1] === "x") cap = [...cap, elem.split("x")[1]];
    });
    setCapSq(cap);
  };
  useEffect(() => {
    if (from === null) setHighlightedSq([]);
    else {
      console.clear();
      console.log(chess.moves({ square: from, verbose: true }));
      let arr: Square[] = [];
      //@ts-ignore
      chess.moves({ square: from, verbose: true }).forEach((element) => {
        arr = [...arr, element.to];
      });
      setHighlightedSq(arr);
      isCapture();
    }
  }, [from]);

  // const [colour, setColour] = useState<string | null>(null);
  // // setColour(localStorage.getItem('color'))
  // useEffect(()=>{
  //     setColour(localStorage.getItem('color'));
  //     console.log(colour)
  // },[])
  // // console.log("Reverse" , board.reverse().reverse());

  return (
    <div className="relative ">
      <div
        className={`${
          localStorage.getItem("color") === "w" ? "-bottom-12 right-0" : "-top-12 left-0"
        } absolute text-white py-2 rounded-md px-5 z-50 bg-[url('/src/assets/time.jpg')]  bg-top`}
      >
        {playerW.minutes >= 0
          ? playerW.minutes < 10
            ? `0${playerW.minutes}`
            : playerW.minutes
          : "00"}
          {" "}
        :
        {" "}
        {playerW.seconds >= 0
          ? playerW.seconds < 10
            ? `0${playerW.seconds}`
            : playerW.seconds
          : "00"}
      </div>
      <div
        className={`${
          localStorage.getItem("color") === "b" ? "-bottom-12 right-0" : "-top-12 left-0"
        } absolute py-2 rounded-md px-5 z-50 bg-[url('/src/assets/time.jpg')] text-white  bg-top`}
      >
        {playerB.minutes >= 0
          ? playerB.minutes < 10
            ? `0${playerB.minutes}`
            : playerB.minutes
          : "00"}
          {" "}
        :
        {" "}
        {playerB.seconds >= 0
          ? playerB.seconds < 10
            ? `0${playerB.seconds}`
            : playerB.seconds
          : "00"}
      </div>
      <div
        className={`${
          localStorage.getItem("color") === "w" ? "-bottom-12 left-4" : "-top-12 right-4"
        } absolute text-white py-2  px-5 z-50 border-b-2 border-white border-l-2  parallelogram ${localStorage.getItem('turn')==='w'?'opacity-100':'opacity-0 hidden'}`}
      >
        <div className="content text-nowrap">Move!</div>
      </div>
      <div
        className={`${
          localStorage.getItem("color") === "b" ? "-bottom-12 left-4" : "-top-12 right-4"
        } absolute py-2 px-5 z-50 text-white skew-z-12 border-b-2 border-white border-l-2 parallelogram ${localStorage.getItem('turn')==='b'?'opacity-100':'opacity-0 hidden'}`}
      >
        <div className="content text-nowrap">Move!</div>
       
      </div>

      <div
        className={`mt-10 text-white w-full relative z-0 flex ${
          localStorage.getItem("color") === "w"
            ? "flex-col"
            : "flex-col-reverse"
        } wooden-border`}
      >
        {board.map((row, i) => {
          return (
            <div
              key={8 - i}
              className={`flex rounded-[10px] ${
                localStorage.getItem("color") === "w" ? "" : "flex-row-reverse"
              }`}
            >
              {row.map((square, j) => {
                const sR = String(
                  String.fromCharCode(97 + (j % 8)) + (8 - Math.floor(i % 8))
                ) as Square;
                return (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragover(sR)
                    }}
                    onDrop={(e) => {
                      setDragover('')
                      console.log("sR", sR, "piece", piece, "color", color);
                      if(color==='w' && from[1]==='7' && sR[1]==='8' && piece==='p'){
                        setColorPawn('w');
                        setTarget(sR)
                        setIsPromotionOpen(true);
                        return;
                        
                      }
                      if(color==='b' && from[1]==='2' && sR[1]==='1' && piece==='p'){
                        setColorPawn('b');
                        setTarget(sR)
                        setIsPromotionOpen(true);
                        return;

                      }
                      // console.log(colour, color);
                      if (localStorage.getItem("color") !== color?.toString()) {
                        console.log(
                          typeof color,
                          typeof localStorage.getItem("color")
                        );
                        setHighlightedSq([]);
                        setCapSq([]);
                        invalidAudio.current?.play();
                        console.log("Wrong move detected");
                        return;
                      }
                      if (color.toString() !== localStorage.getItem("turn")) {
                        console.log(localStorage.getItem("turn"));
                        setHighlightedSq([]);
                        setCapSq([]);
                        invalidAudio.current?.play();
                        console.log("Not your turn");
                        return;
                      }
                      // if((count&1 && color!== 'b')|| !(count&1) && color!=='w'){
                      //     console.log(count);
                      //     console.log('Not your turn bitch..');
                      //     return;
                      // }
                      // console.log(chess.turn(), 'Yooooo');

                      // console.log(chess.in_check(), "Checking for check")
                      try {
                        chess.move({
                          from,
                          to: sR,
                          promotion: lastPromotedPiece
                        });
                        if (capSq.includes(sR)) captureAudio.current?.play();
                      } catch (error) {
                        console.log("Invalid Move");
                        return;
                      }
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            move: {
                              from,
                              to: sR,
                              promotion: 'q'
                            },
                            colour: color,
                          },
                        })
                      );
                      console.log(count);
                      setBoard(chess.board());
                      if (color === "w") {
                        console.log("Now black");
                        localStorage.setItem("turn", "b");
                      }
                      if (color === "b") {
                        console.log("Now White");
                        localStorage.setItem("turn", "w");
                      }
                      count++;
                      setFrom(null);
                      setCapSq([]);
                      console.log({
                        from,
                        to: sR,
                      });
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
                    }}
                    style={{
                      background: `${
                        king !== null &&
                        square?.type == "k" &&
                        square.color === king
                          ? "radial-gradient(circle, rgba(136,34,34,1) 8%, rgba(29,0,0,1) 100%)"
                          : capSq.includes(sR) === true
                          ? "radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 102, 102, 1) 50%, rgba(153, 0, 0, 1) 100%)"
                          : highlightedSq.includes(sR) === true
                          ? "radial-gradient(circle, rgba(255, 240, 230, 1) 0%, rgba(255, 167, 133, 1) 50%, rgba(255, 114, 88, 1) 100%)"
                          : ""
                      }`,
                      // border: `${
                      //   highlightedSq.includes(sR) === true
                      //     ? "3px inset #FF6F61"
                      //     : ""
                      // }`,
                      borderCollapse: "separate",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
                      
                    }}
                    key={8 - j}
                    className={`${
                      shake == true && trigger === sR && "blink"
                    } flex justify-center items-center w-[72px] h-[72px] opacity-85 ${
                      (i + j) % 2 == 0 ? "bg-[#f5deb3]" : "bg-[#004d40]"
                    } `}
                  >
                    {square ? (
                      <img
                        draggable
                        onDragStart={() => {
                          
                          console.clear();
                          console.log(square);
                          setTrigger(sR);
                          if (
                            localStorage.getItem("turn") === square.color &&
                            square.color === localStorage.getItem("color")
                          ) {
                            setPiece(square?.type);
                            setColor(square?.color);
                            setFrom(sR);
                          } else {
                            triggerShake();
                            // playMoveSound()
                            // console.clear()
                            // console.log(shake,square.type,piece, square.square,s)
                            // console.log(shake===true && square.type===piece && square.square ==sR)
                          }
                        }}
                        style={{
                          animation: `${
                            shake === true && trigger === sR
                              ? "jerkyShake 0.5s cubic-bezier(.36,.07,.19,.97) both"
                              : ""
                          }`,
                        }}
                        className={`z-20 w-14`}
                        src={`/${
                          square?.color === "b"
                            ? `b${square.type}`
                            : `w${square.type}`
                        }.png`}
                        alt={square.type}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <SelectPromotion
                    isOpen={isPromotionOpen}
                    onClose={() => setIsPromotionOpen(false)}
                    onPromote={handlePromotion}
                    sR={target}
                    color= {colorPawn}
                />
    </div>
  );
};

export default ChessBoard;
