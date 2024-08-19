import { PacmanLoader } from 'react-spinners';

export function Spinner() {

    return <div className="flex justify-center items-center">
    <PacmanLoader color={"#ffffff"} size={12} margin={2} />
    </div>;
}

export default Spinner;