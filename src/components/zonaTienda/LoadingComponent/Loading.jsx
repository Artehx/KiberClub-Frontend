import { useState, useEffect } from "react";
import { ClockLoader } from "react-spinners";
import utilsFunctions from "../../../assets/js/utilsFunctions";

function Loading({ loading }) {
    return (
        <div className="overflow-hidden flex items-center justify-center h-screen background-pattern" >
        {loading && (
        <div style={{ width: '280px', height: '280px', borderRadius: '50%', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ClockLoader
                color="#5bad5a"
                size={280}
                speedMultiplier={1.25}
            />
        </div>
        )}
        </div>
    );
}

export default Loading;