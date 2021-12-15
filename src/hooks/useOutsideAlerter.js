import React, {useState, useEffect, useRef, forwardRef} from "react";

export const useOutsideAlerter = (ref) => {
    
    const [clicked, setClicked] = useState(false);

    const handleClickOutside = (event) => {    
        if (ref.current && !ref.current.contains(event.target)) {
            setClicked(true);
        }else{
            setClicked(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {            
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return {clicked}
};