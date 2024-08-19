import { BarLoader } from 'react-spinners';

export function SpinnerPayment() {

    return (
    <div className='m-2.5'>
     <BarLoader color={"white"} size={25} speedMultiplier={1.4} />
    </div>
    )
}

export default SpinnerPayment;