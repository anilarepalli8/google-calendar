import React, { useState, useEffect } from 'react';
import { isFuture } from 'date-fns';

const EventForm = ({ selectedDate, saveEvent, cancelEdit, initialData }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTime(initialData.time);
    } else {
      setTitle('');
      setTime('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine the selected date and time into a single Date object
    const eventDateTime = new Date(`${selectedDate.toDateString()} ${time}`);
    if (!isFuture(eventDateTime)) {
      setErrorMessage('You cannot add events to past times.');
      return;
    }

    // Clear any previous error messages
    setErrorMessage('');

    if (title && time) {
      saveEvent({ title, time, date: selectedDate });
    }
  };

  return (
    <div className="event-form">
      <h3 className="text-xl font-bold text-center mb-4">
        {initialData ? 'Edit Event' : 'Add Event'} for {new Date(selectedDate).toDateString()}
      </h3>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block mb-2 font-semibold">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="buttons flex justify-between">
          <button
            type="submit"
            className="save-button bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            type="button"
            className="cancel-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;