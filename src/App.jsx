import React, { useState, useEffect } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskTable from "./components/TaskTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        const initialTasks = data.slice(0, 20).map((item) => ({
          id: item.id,
          title: item.title,
          description: "No description",
          status: item.completed ? "Done" : "To Do",
        }));
        setTasks(initialTasks);
      });
  }, []);

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    toast.success("Task added successfully!");
  };

  const onUpdateTask = (updatedTask) => {
    // Update the task in your state or database
    // For example, if you're using state to store tasks:
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };
  
  

  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast.success("Task updated successfully!");
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast.error("Task deleted!");
  };

  return (
    <div className="App p-4">
      <h1 className="text-2xl font-bold mb-4">Task List Manager</h1>
      <AddTaskForm onAddTask={handleAddTask} />
      <TaskTable
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
      <ToastContainer />
    </div>
  );
};

export default App;
