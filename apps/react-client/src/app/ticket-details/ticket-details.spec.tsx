import {fireEvent, render} from '@testing-library/react';

import {TicketDetailsView} from './ticket-details';
import {Ticket, User} from "@acme/shared-models";
import * as rrd from 'react-router';
import Mock = jest.Mock;
import {screen} from '@testing-library/react';
jest.mock('react-router');

const ticket: Ticket = {
  assigneeId: 1,
  id: 1,
  description: 'Description',
  completed: false,
};
const user: User = {
  id: 1,
  name: 'Name',
};

const user2: User = {
  id: 2,
  name: 'Name',
};


describe('TicketDetails', () => {
  it('header should be set', () => {
    const testFn = jest.fn();
    (rrd.useOutletContext as Mock).mockReturnValue(testFn)
    render(<TicketDetailsView users={[user]} ticket={ticket} assignee={ticket.assigneeId} assignHandler={() => ({})} loading={false} />);
    const iconComplete = ticket.completed ? '✅' : '❌';
    expect(testFn).toBeCalledWith(`Ticket ID: ${ticket.id} (${iconComplete})`);
  });

  it('ticket-id should be set', () => {
    render(<TicketDetailsView users={[user]} ticket={ticket} assignee={ticket.assigneeId} assignHandler={() => ({})} loading={false} />);
    const element = screen.getByTestId('ticket-id');
    expect(element).toHaveTextContent(`Ticket ID: ${ticket.id}`);
  });

  it('changing dropdown calls handler', () => {
    const testFn = jest.fn();
    render(<TicketDetailsView users={[user, user2]} ticket={ticket} assignee={ticket.assigneeId} assignHandler={testFn} loading={false} />);
    const element = screen.getByTestId('ticket-dropdown');
    const options: HTMLOptionElement[] = screen.getAllByTestId('option')
    expect(options[0].selected).toBeTruthy();
    expect(options[1].selected).toBeFalsy();
    expect(testFn).not.toHaveBeenCalled();
    fireEvent.change(element, {})
    expect(testFn).toBeCalled();
  });
});
