import {useEffect, useRef} from 'react';
import {Aborter} from "./rest";

const useAbortManager = (aborters: Aborter[] = []) => {
    const abortFunctions = useRef([...aborters]);

    useEffect(() => {
        const {current: toClear} = abortFunctions;
        return () => toClear.forEach((abort) => abort());
    }, []);

    return {
        addAbort: (aborter: Aborter) => (abortFunctions.current.push(aborter)),
    };
}

export {useAbortManager};
