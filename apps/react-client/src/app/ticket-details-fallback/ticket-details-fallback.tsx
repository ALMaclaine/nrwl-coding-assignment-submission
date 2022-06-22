import {Fallback, FallbackProps} from '../fallback/fallback';

export function TicketDetailsFallback(props: FallbackProps) {
    const {resetErrorBoundary} = props;
    return <Fallback resetErrorBoundary={resetErrorBoundary} errorText='Error Loading Ticket Details'/>;
}

export default TicketDetailsFallback;
