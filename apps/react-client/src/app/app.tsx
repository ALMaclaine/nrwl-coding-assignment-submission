import {Routes, Route} from 'react-router-dom';
import TicketsRoute from "./tickets-route/tickets-route";
import TicketDetailsRoute from "./ticket-details-route/ticket-details-route";
import AppRoute from "./app-route/app-route";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<AppRoute/>}>
                <Route path="/" element={<TicketsRoute/>}/>
                {/* Hint: Try `npx nx g component TicketDetails --no-export` to generate this component  */}
                <Route path="/:id" element={<TicketDetailsRoute/>}/>
            </Route>
        </Routes>
    );
};

export default App;
