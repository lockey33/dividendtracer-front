import React, {useState, useEffect, useCallback} from "react";

export const useOutsideAlerter = (ref) => {
    
    const [clicked, setClicked] = useState(false);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setClicked(true);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            setClicked(false);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

    return clicked;
};