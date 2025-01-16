import '../App.css'
import {useNavigate} from 'react-router-dom'
import chessBoard from '../assets/chessboard-29630_1920.png'
import Button from './Button';
const Landing = () => {
    const navigate = useNavigate();
  return (
    <div className='h-screen bg-land'>
        <div className='h-screen flex justify-around items-center'>
            <img className='w-5/12' src={chessBoard} alt="" />
            <div className='h-screen flex flex-col content-around items-center justify-center gap-y-56'>
                <div><h1 className='text-white text-3xl font-bold'>Play Chess on #1 Site!</h1></div>

                <div>
                    <div >
                    <Button onClick={()=>{navigate('/game')}}>Join Room</Button>
                    </div>
                </div>
            
            </div>

            
        </div>
    </div>
  )
}

export default Landing