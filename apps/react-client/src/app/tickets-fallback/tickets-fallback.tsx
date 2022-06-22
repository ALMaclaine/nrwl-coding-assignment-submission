import {Fallback, FallbackProps} from '../fallback/fallback';

export function TicketsFallback(props: FallbackProps) {
    const {resetErrorBoundary} = props;
    return <Fallback resetErrorBoundary={resetErrorBoundary} errorText='Error Loading Tickets'/>;
}

export default TicketsFallback;
