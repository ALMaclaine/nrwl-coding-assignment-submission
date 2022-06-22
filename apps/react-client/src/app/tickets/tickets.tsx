import styles from './tickets.module.css';
import {createTicket, getTickets, markTicketComplete, markTicketIncomplete} from "../../utils/controller";
import useSWR, {KeyedMutator, useSWRConfig} from 'swr'
import {useAbortManager} from "../../utils/useAbortManager";
import {Ticket} from "@acme/shared-models";
import {useNavigate, useOutletContext} from "react-router";
import {ChangeEventHandler, Dispatch, MouseEventHandler, SetStateAction, useCallback, useEffect, useState} from "react";
import {fetcher} from "../../utils/rest";
import Emoji from "../emoji/emoji";

interface CompleteProps {
    ticket: Ticket,
    mutate: KeyedMutator<any>,
}

const Complete = (props: CompleteProps) => {
    const {ticket, mutate} = props;
    const {completed, id} = ticket;
    const [loading, setLoading] = useState(false);
    const request = completed ? markTicketIncomplete : markTicketComplete;
    const abortManager = useAbortManager();

    const handler: MouseEventHandler<HTMLDivElement> = useCallback(async (e) => {
        e.stopPropagation();
        try {
            setLoading(true);
            const {req, abort: statusAbort} = request(id);
            abortManager.addAbort(statusAbort);
            const {status} = await req;
            if (status === 204) {
                await mutate(ticket);
            }
        } finally {
            setLoading(false)
        }
    }, [abortManager, completed, id, mutate, request]);

    const completedIcon = completed ? '✅' : '❌';
    const icon = loading ? '⌛' : completedIcon;

    const completedAria = completed ? 'complete' : 'incomplete';
    const aria = loading ? 'loading' : completedAria;

    return <Emoji emoji={icon} ariaLabel={aria} onClick={handler}/>;
}

interface AddTicketProps {
    setTickets: Dispatch<any>,
}

const AddTicket = (props: AddTicketProps) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const abortManager = useAbortManager();
    const {setTickets} = props;

    const descriptionHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        const {target: {value}} = e;
        setDescription(value);
    }

    const handler: MouseEventHandler<HTMLButtonElement> = useCallback(async (e) => {
        if (!description) {
            return;
        }
        e.stopPropagation();
        try {
                setLoading(true);
                const {req, abort} = createTicket(description);
                abortManager.addAbort(abort);
                const res = await req;
            if (res.ok) {
                const newTicket = await res.json();
                setTickets(newTicket);
            }
        } finally {
            setLoading(false);
        }
    }, [abortManager, description]);

    return (
        <div>
            <input value={description} placeholder='description' onChange={descriptionHandler}/>
            {loading ? <Emoji emoji='⌛' ariaLabel='waiting'/> : <button onClick={handler}>submit</button>}
        </div>
    )
}

export function Tickets() {
    const {req: ticketsReq, abort: abortTickets} = getTickets();
    const {data: tickets, mutate} = useSWR('/api/tickets', () => fetcher(ticketsReq), { revalidateOnMount: false, suspense: true});
    const mutateTickets = (t: Ticket) => {
        const {id} = t;
        const ticket = tickets.find((findTicket: Ticket) => findTicket.id === id);
        if (ticket) {
            ticket.completed = !ticket.completed;
        }
        return mutate([...tickets], false);
    }
    const setTickets = (t: Ticket) => mutate([...tickets, t], false);
    const [filterComplete, setFilterComplete] = useState(false);
    const [filterIncomplete, setFilterIncomplete] = useState(false);
    useAbortManager([abortTickets]);
    const setHeader: Dispatch<SetStateAction<string>> = useOutletContext();
    useEffect(() => {
        setHeader(`Tickets (${tickets.length})`);
    }, [setHeader, tickets.length]);
    const navigate = useNavigate();
    return (
        <div className={styles['tickets']}>
            <div className={styles['controls']}>
                <AddTicket setTickets={setTickets}/>
                <div>
                    <Emoji emoji='✅' ariaLabel='filter complete'
                           onClick={() => setFilterComplete(!filterComplete)}/>
                    <Emoji emoji='❌' ariaLabel='filter incomplete'
                           onClick={() => setFilterIncomplete(!filterIncomplete)}/>
                </div>
            </div>
            {tickets.length === 0 && <div className={styles['no-tickets']}>No Tickets</div>}
            {tickets.map((t: Ticket) => {
                if (t.completed && filterComplete) {
                    return undefined;
                }
                if (!t.completed && filterIncomplete) {
                    return undefined;
                }
                return (
                    <div onClick={() => navigate(`/${t.id}`)} key={t.id} className={styles['ticket-row']}>
                        <div>{t.id}. {t.description}</div>
                        <Complete mutate={mutateTickets} ticket={t}/>
                    </div>
                )
            })}
        </div>
    );
}

export default Tickets;
