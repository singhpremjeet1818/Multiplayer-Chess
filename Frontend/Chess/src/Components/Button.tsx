

const Button = ({onClick, children }:{onClick:()=>void, children: React.ReactNode}) => {
  return (
    <div onClick={(onClick)} className='border rounded-md p-3 pl-5 pr-5 border-white w-36 flex justify-center'>
        <button  className='text-white font-bold text-lg' >{children}</button>
        </div>
  )
}

export default Button