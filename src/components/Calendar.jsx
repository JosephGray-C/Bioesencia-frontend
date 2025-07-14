import { useState, useEffect } from "react";

export default function Calendar({setSelectedDate, selectedDate}) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!selectedDate && setSelectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate, setSelectedDate]);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"
  ];

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const days = [];

    // Prev Month Days
    for (let i = firstDay; i > 0; i--) {
      days.push(<li key={`prev-${i}`} className="inactive">{prevLastDate - i + 1}</li>);
    }

    // Current Month Days
    for (let i = 1; i <= lastDate; i++) {
      const isToday =
        i === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      const isSelected =
        selectedDate?.getDate() === i &&
        selectedDate?.getMonth() === month &&
        selectedDate?.getFullYear() === year;

      days.push(
        <li
          key={`curr-${i}`}
          className={`${isToday ? "active" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => setSelectedDate(new Date(year, month, i))}
        >
          {i}
        </li>
      );

    }

    // Next Month Days
    const lastDay = new Date(year, month + 1, 0).getDay();

    for (let i = lastDay; i < 6; i++) {
      days.push(<li key={`next-${i}`} className="inactive">{i - lastDay + 1}</li>);
    }

    return days;
  };

  // Previous Button
  const handlePrev = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  // Next Button
  const handleNext = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <>
      <div className="wrapper">

        <header>
          {/* Month */}
          <p className="current-date">
            {months[date.getMonth()]} {date.getFullYear()}
          </p>

          {/* Next and Previous */}
          <div className="icons">
            <span id="prev" onClick={handlePrev}>❮</span>
            <span id="next" onClick={handleNext}>❯</span>
          </div>
        </header>

        <div className="calendar">

          <ul className="weeks">
            <li>D</li>
            <li>L</li>
            <li>K</li>
            <li>M</li>
            <li>J</li>
            <li>V</li>
            <li>S</li>
          </ul>

          <ul className="days">
            {renderCalendar()}
          </ul>

        </div>

      </div>
    </>
  );
}

