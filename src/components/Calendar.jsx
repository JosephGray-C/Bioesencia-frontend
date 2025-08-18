<<<<<<< HEAD
// src/components/Calendar.jsx
import { useState, useEffect } from "react";

export default function Calendar({ setSelectedDate, selectedDate, comp }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!selectedDate && setSelectedDate) setSelectedDate(new Date());
  }, [selectedDate, setSelectedDate]);

  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const handlePrev = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  const handleNext = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = firstDay; i > 0; i--) {
      days.push(<li key={`prev-${i}`} className="cal-inactive">{prevLastDate - i + 1}</li>);
    }

=======
import { useState, useEffect } from "react";

export default function Calendar({setSelectedDate, selectedDate, comp}) {
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
>>>>>>> 075d139 (FrontEnd completo responsive)
    for (let i = 1; i <= lastDate; i++) {
      const isToday =
        i === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      const isSelected =
        selectedDate?.getDate() === i &&
        selectedDate?.getMonth() === month &&
        selectedDate?.getFullYear() === year;

      const currentDate = new Date(year, month, i);
      let isPast = false;
      let isAfterMax = false;

      if (comp === "agendar") {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        isPast = currentDate < now;
<<<<<<< HEAD
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        maxDate.setDate(0);
        isAfterMax = currentDate > maxDate;
      }

=======

        // Limitar solo para agendar
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        maxDate.setDate(0); // Último día del tercer mes siguiente
        isAfterMax = currentDate > maxDate;
      }

      // Deshabilitar domingos
>>>>>>> 075d139 (FrontEnd completo responsive)
      const isWeekend = currentDate.getDay() === 0;

      days.push(
        <li
          key={`curr-${i}`}
<<<<<<< HEAD
          className={[
            "cal-day",
            isToday ? "cal-today" : "",
            isSelected ? "cal-selected" : "",
            isPast || isWeekend || isAfterMax ? "cal-disabled" : ""
          ].join(" ").trim()}
          onClick={
            isPast || isWeekend || isAfterMax
              ? undefined
              : () => setSelectedDate(new Date(year, month, i))
          }
          style={isPast || isWeekend || isAfterMax ? { pointerEvents: "none", opacity: 0.5, cursor: "not-allowed" } : {}}
=======
          className={`${isToday ? "active" : ""} ${isSelected ? "selected" : ""} ${(isPast || isWeekend || isAfterMax) ? "inactive" : ""}`}
          onClick={!(isPast || isWeekend || isAfterMax) ? () => setSelectedDate(new Date(year, month, i)) : undefined}
          style={(isPast || isWeekend || isAfterMax) ? { pointerEvents: "none", opacity: 0.5, cursor: "not-allowed" } : {}}
>>>>>>> 075d139 (FrontEnd completo responsive)
        >
          {i}
        </li>
      );
<<<<<<< HEAD
    }

    const lastDay = new Date(year, month + 1, 0).getDay();
    for (let i = lastDay; i < 6; i++) {
      days.push(<li key={`next-${i}`} className="cal-inactive">{i - lastDay + 1}</li>);
    }
    return days;
  };

  const modeClass = comp === "calendario" ? "cal--calendario" : "cal--agendar";

  return (
    <div className={`cal-card ${modeClass}`}>
      <style>{`
        :root{
          --ink:#1f2937;
          --muted:#6b7280;
          --line:#e5e7eb;
          --bg:#ffffff;
          --shadow:0 12px 28px rgba(0,0,0,.06);
          --blue:#2F80ED;
        }
        .cal-card{
          width:100%;
          background:var(--bg);
          border:1px solid var(--line);
          border-radius:18px;
          box-shadow:var(--shadow);
          padding:clamp(16px,2.8vw,24px);
        }
        .cal--agendar{ max-width:760px; }
        @media (min-width:1200px){ .cal--agendar{ max-width:920px; } }
        @media (min-width:1440px){ .cal--agendar{ max-width:1040px; } }
        @media (min-width:1680px){ .cal--agendar{ max-width:1160px; } }

        .cal--calendario{ max-width:430px; }
        @media (min-width:980px){ .cal--calendario{ max-width:480px; } }
        @media (min-width:1200px){ .cal--calendario{ max-width:520px; } }

        .cal-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:clamp(10px,2vw,16px); }
        .cal-title{ font-weight:800; color:var(--ink); font-size:clamp(18px,2.4vw,24px); letter-spacing:.2px; }
        .cal-nav{ display:flex; gap:clamp(6px,1.4vw,10px); }
        .cal-btn{
          width:clamp(34px,4vw,38px);
          height:clamp(34px,4vw,38px);
          display:grid; place-items:center;
          border:1px solid var(--line);
          border-radius:12px;
          background:#fff; color:var(--ink);
          cursor:pointer; user-select:none;
          transition:background .15s ease, transform .12s ease, box-shadow .12s ease;
        }
        .cal-btn:hover{ background:#f8fafc; transform:translateY(-1px); box-shadow:0 10px 22px rgba(0,0,0,.06); }

        .cal-grid{
          display:grid;
          grid-template-columns:repeat(7,1fr);
          column-gap:clamp(8px,1.6vw,14px);
          row-gap:clamp(8px,1.6vw,14px);
          list-style:none; padding:0; margin:0;
        }
        .cal-week{ color:var(--muted); font-weight:700; font-size:clamp(12px,1.6vw,14px); text-align:center; }

        .cal--agendar .cal-day, .cal--agendar .cal-inactive{
          display:grid; place-items:center;
          height:clamp(40px,6.5vw,52px);
          border-radius:14px; font-weight:700; color:var(--ink);
          background:#fff; border:1px solid transparent;
          transition:background .12s ease, color .12s ease, transform .12s ease, box-shadow .12s ease;
        }
        .cal--calendario .cal-day, .cal--calendario .cal-inactive{
          display:grid; place-items:center;
          height:clamp(36px,6vw,46px);
          border-radius:12px; font-weight:700; color:var(--ink);
          background:#fff; border:1px solid transparent;
          transition:background .12s ease, color .12s ease, transform .12s ease, box-shadow .12s ease;
        }

        .cal-day:hover{ background:#f6f7f9; transform:translateY(-1px); box-shadow:0 10px 20px rgba(0,0,0,.05); }
        .cal-today{ box-shadow:inset 0 0 0 2px var(--line); border-color:var(--line); }
        .cal-selected{ background:var(--blue); color:#fff; border-color:var(--blue); box-shadow:0 10px 22px rgba(47,128,237,.25); }
        .cal-disabled{ color:#aeb4bc; }
        .cal-row{ margin-bottom:clamp(12px,2.2vw,16px); }
      `}</style>

      <div className="cal-head">
        <p className="cal-title">
          {months[date.getMonth()]} {date.getFullYear()}
        </p>
        <div className="cal-nav">
          <span className="cal-btn" onClick={handlePrev}>❮</span>
          <span className="cal-btn" onClick={handleNext}>❯</span>
        </div>
      </div>

      <ul className="cal-grid cal-row">
        <li className="cal-week">D</li>
        <li className="cal-week">L</li>
        <li className="cal-week">K</li>
        <li className="cal-week">M</li>
        <li className="cal-week">J</li>
        <li className="cal-week">V</li>
        <li className="cal-week">S</li>
      </ul>

      <ul className="cal-grid">{renderCalendar()}</ul>
    </div>
  );
}
=======

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
>>>>>>> 075d139 (FrontEnd completo responsive)
