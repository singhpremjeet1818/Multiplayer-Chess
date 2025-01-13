import { useEffect, useState } from "react";

const WS_URL = 'ws://192.168.162.96:8080';

export const useSocket = () => {
    const [socket,setSocket] = useState< WebSocket |null>(null);

    useEffect(()=>{
        const ws = new WebSocket(WS_URL);
        ws.onopen = () =>{
            console.log("connected");
            setSocket(ws);
        }

        ws.onclose=()=>{
            console.log("disconnected");
            setSocket(null);
        }

        return ()=>{
            ws.close();
        }
    },[])

    return socket
}

