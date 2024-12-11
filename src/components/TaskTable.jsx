import React, { useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

const TaskTable = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const tableRef = useRef();

  useEffect(() => {
    const getStatusBadge = (status) => {
      const statusStyles = {
        "To Do": "background: #f39c12; color: white;",
        "In Progress": "background: #3498db; color: white;",
        Done: "background: #2ecc71; color: white;",
      };
      return `
        <span 
          class="status-badge" 
          style="display: inline-block; width: 100px; text-align: center; padding: 5px 10px; border-radius: 5px; cursor: pointer; ${statusStyles[status]}"
        >
          ${status}
        </span>
      `;
    };

    const columns = [
      { title: "ID", field: "id", visible: false },
      { title: "Title", field: "title", editor: "input" },
      { title: "Description", field: "description", editor: "input" },
      {
        title: "Status",
        field: "status",
        formatter: (cell) => getStatusBadge(cell.getValue()),
        cellClick: (e, cell) => {
          const rowData = cell.getData();
          const nextStatus =
            rowData.status === "To Do"
              ? "In Progress"
              : rowData.status === "In Progress"
              ? "Done"
              : "To Do"; // Cycle through statuses
          const updatedData = { ...rowData, status: nextStatus };
          cell.getRow().update(updatedData); // Update the table row
          onUpdateTask(updatedData); // Trigger the onUpdateTask callback
        },
        maxWidth: 150,
        headerSort: false,
        align: "center",
      },
      {
        title: "Actions",
        formatter: () => `<button class="btn-delete">Delete</button>`,
        cellClick: (e, cell) => onDeleteTask(cell.getData().id),
        maxWidth: 100,
        headerSort: false,
        align: "center",
      },
    ];

    const table = new Tabulator(tableRef.current, {
      data: tasks,
      layout: "fitDataStretch",
      columns: columns,
    });

    return () => table.destroy(); // Clean up when component is unmounted
  }, [tasks, onUpdateTask, onDeleteTask]);

  // Calculate task counts by status
  const taskCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { "To Do": 0, "In Progress": 0, Done: 0 }
  );

  return (
    <div className="task-table-container">
      {/* Task Counters */}
      <div className="task-counters" >
        <div style={{ color: "#f39c12" }}>
          <strong>To Do:</strong> {taskCounts["To Do"]}
        </div>
        <div style={{ color: "#3498db" }}>
          <strong>In Progress:</strong> {taskCounts["In Progress"]}
        </div>
        <div style={{ color: "#2ecc71" }}>
          <strong>Done:</strong> {taskCounts["Done"]}
        </div>
      </div>

      {/* Table */}
      <div ref={tableRef}></div>
    </div>
  );
};

export default TaskTable;
