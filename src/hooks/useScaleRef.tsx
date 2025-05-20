import { RefObject, useCallback, useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

function useScaleRef<T extends Element>(width: number, height: number): [number, RefObject<T | null>] {
    const target = useRef<T>(null);
    const [scale, setScale] = useState(1);

    const updateScale = useCallback((box: DOMRectReadOnly) => {
        const { width: widthLimit, height: heightLimit } = box;
        const vertScale = widthLimit / width;
        const horiScale = heightLimit / height;
        const newScale = Math.min(vertScale, horiScale, 1);
        setScale(newScale ?? 1);
    }, [height, width]);

    useLayoutEffect(() => {
        if (target.current)
            updateScale(target.current.getBoundingClientRect());
    }, [target, updateScale]);

    useResizeObserver(target, (entry) => { updateScale(entry.contentRect) });

    return [scale, target];
}

export default useScaleRef;