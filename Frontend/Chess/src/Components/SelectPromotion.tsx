
import Qb from '../Blacks/q.png'
import Rb from '../Blacks/r.png'
import Bb from '../Blacks/b.png'
import Kb from '../Blacks/n.png'
import Qw from '../Whites/wq.png'
import Rw from '../Whites/wr.png'
import Bw from '../Whites/wb.png'
import Kw from '../Whites/wn.png'
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
interface PromotionPopupProps {
    isOpen: boolean
    onClose: () => void
    onPromote: (piece: 'q' | 'r' | 'b' | 'n',sR:string) => void
    color: string
    sR: string
  }
  

const SelectPromotion = ({ isOpen, onClose, onPromote, color,sR }: PromotionPopupProps) => {
    const pieces = [
        { type: 'q', img: Qb, label: 'Queen' },
        { type: 'r', img: Rb, label: 'Rook' },
        { type: 'b', img: Bb, label: 'Bishop' },
        { type: 'n', img: Kb, label: 'Knight' },
        { type: 'q', img: Qw, label: 'Queen' },
        { type: 'r', img: Rw, label: 'Rook' },
        { type: 'b', img: Bw, label: 'Bishop' },
        { type: 'n', img: Kw, label: 'Knight' },
      ] as const
      
  return (
    <Dialog open={isOpen} onOpenChange={(open) => open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-center">Choose Promotion</DialogTitle>
        <div className="grid grid-cols-2 gap-4 py-4">
          {(color==='b'?(pieces.slice(0,4)):(pieces.slice(4,8))).map((piece) => (
            <Button
              key={piece.type}
              onClick={() => onPromote(piece.type,sR)}
              className="h-24 flex flex-col items-center justify-center"
              variant="outline"
            >
              
              <img src={piece.img} className='h-12 w-12 mb-2' alt="" />
              <span>{piece.label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
    
  )
}

export default SelectPromotion