import React, { useState, useEffect } from 'react';

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Review 3D DNA Helix animation in AnimeJS',
    category: 'Creative',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: true,
    createdAt: Date.now() - 3600000
  },
  {
    id: 2,
    title: 'Integrate scientific functions in NeoCalc calculator',
    category: 'Work',
    priority: 'high',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    completed: true,
    createdAt: Date.now() - 7200000
  },
  {
    id: 3,
    title: 'Design responsive 3D card depth transitions',
    category: 'Creative',
    priority: 'medium',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 10800000
  },
  {
    id: 4,
    title: 'Refactor state management and local storage syncing',
    category: 'Study',
    priority: 'medium',
    dueDate: '',
    completed: false,
    createdAt: Date.now() - 14400000
  },
  {
    id: 5,
    title: 'Daily 30-minute cardio and hydration check',
    category: 'Fitness',
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 18000000
  }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [inputTitle, setInputTitle] = useState('');
  const [inputCategory, setInputCategory] = useState('Work');
  const [inputPriority, setInputPriority] = useState('medium');
  const [inputDueDate, setInputDueDate] = useState('');

  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'completed'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Save tasks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // Add Task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: inputTitle.trim(),
      category: inputCategory,
      priority: inputPriority,
      dueDate: inputDueDate,
      completed: false,
      createdAt: Date.now()
    };

    setTasks(prev => [newTask, ...prev]);
    setInputTitle('');
    setInputDueDate('');
  };

  // Toggle Completion
  const toggleComplete = (id) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Start inline editing
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  // Save inline edit
  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, title: editingText.trim() } : t))
    );
    setEditingId(null);
  };

  // Bulk Actions
  const handleMarkAllDone = () => {
    setTasks(prev => prev.map(t => ({ ...t, completed: true })));
  };

  const handleClearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  // Calculations & Statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;
  const percentDone = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter(
    t => !t.completed && t.dueDate && t.dueDate < todayStr
  ).length;

  // Filter and Search logic
  const filteredTasks = tasks.filter(task => {
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && !task.completed) ||
      (filterStatus === 'completed' && task.completed);

    const matchesCategory =
      filterCategory === 'all' || task.category === filterCategory;

    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const categories = ['Work', 'Personal', 'Study', 'Fitness', 'Creative'];

  return (
    <div className="todo-app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <span className="brand-badge">Productivity Suite</span>
          <h1 className="brand-title">TaskFlow Pro</h1>
        </div>
        <div className="header-meta-date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </header>

      {/* Statistics & Progress Card */}
      <section className="stats-card">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{totalCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">In Progress</span>
            <span className="stat-value active">{activeCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value completed">{completedCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Overdue</span>
            <span className="stat-value high">{overdueCount}</span>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-header">
            <span>Progress Velocity</span>
            <strong>{percentDone}% Completed</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${percentDone}%` }}
            />
          </div>
        </div>
      </section>

      {/* Add Task Card Form */}
      <form className="add-task-card" onSubmit={handleAddTask}>
        <div className="input-primary-row">
          <input
            type="text"
            className="task-main-input"
            placeholder="What needs to be accomplished today?..."
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <button type="submit" className="add-btn">
            <span>+</span> Add Task
          </button>
        </div>

        <div className="input-secondary-row">
          <select
            className="custom-select"
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="custom-select"
            value={inputPriority}
            onChange={(e) => setInputPriority(e.target.value)}
          >
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          <input
            type="date"
            className="date-input"
            value={inputDueDate}
            onChange={(e) => setInputDueDate(e.target.value)}
            title="Due Date"
          />
        </div>
      </form>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-pills">
          <button
            className={`filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({totalCount})
          </button>
          <button
            className={`filter-pill ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={`filter-pill ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            className="custom-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <div className="empty-title">No tasks found</div>
            <p className="empty-desc">
              {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'All caught up! Add a new task above to get started.'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isEditing = editingId === task.id;
            const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;

            return (
              <div
                key={task.id}
                className={`task-card ${task.completed ? 'completed' : ''}`}
              >
                {/* Custom Checkbox */}
                <div
                  className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleComplete(task.id)}
                  title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed && <span className="check-mark">✓</span>}
                </div>

                {/* Content */}
                <div className="task-content">
                  {isEditing ? (
                    <input
                      type="text"
                      className="task-main-input"
                      style={{ padding: '6px 10px', fontSize: '0.95rem' }}
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="task-title"
                      onDoubleClick={() => startEdit(task)}
                      title="Double-click to edit"
                    >
                      {task.title}
                    </span>
                  )}

                  <div className="task-meta">
                    <span className="badge badge-category">{task.category}</span>
                    <span className={`badge badge-priority-${task.priority}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    {task.dueDate && (
                      <span
                        className="badge-date"
                        style={{ color: isOverdue ? '#f43f5e' : undefined, fontWeight: isOverdue ? 600 : 400 }}
                      >
                        📅 {task.dueDate} {isOverdue && '(Overdue)'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="task-actions">
                  {isEditing ? (
                    <button
                      className="icon-btn"
                      onClick={() => saveEdit(task.id)}
                      title="Save"
                    >
                      💾
                    </button>
                  ) : (
                    <button
                      className="icon-btn"
                      onClick={() => startEdit(task)}
                      title="Edit task"
                    >
                      ✏️
                    </button>
                  )}

                  <button
                    className="icon-btn delete"
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Bulk Actions */}
      {totalCount > 0 && (
        <footer className="bulk-footer">
          <span>{activeCount} items left to complete</span>
          <div className="bulk-actions-group">
            <button className="text-btn accent" onClick={handleMarkAllDone}>
              Mark all complete
            </button>
            {completedCount > 0 && (
              <button className="text-btn" onClick={handleClearCompleted}>
                Clear completed ({completedCount})
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
