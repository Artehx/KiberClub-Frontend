import { ClipLoader } from 'react-spinners';

export function SpinnerTrack({sizeNumber}) {

    return <div className=''>
    <ClipLoader color={"green"} size={sizeNumber} margin={2} />
    </div>;
}

export default SpinnerTrack;