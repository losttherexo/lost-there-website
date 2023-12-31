import {useState} from 'react'
import Newsletter from './Newsletter';

const MainPage = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleNewsletter = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
                <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6 text-white'>How Did I Get Here?</h1>
                <button onClick={handleNewsletter} className='font-bold border border-lime-500 text-lime-500 w-[150px] rounded-md my-6 mx-auto shadow-md hover:text-black hover:bg-lime-500'>Sign Up</button>
                <div className={isOpen ? 'fixed self-center max-w-[75%] bg-black border-lime-500 border p-4 rounded' : 'hidden'}>
                    <Newsletter isOpen={isOpen} handleNewsletter={handleNewsletter} />
                </div>
            </div>
        </div>
    )
}

export default MainPage