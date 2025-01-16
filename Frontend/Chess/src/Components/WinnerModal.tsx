

const WinnerModal = ({winStatus,onClose}: {winStatus:string,onClose: any}) => {
  return (
    // <div className='absolute w-full h-full z-[999999999999] bg-white text-6xl text-black'>
    //     You: {winStatus}
    // </div>
    <div className="modal-overlay">
    <div className="modal-content bg-black">
      <h1 className="modal-title">You {winStatus}!</h1>
      <p className="winner-message">{(winStatus===localStorage.getItem('color')&& winStatus==='w')?'White Wins':'Black Wins'}</p>
      <button className="close-button" onClick={onClose}>
        Play Again
      </button>
    </div>
  </div>
  )
}

export default WinnerModal