import Loader from "../loader/loader";
import TicketsFallback from "../tickets-fallback/tickets-fallback";
import Tickets from "../tickets/tickets";

export function TicketsRoute() {
    // eslint-disable-next-line no-restricted-globals
    return <Loader onReset={() => location.reload()}
                   fallback={TicketsFallback as never}>
        <Tickets/>
    </Loader>;
}

export default TicketsRoute;
