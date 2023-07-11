import { useState } from "react"

const Newsletter = ({isOpen, handleNewsletter}) => {
    const [email, setEmail] = useState('')
    const [consent, setConsent] = useState(false)

    const handleChange = (e) => {
        setEmail(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        handleNewsletter()
        console.log(email)
    }

    if(!isOpen) {
        return null
    }

    return (
        <div className='fixed self-center max-w-[75%] bg-white p-4 rounded'>
            <form onSubmit={handleSubmit} className='flex flex-col'>
                <button onClick={() => handleNewsletter()} className='absolute top-0 right-0 mr-2'>x</button>
                <label htmlFor='email' className='font-medium'>Email</label>
                <input placeholder='Type your email' name='email' onChange={handleChange} className='my-2 border rounded-sm' />
                <p className='font-medium'>I consent to being contacted by email</p>
                <div className=''>
                    <input onClick={() => setConsent(!consent)} type='checkbox' name='consent' />
                    <label htmlFor='consent' className='px-2'>Yes</label>
                </div>
                <button type='submit' className='bg-lime-500 rounded-md my-2 max-w-[25%] px-2 self-center'>Submit</button>
            </form>
        </div>
    )
}

export default Newsletter