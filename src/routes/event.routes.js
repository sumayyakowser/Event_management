const express = require('express');
const { authenticate, authorizeOrganizer } = require('../middleware/auth');
const { events } = require('../data/store');
const { sendEmail } = require('../utils/email');
const { v4: uuid } = require('uuid');

const router = express.Router();

// Create Event
router.post('/', authenticate, authorizeOrganizer, (req, res) => {
  const event = {
    id: uuid(),
    ...req.body,
    organizerId: req.user.id,
    participants: []
  };
  events.push(event);
  res.status(201).json(event);
});

// Get All Events
router.get('/', authenticate, (req, res) => {
  res.json(events);
});

// Update Event
router.put('/:id', authenticate, authorizeOrganizer, (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  Object.assign(event, req.body);
  res.json(event);
});

// Delete Event
router.delete('/:id', authenticate, authorizeOrganizer, (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Event not found' });

  events.splice(index, 1);
  res.json({ message: 'Event deleted' });
});

// Register for Event
router.post('/:id/register', authenticate, async (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.participants.includes(req.user.id)) {
    return res.status(400).json({ message: 'Already registered' });
  }

  event.participants.push(req.user.id);
  await sendEmail(req.user.id, event.title);

  res.json({ message: 'Registered successfully' });
});

module.exports = router;
