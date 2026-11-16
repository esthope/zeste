import {ReactElement} from "react";
import inversionArrows from 'assets/inverse.svg';

const InverseLabel = ():ReactElement => {
    return (
      <div id="inversionLabel" className="flex-center">
        <span>A</span>
        <img src={inversionArrows} alt="" />
        <span>a</span>
      </div>
    )
}

export default InverseLabel;