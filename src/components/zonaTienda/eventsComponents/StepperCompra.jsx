import { useState } from "react";
import { Stepper, Step, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faCreditCard } from "@fortawesome/free-solid-svg-icons";

function StepperCompra({ activeStep, onNextStep, onPrevStep }) {

  
    return (

        <div className="w-full pt-4 pb-2 px-8">
        <Stepper
          activeStep={activeStep}
        >
          <Step onClick={() => onPrevStep(0)}>
           <FontAwesomeIcon icon={faReceipt} className="h-5 w-5"/>
          </Step>
          <Step onClick={() => onNextStep(1)}>
          <FontAwesomeIcon icon={faCreditCard} className="h-5 w-5"/>
           </Step>
        </Stepper>
        
      </div>

    )


}

export default StepperCompra;