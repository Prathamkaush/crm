import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { FaPlus, FaTasks } from "react-icons/fa";
import api from "../api/axios";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModel.jsx";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("table"); // table | board
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Kanban grouping
  const groups = useMemo(() => {
    return {
      pending: tasks.filter(t => t.status === "pending"),
      progress: tasks.filter(t => t.status === "progress"),
      completed: tasks.filter(t => t.status === "completed"),
    };
  }, [tasks]);

  return (
    <DashboardLayout>
      <AddTaskModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={async (data) => {
          await api.post("/tasks", data);
          fetchTasks();
        }}
      />

      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={async (data) => {
            await api.put(`/tasks/${editTask.id}`, data);
            fetchTasks();
          }}
        />
      )}

      <div className="space-y-8 animate-fadeIn">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-purple-300">
              Tasks
            </h2>
            <div className="text-sm text-gray-400 mt-1">
              Manage and track your upcoming work
            </div>
          </div>

          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 rounded text-white flex items-center gap-2 hover:scale-105 transition"
          >
            <FaPlus /> New Task
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 border-b border-gray-700 pb-2">
          <button
            onClick={() => setView("table")}
            className={`px-3 pb-2 ${
              view === "table"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400"
            }`}
          >
            Table View
          </button>

          <button
            onClick={() => setView("board")}
            className={`px-3 pb-2 ${
              view === "board"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400"
            }`}
          >
            Kanban Board
          </button>
        </div>

        {/* TABLE VIEW */}
        {view === "table" && (
          <div className="bg-[#0d1117] p-6 rounded-xl border border-gray-800">
            <table className="w-full text-left text-gray-200">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="py-2">Task</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {tasks.map(task => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition"
                  >
                    <td className="py-3">{task.title}</td>

                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          task.status === "pending"
                            ? "bg-yellow-600/30 text-yellow-300"
                            : task.status === "progress"
                            ? "bg-blue-600/30 text-blue-300"
                            : "bg-green-600/30 text-green-300"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>

                    <td className="text-right">
                      <button
                        onClick={() => setEditTask(task)}
                        className="text-blue-400 mr-3"
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {
                          await api.delete(`/tasks/${task.id}`);
                          fetchTasks();
                        }}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {tasks.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* KANBAN BOARD */}
        {/* DRAG & DROP KANBAN */}
{view === "board" && (
  <DragDropContext
    onDragEnd={async (result) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;

      // If dropped in same location
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      // Update task status in backend
      await api.put(`/tasks/${draggableId}`, {
        status: destination.droppableId
      });

      fetchTasks();
    }}
  >
    <div className="grid grid-cols-3 gap-6">
      {[
        { id: "pending", title: "Pending" },
        { id: "progress", title: "In Progress" },
        { id: "completed", title: "Completed" },
      ].map((col) => (
        <Droppable droppableId={col.id} key={col.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`bg-[#0d1117] rounded-xl p-4 border border-gray-800 min-h-[400px] transition
                ${snapshot.isDraggingOver ? "bg-gray-800/40" : ""}`}
            >
              <h3 className="text-xl font-semibold text-purple-300 mb-4 capitalize">
                {col.title}
              </h3>

              {groups[col.id].map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={String(task.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => setEditTask(task)}
                      className={`p-4 bg-gray-900 rounded-lg border border-gray-700 mb-3 
                        cursor-pointer transition shadow-md
                        ${
                          snapshot.isDragging
                            ? "scale-[1.05] ring-2 ring-purple-500 shadow-lg"
                            : "hover:bg-gray-800"
                        }`}
                    >
                      <div className="font-semibold text-gray-100">
                        {task.title}
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No date"}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}

              {groups[col.id].length === 0 && (
                <div className="text-gray-500 text-sm py-6 text-center">
                  No tasks
                </div>
              )}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  </DragDropContext>
)}

      </div>
    </DashboardLayout>
  );
}
