import { Button, Form, FormGroup, Label, Input, Row, Col, Alert, Progress } from 'reactstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSeatRequest, getRequests } from '../../../redux/seatsRedux';
import './OrderTicketForm.scss';
import SeatChooser from './../SeatChooser/SeatChooser';

const OrderTicketForm = () => {
  const dispatch = useDispatch();
  const requests = useSelector(getRequests);
  const [orderDay, setOrderDay] = useState(1);

  const [order, setOrder] = useState({
    name: '',
    email: '',
    day: orderDay,
    seat: ''
  });
  const [isError, setIsError] = useState(false);

  const updateSeat = (e, seatId) => {
    e.preventDefault();
    setOrder({ ...order, seat: seatId });
  }

  const updateTextField = ({ target }) => {
    const { value, name } = target;
    setOrder({ ...order, [name]: value });
  }

  const updateDayField = ({ target }) => {
    const { value, name } = target;
    setOrderDay(parseInt(value))
    setOrder({ ...order, [name]: parseInt(value) });
  }

  const submitForm = async (e) => {
    e.preventDefault();

    if(order.name && order.email && order.day && order.seat) {
      await dispatch(addSeatRequest(order));
      setOrder({
        name: '',
        email: '',
        day: orderDay,
        seat: '',
      });
      setIsError(false);
    } else {
      setIsError(true);
    }
  }

  return (
    <Form className="order-ticket-form" onSubmit={submitForm}>
      <Row>
        <Col xs="12" md="6">
          { (isError) && <Alert color="warning">There are some errors in your form. Have you filled all the fields correctly? Have you chosen your seat?</Alert> }
          { (requests['ADD_SEAT'] && requests['ADD_SEAT'].error && !isError) && <Alert color="danger">{requests['ADD_SEAT'].error}</Alert> }
          { (requests['ADD_SEAT'] && requests['ADD_SEAT'].success && !isError) && <Alert color="success">You've booked your ticket! Check you email in order to make a payment.</Alert> }
          { (requests['ADD_SEAT'] && requests['ADD_SEAT'].pending) && <Progress animated className="mb-5" color="primary" value={75} /> }
          <FormGroup>
            <Label for="clientEmail">Name</Label>
            <Input type="text" value={order.name} name="name" onChange={updateTextField} id="clientName" placeholder="John Doe" />
          </FormGroup>
          <FormGroup>
            <Label for="clientEmail">Email</Label>
            <Input type="email" value={order.email} name="email" onChange={updateTextField} id="clientEmail" placeholder="johndoe@example.com" />
          </FormGroup>
          <FormGroup>
            <Label for="clientDay">Select which day of festivals are you interested in:</Label>
            <Input type="select" value={order.day} name="day" onChange={updateDayField} id="exampleSelect">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </Input>
            <small id="dayHelp" className="form-text text-muted">Every day of the festival uses individual ticket. You can book only one ticket at the time.</small>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input required type="checkbox" /> I agree with <a href="/terms-and-conditions">Terms and conditions</a> and <a href="/privacy-policy">Privacy Policy</a>.
            </Label>
          </FormGroup>
          <Button color="primary" className="mt-3">Submit</Button>
        </Col>
        <Col xs="12" md="6">
          <SeatChooser 
            chosenDay={orderDay}
            chosenSeat={order.seat} 
            updateSeat={updateSeat} />
        </Col>
      </Row>
    </Form>
  )
}

export default OrderTicketForm;