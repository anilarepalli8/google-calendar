import React, { useState } from 'react';
import Calendar from './components/Calender.jsx';
import EventForm from './components/EventForm.jsx';
import eventsData from './data/events.json';

const App = () => {
  const [events, setEvents] = useState(eventsData);
  const [selectedDate, setSelectedDate] = useState(null); // For adding new events
  const [editingEvent, setEditingEvent] = useState(null); // For editing existing events

  const saveEvent = (newEvent) => {
    if (editingEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEvent.id ? { ...event, ...newEvent } : event
        )
      );
    } else {
      // Add new event
      setEvents([...events, { ...newEvent, id: Date.now() }]);
    }
    setSelectedDate(null);
    setEditingEvent(null);
  };

  const cancelEdit = () => {
    setSelectedDate(null);
    setEditingEvent(null);
  };

  return (
    <div className="app-container">
      <h1 className="text-3xl font-bold text-center mb-4">Google Calendar</h1>
      <div className="calendar-and-form w-full max-w-2xl mx-auto">
        <Calendar
          events={events}
          setEvent={setSelectedDate}
          setEditingEvent={setEditingEvent}
        />
        {(selectedDate || editingEvent) && (
          <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <EventForm
                selectedDate={selectedDate || editingEvent?.date}
                saveEvent={saveEvent}
                cancelEdit={cancelEdit}
                initialData={editingEvent}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;