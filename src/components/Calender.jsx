import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, addDays, isSameDay, isToday, isFuture, getMonth } from 'date-fns';

const Calendar = ({ events, setEvent, setEditingEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMoreEvents, setShowMoreEvents] = useState(null); // Track which date's events to show
  const [errorMessage, setErrorMessage] = useState(''); // Error message for invalid date/time

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  // Collect only dates that belong to the current month
  const daysInMonth = [];
  let date = startDate;

  while (date <= endDate) {
    daysInMonth.push(date);
    date = addDays(date, 1);
  }

  const handleDayClick = (date) => {
    // Check if the selected date is in the future
    if (!isFuture(date)) {
      setErrorMessage('You cannot add events to past dates.');
      // Clear the error message after 2 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }

    // Clear any previous error messages
    setErrorMessage('');
    setEvent(date);
  };

  const handleEventClick = (event, e) => {
    // Prevent the click from propagating to the day cell
    e.stopPropagation();
    setEditingEvent(event); // Open edit form for the clicked event
  };

  return (
    <div className="calendar-container bg-gradient-to-br from-indigo-50 to-blue-100 rounded-lg shadow-lg p-4 sm:p-6 relative">
      {/* Responsive Error Message Popup */}
      {errorMessage && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 sm:px-6 sm:py-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-md transition-opacity duration-500"
          role="alert"
        >
          <span className="block text-xs sm:text-sm md:text-base">{errorMessage}</span>
        </div>
      )}

      <div className="calendar-header flex justify-between items-center mb-4 sm:mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
          onClick={() => setCurrentDate(addDays(currentDate, -30))}
        >
          Prev
        </button>
        <span className="text-xl sm:text-2xl font-bold text-gray-800">{format(currentDate, 'MMMM yyyy')}</span>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
          onClick={() => setCurrentDate(addDays(currentDate, 30))}
        >
          Next
        </button>
      </div>

      {/* Responsive Calendar Grid */}
      <div className="calendar-grid grid grid-cols-7 gap-1 sm:gap-2 w-full max-w-full mx-auto">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="calendar-day day-header text-center font-semibold text-gray-900 text-xs sm:text-sm">
            {day}
          </div>
        ))}

        {/* Add empty placeholders for the first week's alignment */}
        {Array(startOfMonth(currentDate).getDay())
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day text-center"></div>
          ))}

        {daysInMonth.map((date, index) => {
          const dayEvents = events.filter((event) => isSameDay(new Date(event.date), date));

          return (
            <div
              key={index}
              className={`calendar-day text-center p-2 sm:p-3 rounded-lg cursor-pointer ${
                isToday(date)
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                  : 'hover:bg-blue-50 transition duration-300'
              }`}
              onClick={() => handleDayClick(date)}
            >
              <span className="day-number font-bold text-xs sm:text-base">{format(date, 'd')}</span>
              <div className="events mt-1 text-xs sm:text-sm space-y-1">
                {/* Show the first event as a button */}
                {dayEvents.length > 0 && (
                  <div
                    className="event truncate font-medium cursor-pointer bg-white text-gray-700 p-1 rounded-md shadow-sm hover:bg-gray-100 transition duration-300"
                    onClick={(e) => handleEventClick(dayEvents[0], e)}
                  >
                    {dayEvents[0].title}
                  </div>
                )}
                {/* Show the second event or "+X more" button */}
                {dayEvents.length === 2 && (
                  <div
                    className="event truncate font-medium cursor-pointer bg-white text-gray-700 p-1 rounded-md shadow-sm hover:bg-gray-100 transition duration-300"
                    onClick={(e) => handleEventClick(dayEvents[1], e)}
                  >
                    {dayEvents[1].title}
                  </div>
                )}
                {dayEvents.length > 2 && (
                  <div
                    className="more-events font-medium cursor-pointer bg-blue-100 text-blue-700 p-1 rounded-md shadow-sm hover:bg-blue-200 transition duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMoreEvents(dayEvents);
                    }}
                  >
                    +{dayEvents.length - 1} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for "+X more" events */}
      {showMoreEvents && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-4">
              Events for {format(showMoreEvents[0].date, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {showMoreEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="event truncate text-sm sm:text-base font-medium cursor-pointer p-2 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition duration-300"
                  onClick={() => {
                    setEditingEvent(event);
                    setShowMoreEvents(null);
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              onClick={() => setShowMoreEvents(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;