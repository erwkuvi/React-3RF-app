import { useState, useRef, useCallback} from 'react';

const useUndoRedo = (initialState) => {
    const [state, setState] = useState(initialState);
    const history = useRef([JSON.parse(JSON.stringify(initialState))]);
    const historyIndex = useRef(0);

    const saveState = useCallback((newState) => {
        history.current = history.current.slice(0, historyIndex.current + 1);

        history.current.push(JSON.parse(JSON.stringify(newState)));
        historyIndex.current = history.current.length - 1;
        setState(newState);
    }, []);

    const undo = useCallback(() => {
        if (historyIndex.current > 0) {
            historyIndex.current--;
            setState(JSON.parse(JSON.stringify(history.current[historyIndex.current])));
        }
    }, []);

    const redo = useCallback(() => {
        if (historyIndex.current < history.current.length - 1) {
            historyIndex.current++;
            setState(JSON.parse(JSON.stringify(history.current[historyIndex.current])));
        }
    }, []);

    const reset = useCallback(() => {
        historyIndex.current = 0;
        setState(JSON.parse(JSON.stringify(history.current[0])));
    }, []);

    const canUndo = historyIndex.current > 0;
    const canRedo = historyIndex.current < history.current.length - 1;

    return {
        state,
        saveState,
        undo,
        redo,
        reset,
        canUndo,
        canRedo
    };
};

export default useUndoRedo;