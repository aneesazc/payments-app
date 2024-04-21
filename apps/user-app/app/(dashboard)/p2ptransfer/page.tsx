import React from 'react'
import { SendMoneyCard } from '../../../components/SendMoneyCard'

const SendMoney = () => {
    return (
        <div className='flex justify-center items-center w-screen'>
            <div className='w-10/12 md:w-8/12 lg:w-1/2'>
                <SendMoneyCard />
            </div>
        </div>
    )
}

export default SendMoney