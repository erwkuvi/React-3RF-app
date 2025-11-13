import { useState, useEffect } from 'react';
import {viewport} from "three/src/Three.TSL";

const useResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const checkResponsive = () => {
            const width = window.innerWidth;

            setIsMobile(width <= 768);
            setIsTablet(width <= 1024 && width > 768);
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        checkResponsive();
        window.addEventListener('resize', checkResponsive);
        return () => window.removeEventListener('resize', checkResponsive);
    }, []);

    return {
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        viewport
    };
};

export default useResponsive;