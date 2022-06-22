export interface FallbackProps {
    resetErrorBoundary: () => void,
    errorText: string,
}

export function Fallback(props: FallbackProps) {
    const {resetErrorBoundary, errorText} = props;
    return <div>
        <p>{errorText}</p>
        <button onClick={resetErrorBoundary}>Try Again?</button>
    </div>;
}

export default Fallback;
