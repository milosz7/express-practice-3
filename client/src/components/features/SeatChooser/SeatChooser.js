import { useEffect, useState } from 'react';
import { Button, Progress, Alert } from 'reactstrap';
import './SeatChooser.scss';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../../../config';

export const socket = io(SOCKET_URL, { autoConnect: false });

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect();
    socket.on('connect', async () => {
      if (error) {
        setError(false);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('updateData', (seats) => {
      setSeats(seats);
    });

    socket.on('connect_error', () => {
      setError(true);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('updateData');
      socket.off('connect_error');
    };
  }, []);

  const isTaken = (seatId) => {
    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  const prepareSeat = (seatId) => {
    if (seatId === chosenSeat)
      return (
        <Button key={seatId} className="seats__seat" color="primary">
          {seatId}
        </Button>
      );
    else if (isTaken(seatId))
      return (
        <Button key={seatId} className="seats__seat" disabled color="secondary">
          {seatId}
        </Button>
      );
    else
      return (
        <Button
          key={seatId}
          color="primary"
          className="seats__seat"
          outline
          onClick={(e) => updateSeat(e, seatId)}
        >
          {seatId}
        </Button>
      );
  };

  return (
    <div>
      <h3>Pick a seat</h3>
      <small id="pickHelp" className="form-text text-muted ml-2">
        <Button color="secondary" /> – seat is already taken
      </small>

      <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4">
        <Button outline color="primary" /> – it's empty
      </small>
      {(isConnected && !error) &&
      <div className="seats">{[...Array(50)].map((x, i) => prepareSeat(i + 1))}</div>
      }
      {(!isConnected && !error) &&
      <Progress animated color="primary" value={50} />
      }
      {error &&
      <Alert color="warning">Couldn't load seats...</Alert>
      }
    </div>
  );
};

export default SeatChooser;
