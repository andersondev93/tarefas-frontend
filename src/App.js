import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus } from "./services/taskService";
import "./styles.css";
import { BiTask, BiEdit, BiCalendar } from "react-icons/bi";
import { MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskManager from './pages/TaskManager';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // Armazena o ID da tarefa sendo editada
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDateTime, setEditDateTime] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await getTasks();
    const sortedTasks = data.sort((a, b) => (a.status === "Pendente" ? -1 : 1));
    setTasks(sortedTasks);
  };

  const handleAddTask = async () => {
    if (!title.trim()) {
      alert("O título da tarefa é obrigatório!");
      return;
    }
    if (!description.trim()) {
      alert("A Descrição da tarefa é obrigatória!");
      return;
    }
    if (editingTaskId) {
      await updateTask(editingTaskId, title, description);
      setEditingTaskId(null);
    } else {
      await createTask({ title, description, dateTime: dateTime || null });
    }

    setTitle(""); // Reseta os campos
    setDescription("");
    setDateTime("");
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDateTime(task.dateTime || "");
    setEditingTaskId(task.id); // Define o ID da tarefa sendo editada
  };

  const handleUpdateTask = async (id) => {
    if (!editTitle.trim()) {
      alert("O título da tarefa é obrigatório!");
      return;
    }
    if (!editDescription.trim()) {
      alert("A descrição da tarefa é obrigatória!");
      return;
    }

    await updateTask(id, {
      title: editTitle,
      description: editDescription,
      dateTime: editDateTime || null
    });

    setEditingTaskId(null);
    fetchTasks();
  };

  const handleToggleStatus = async (id) => {
    await toggleTaskStatus(id);
    fetchTasks(); // Atualiza a lista de tarefas após a alteração
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TaskManager />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
