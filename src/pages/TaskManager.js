import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus } from "./services/taskService";
import "../styles.css";
import { BiTask, BiEdit, BiCalendar } from "react-icons/bi";
import { MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";



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
    <div className="container">

      <div className="destaque">
        <h1>Gerenciador de Tarefas</h1><BiTask size={48} />
      </div>

      <div className="add-item">
        <h2>Nova Tarefa</h2>
        <input
          className="input-titulo"
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value.toUpperCase())}
        />
        <input
          className="input-descricao"
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h3>Data e Hora (Opcional)</h3>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <button className="add-atualiza" onClick={handleAddTask}>
          Adicionar<MdAddCircleOutline size={20} />
        </button>
      </div>

      <div className="task-list">
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={task.status === "Concluída" ? "completed-task" : ""}>
              {editingTaskId === task.id ? (
                <>
                  <input
                    className="input-edt"
                    type="text"
                    placeholder="Título"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value.toUpperCase())}
                  />
                  <input
                    className="input-edt"
                    type="text"
                    placeholder="Descrição"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <div className="datetime-edit">
                    <p>Data atual: {task.dateTime ? formatDateTime(task.dateTime) : "Nenhuma data definida"}</p>
                    <input
                      className="input-edt"
                      type="datetime-local"
                      value={editDateTime}
                      onChange={(e) => setEditDateTime(e.target.value)}
                    />
                    {editDateTime && (
                      <button
                        className="limpar-data-btn"
                        onClick={() => setEditDateTime("")}
                      >
                        Limpar data
                      </button>
                    )}
                  </div>
                  <button onClick={() => handleUpdateTask(task.id)} className="editar-btn">Salvar</button>
                  <button onClick={() => setEditingTaskId(null)} className="excluir-btn">Cancelar</button>
                </>
              ) : (
                <>
                  <div className="tarefa">
                    <div className="concluido">{task.status}</div>
                    <div className="titulo"><strong>{task.title}</strong> </div>
                    <div className="descricao">{task.description}</div>
                    <div className="data-hora">{task.dateTime && <p><BiCalendar size={20} /> {formatDateTime(task.dateTime)}</p>}</div>
                  </div>
                  <div className="botoes-tarefa">
                    <button onClick={() => handleToggleStatus(task.id)} className={task.status === "Pendente" ? "completed-btn" : ""}>
                      {task.status === "Concluída" ? "Pendente" : "Concluída ✔"}
                    </button>
                    <button onClick={() => handleEditTask(task)} className="editar-btn">Editar <BiEdit size={20} /></button>
                    <button onClick={() => deleteTask(task.id).then(fetchTasks)} className="excluir-btn">Excluir <MdDeleteOutline size={20} /></button>
                  </div>
                </>
              )}

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
