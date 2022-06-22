import {useParams} from "react-router";
import Loader from "../loader/loader";
import TicketDetailsFallback from "../ticket-details-fallback/ticket-details-fallback";
import TicketDetails from "../ticket-details/ticket-details";

export function TicketDetailsRoute() {
    const {id} = useParams();
    // eslint-disable-next-line no-restricted-globals
    return <Loader onReset={() => location.reload()}
                   fallback={TicketDetailsFallback as never}>
        <TicketDetails id={Number(id)}/>
    </Loader>;
}

export default TicketDetailsRoute;
