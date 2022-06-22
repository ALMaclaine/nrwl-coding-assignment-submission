import {DEFAULT_TIMEOUT} from "../config";
import {HTTP_METHODS, timeoutRequest} from "./rest";

// Ticket Controllers

const getTickets = () => {
    return timeoutRequest({
        url: '/api/tickets',
        method: HTTP_METHODS.GET,
    }, DEFAULT_TIMEOUT);
};

const getTicket = (id: number) => {
    return timeoutRequest({
        url: `/api/tickets/${id}`,
        method: HTTP_METHODS.GET,
    }, DEFAULT_TIMEOUT);
};

const assignTicket = (ticketId: number, userId: number) => {
    return timeoutRequest({
        url: `/api/tickets/${ticketId}/assign/${userId}`,
        method: HTTP_METHODS.PUT,
    }, DEFAULT_TIMEOUT);
}

const markTicketComplete = (ticketId: number) => {
    return timeoutRequest({
        url: `/api/tickets/${ticketId}/complete`,
        method: HTTP_METHODS.PUT,
    }, DEFAULT_TIMEOUT);
}

const markTicketIncomplete = (ticketId: number) => {
    return timeoutRequest({
        url: `/api/tickets/${ticketId}/complete`,
        method: 'DELETE',
    }, DEFAULT_TIMEOUT);
}

const createTicket = (description: string) => {
    return timeoutRequest({
        url: `/api/tickets`,
        method: 'POST',
        body: {description},
    }, DEFAULT_TIMEOUT);
}

// User Controllers

const getUsers = () => {
    return timeoutRequest({
        url: `/api/users`,
        method: HTTP_METHODS.GET,
    }, DEFAULT_TIMEOUT);
};

const getUser = (id: number) => {
    return timeoutRequest({
        url: `/api/users/${id}`,
        method: HTTP_METHODS.GET,
    }, DEFAULT_TIMEOUT);
};

export {getTickets, getTicket, getUsers, getUser, assignTicket, markTicketComplete, markTicketIncomplete, createTicket};
