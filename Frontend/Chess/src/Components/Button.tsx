

const Button = ({onClick, children }:{onClick:()=>void, children: React.ReactNode}) => {
  return (
    <div className='border rounded-md p-3 pl-5 pr-5 border-white bg-sky-600 hover:bg-sky-700 max-w-36 flex justify-center'>
        <button onClick={(onClick)} className='text-white font-bold text-lg' >{children}</button>
        </div>
  )
}

export default Button