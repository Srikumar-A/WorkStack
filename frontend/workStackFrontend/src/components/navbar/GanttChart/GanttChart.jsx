import React, { useMemo } from "react";
import "./GanttChart.css";

const DAY_WIDTH = 40; // px per day

const toDate = (d) => (d ? new Date(d) : null);
const daysBetween = (a, b) =>
  Math.ceil((b - a) / (1000 * 60 * 60 * 24));

export default function GanttChart({ tasks }) {
  const { startDate, endDate } = useMemo(() => {
    const dates = tasks
      .flatMap(t => [toDate(t.start), toDate(t.end)])
      .filter(Boolean);

    if (!dates.length) {
      const today = new Date();
      return { startDate: today, endDate: today };
    }

    return {
      startDate: new Date(Math.min(...dates)),
      endDate: new Date(Math.max(...dates))
    };
  }, [tasks]);

  const totalDays = Math.max(1, daysBetween(startDate, endDate));

  return (
    <div className="gantt-container">
      <div className="gantt-header">
        <div className="task-col">Task</div>
        <div className="timeline-col" style={{ width: totalDays * DAY_WIDTH }}>
          {[...Array(totalDays)].map((_, i) => (
            <div key={i} className="day-cell">
              {new Date(startDate.getTime() + i * 86400000).getDate()}
            </div>
          ))}
        </div>
      </div>

      {tasks.map(task => {
        const start = toDate(task.start) || startDate;
        const end =
          toDate(task.end) ||
          new Date(start.getTime() + 86400000);

        const offset = daysBetween(startDate, start) * DAY_WIDTH;
        const width =
          Math.max(1, daysBetween(start, end)) * DAY_WIDTH;

        return (
          <div key={task.id} className="gantt-row">
            <div className="task-col">{task.name}</div>

            <div className="timeline-col" style={{ width: totalDays * DAY_WIDTH }}>
              <div
                className={`task-bar ${task.status}`}
                style={{
                  left: offset,
                  width
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
