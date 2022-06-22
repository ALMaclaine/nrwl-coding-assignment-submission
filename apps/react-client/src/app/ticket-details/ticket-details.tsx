import styles from './ticket-details.module.css';
import {assignTicket, getTicket, getUsers, markTicketComplete, markTicketIncomplete} from "../../utils/controller";
import {useAbortManager} from "../../utils/useAbortManager";
import useSWR, {KeyedMutator, useSWRConfig} from "swr";
import {fetcher} from "../../utils/rest";
import {
    ChangeEventHandler,
    Dispatch,
    MouseEventHandler,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import {useOutletContext} from "react-router";
import Emoji from "../emoji/emoji";
import {Ticket, User} from "@acme/shared-models";

export interface CompleteProps {
    ticket: Ticket,
    mutate: KeyedMutator<any>,
}

export const Complete = (props: CompleteProps) => {
    const {ticket, mutate} = props;
    const {completed, id} = ticket;
    const [loading, setLoading] = useState(false);
    const request = completed ? markTicketIncomplete : markTicketComplete;
    const abortManager = useAbortManager();
    const {mutate: globalMutate} = useSWRConfig();

    const setHeader: Dispatch<SetStateAction<string>> = useOutletContext();
    const iconComplete = completed ? '✅' : '❌';
    useEffect(() => {
        setHeader(`Ticket ID: ${id} (${iconComplete})`);
    }, [iconComplete, setHeader, id]);

    const handler: MouseEventHandler<HTMLDivElement> = useCallback(async (e) => {
        e.stopPropagation();
        try {
            setLoading(true);
            const {req, abort: statusAbort} = request(id);
            abortManager.addAbort(statusAbort);
            const {status} = await req;
            if (status === 204) {
                ticket.completed = !completed;
                await mutate(ticket, false);
                await globalMutate('/api/tickets', (tickets: Ticket[]) => {
                    if(!tickets) {
                        return;
                    }
                    const foundTicket = tickets.find((t: Ticket) => t.id === id);
                    if(foundTicket) {
                        foundTicket.completed = !completed;
                    }
                    return tickets;
                });
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

export interface TicketDetailsViewProps {
    ticket: Ticket,
    loading: boolean,
    users: User[],
    assignee: number | null,
    assignHandler: ChangeEventHandler<HTMLSelectElement>,
    mutate: KeyedMutator<any>,
}

export function TicketDetailsView(props: TicketDetailsViewProps) {
    const {ticket, loading, users, assignee, assignHandler, mutate} = props;

    const userMap = useMemo(() => {
        const map = new Map();
        for (const {id: userId, name: userName} of users) {
            map.set(userId, userName);
        }
        return map;
    }, [users]);

    const options = Array.from(userMap.entries()).map(([id, name]) => {
        return <option data-testid='option' key={id} value={id}>{name}</option>;
    });

    return <div className={styles['ticket-details']}>
        <div data-testid='ticket-id'>Ticket ID: {ticket.id}</div>
        <div>Description: {ticket.description}</div>
        <div>Status: <Complete mutate={mutate} ticket={ticket}/></div>
        <div>Assignee:
            {!loading ? <select value={assignee || undefined} data-testid='ticket-dropdown' onChange={assignHandler}>
                <option value={undefined}></option>
                {options}
            </select> : '⌛'}
        </div>
    </div>
}

export interface TicketDetailsProps {
    id: number,
}

export function TicketDetails(props: TicketDetailsProps) {
    const {id} = props;
    const {req, abort} = getTicket(id);
    const {req: usersReq, abort: usersAbort} = getUsers();
    const abortManager = useAbortManager([abort, usersAbort]);
    const {data: ticket, mutate} = useSWR(`/api/tickets/${id}`, () => fetcher(req), {suspense: true});
    const {data: users} = useSWR('/api/users', () => fetcher(usersReq), {suspense: true});
    const [loading, setLoading] = useState(false);

    const handler: ChangeEventHandler<HTMLSelectElement> = useCallback(async (e) => {
        e.stopPropagation();
        const {target: {value}} = e;
        const assigneeId = Number(value);
        if (Number.isNaN(assigneeId) || assigneeId < 1) {
            return;
        }
        try {
            setLoading(true);
            const {req: assignTicketReq, abort: statusAbort} = assignTicket(id, assigneeId);
            abortManager.addAbort(statusAbort);
            const {status} = await assignTicketReq;
            if (status === 204) {
                ticket.assigneeId = assigneeId;
                await mutate(ticket, false);
            }
        } finally {
            setLoading(false)
        }
    }, [abortManager, id, mutate]);

    return (
        <TicketDetailsView mutate={mutate} ticket={ticket} loading={loading} users={users} assignee={ticket.assigneeId} assignHandler={handler}/>
    );
}

export default TicketDetails;
