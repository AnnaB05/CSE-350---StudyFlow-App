import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5000/api/auth';

export default function App() {
  //layout view switching state matrices
  const [currentView, setCurrentView] = useState('VIEW_LOGIN'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  //form input elements states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  //focus timer operational states (FR3)
  const [customMinutes, setCustomMinutes] = useState('25');
  const [secondsLeft, setSecondsLeft] = useState(1500); // Default: 25 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState('Focus'); 

  //task planner checklist states (FR4)
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  //simulated strict focus mode protection toggles (FR5)
  const [strictMode, setStrictMode] = useState(false);
  const [strictWarning, setStrictWarning] = useState(false);

  // ===================================
  // TIMING INTERVAL EFFECTS LOOP (FR3)
  // ===================================
  useEffect(() => {
    let intervalId = null;
    if (timerActive && secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerActive(false);
      if (timerMode === 'Focus') {
        alert('🎉 Focus Session Complete! Time for a short break.');
        setTimerMode('Break');
        setSecondsLeft(300); 
      } else {
        alert('⏱️ Break complete! Ready to lock back in?');
        setTimerMode('Focus');
        setSecondsLeft(1500); 
      }
    }
    return () => clearInterval(intervalId);
  }, [timerActive, secondsLeft, timerMode]);

  // ===============================
  // DATABASE REST API INTERACTIONS
  // ===============================
  const loadUserTasks = async (userId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${userId}`);
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error('Database connection dropped:', err);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const endpoint = isRegistering ? 'register' : 'login';
    try {
      const res = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error);
      } else {
        if (isRegistering) {
          setAuthSuccess('Account created successfully! Shifting to login panel...');
          setIsRegistering(false);
        } else {
          setActiveUser(data.user);
          loadUserTasks(data.user.id);
          setCurrentView('VIEW_TIMER');
        }
      }
    } catch (err) {
      setAuthError('Connection failed. Verify your server framework is online.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    //enforce strict mode lockout for task entry during active countdown sessions (FR5)
    if (strictMode && timerActive) {
      setStrictWarning(true);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: activeUser.id, title: newTaskTitle })
      });
      if (res.ok) {
        setNewTaskTitle('');
        loadUserTasks(activeUser.id);
      }
    } catch (err) {
      console.error('Failed to register task:', err);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: currentStatus === 0 ? 1 : 0 })
      });
      if (res.ok) loadUserTasks(activeUser.id);
    } catch (err) {
      console.error('Failed to shift task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) loadUserTasks(activeUser.id);
    } catch (err) {
      console.error('Failed to clear task row:', err);
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    setTasks([]);
    setTimerActive(false);
    setStrictMode(false);
    setStrictWarning(false);
    setSecondsLeft(1500);
    setEmail('');
    setPassword('');
    setCurrentView('VIEW_LOGIN');
  };

  const formatTimeStr = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyCustomTime = (e) => {
    e.preventDefault();
    if (timerActive) return; // Prevent changing times mid-session
    const mins = parseInt(customMinutes, 10);
    if (isNaN(mins) || mins <= 0) {
      alert('Please provide a valid study duration greater than 0.');
      return;
    }
    setSecondsLeft(mins * 60);
    setTimerMode('Focus');
  };

  const handleNavViewSwitch = (targetView) => {
    if (strictMode && timerActive) {
      setStrictWarning(true);
      alert('🚫 Strict Mode is active! Navigation is locked during countdown sessions.')
      return;
    }
    setStrictWarning(false);
    setCurrentView(targetView);
  };

  return (
    <div style={styles.appContainer}>
      {/* header navigation bar with conditional rendering of the login/register, timer, and task planner views */}
      <header style={styles.appHeader}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>📚 StudyFlow</h1>
        {activeUser && (
          <div style={styles.navLinks}>
            {/* buttons route through strict mode validator */}
            <button onClick={() => handleNavViewSwitch('VIEW_TIMER')} style={currentView === 'VIEW_TIMER' ? styles.activeNavBtn : styles.navBtn}>⏱️ Timer</button>
            <button onClick={() => handleNavViewSwitch('VIEW_TASKS')} style={currentView === 'VIEW_TASKS' ? styles.activeNavBtn : styles.navBtn}>📋 Tasks</button>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        )}
    
      </header>
    

      <main style={styles.mainCanvas}>
        
        {/* conditional rendering of login/register, timer, and task planner views based on the currentView state variable */}
        {currentView === 'VIEW_LOGIN' && (
          <div style={styles.authCard}>
            <h2>{isRegistering ? 'Create Student Profile' : 'Student Access Gateway'}</h2>
            <form onSubmit={handleAuthSubmit} style={styles.formLayout}>
              <input type="email" placeholder="Student Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.inputField} required />
              <input type="password" placeholder="Password Text Key" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.inputField} required />
              <button type="submit" style={styles.primaryActionBtn}>{isRegistering ? 'Sign Up' : 'Log In'}</button>
            </form>
            {authError && <p style={styles.errorText}>❌ {authError}</p>}
            {authSuccess && <p style={styles.successText}>✅ {authSuccess}</p>}
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
              {isRegistering ? 'Already have an account?' : 'New to StudyFlow?'}
              <span onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }} style={styles.toggleLink}>
                {isRegistering ? ' Back to Login' : ' Register Here'}
              </span>
            </p>
          </div>
        )}

        {/* conditional rendering of the timer view */}
        {currentView === 'VIEW_TIMER' && (
          <div style={styles.dashboardContainer}>
            <div style={styles.timerCircleCard}>
              <span style={styles.statusCapsule}>{timerMode.toUpperCase()} STATE</span>
              <h2 style={styles.countdownClockText}>{formatTimeStr()}</h2>

              {/* custom time input configuration form wrapper */}
              <form onSubmit={handleApplyCustomTime} style={styles.customTimeForm}>
                <input 
                  type="number" 
                  min="1" 
                  max="180"
                  value={customMinutes} 
                  onChange={(e) => setCustomMinutes(e.target.value)} 
                  disabled={timerActive}
                  style={styles.timeMinutesInput}
                />
                <button type="submit" disabled={timerActive} style={timerActive ? styles.disabledBtn : styles.setTimeBtn}>
                  🔧 Set Minutes
                </button>
              </form>

              <div style={styles.timerControlsRow}>
                <button onClick={() => setTimerActive(!timerActive)} style={timerActive ? styles.pauseBtn : styles.startBtn}>
                  {timerActive ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button onClick={() => { setTimerActive(false); setSecondsLeft(timerMode === 'Focus' ? 1500 : 300); }} style={styles.resetBtn}>🔄 Reset</button>
              </div>

              <div style={styles.strictToggleContainer}>
                <label style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                  <input type="checkbox" checked={strictMode} onChange={(e) => { setStrictMode(e.target.checked); setStrictWarning(false); }} style={{ marginRight: '8px' }} />
                  Anti-Distraction Mode
                </label>
                {strictMode && <p style={{ fontSize: '13px', color: '#e74c3c', margin: '5px 0 0 0' }}>⚠️ Warning: Task entries are sealed while the clock runs!</p>}
              </div>
            </div>
          </div>
        )}

        {/* conditional rendering of the task planner view */}
        {currentView === 'VIEW_TASKS' && (
          <div style={styles.dashboardContainer}>
            <div style={styles.plannerCard}>
              <h2>📝 My Study Checklist Planner</h2>
              
              {strictWarning && (
                <div style={styles.alertLightbox}>
                  <p style={{ margin: 0 }}>🚫 <strong>Strict Mode Enforcement:</strong> Christina's system maps have blocked task configuration entry rows while the countdown session clock is executing!</p>
                  <button onClick={() => setStrictWarning(false)} style={styles.dismissAlertBtn}>Dismiss Warning</button>
                </div>
              )}

              <form onSubmit={handleAddTask} style={styles.taskInputRow}>
                <input 
                  type="text" 
                  placeholder={strictMode && timerActive ? "Locked down under Strict Mode..." : "Add a new study item..."} 
                  value={newTaskTitle} 
                  onChange={(e) => setNewTaskTitle(e.target.value)} 
                  disabled={strictMode && timerActive} 
                  style={styles.taskFieldInput} 
                />
                <button 
                  type="submit" 
                  disabled={strictMode && timerActive} 
                  style={strictMode && timerActive ? styles.disabledBtn : styles.addTaskBtn}
                >
                  + Add Task
                </button>
              </form>

              <div style={styles.tasksScrollList}>
                {tasks.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No tasks yet. Start adding your study items!</p>
                ) : (
                  tasks.map((task) => ( 
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={task.is_completed === 1}
                        onChange={() => handleToggleTask(task.id, task.is_completed)}
                        style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                      />
                      <span style={task.is_completed === 1 ? styles.taskTextCompleted : styles.taskTextActive}>
                        {task.title}
                      </span>
                      <button onClick={() => handleDeleteTask(task.id)} style={styles.deleteTaskRowBtn}>🗑️ Delete</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
    
        )}
      </main>
    </div>
  );
}

// ========================================
// CENTRALIZED DESIGN STYLING COEFFICIENTS
// ========================================
const styles = {
  appContainer: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  appHeader: { backgroundColor: '#2c3e50', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  navLinks: { display: 'flex', gap: '10px', alignItems: 'center' },
  navBtn: { backgroundColor: 'transparent', border: 'none', color: '#bdc3c7', padding: '8px 16px', cursor: 'pointer', fontSize: '15px', borderRadius: '4px', transition: '0.2s' },
  activeNavBtn: { backgroundColor: '#34495e', border: 'none', color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: '15px', borderRadius: '4px', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#e74c3c', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', marginLeft: '10px' },
  mainCanvas: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' },
  authCard: { backgroundColor: '#fff', padding: '35px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  formLayout: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  inputField: { padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' },
  primaryActionBtn: { backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  toggleLink: { color: '#3498db', cursor: 'pointer', fontWeight: 'bold' },
  errorText: { color: '#e74c3c', margin: '15px 0 0 0', fontWeight: 'bold', fontSize: '14px' },
  successText: { color: '#2ecc71', margin: '15px 0 0 0', fontWeight: 'bold', fontSize: '14px' },
  dashboardContainer: { width: '100%', maxWidth: '550px', padding: '20px' },
  timerCircleCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '40px 20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statusCapsule: { backgroundColor: '#ebf5fb', color: '#2980b9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' },
  countdownClockText: { fontSize: '72px', margin: '20px 0', color: '#2c3e50', fontFamily: 'monospace', fontWeight: 'bold' },
  customTimeForm: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '25px', width: '100%', maxWidth: '240px' },
  timeMinutesInput: { width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', textAlign: 'center', fontWeight: 'bold' },
  setTimeBtn: { backgroundColor: '#34495e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  timerControlsRow: { display: 'flex', gap: '15px', justifyContent: 'center', width: '100%' },
  startBtn: { backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', minWidth: '130px' },
  pauseBtn: { backgroundColor: '#f39c12', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', minWidth: '130px' },
  resetBtn: { backgroundColor: '#95a5a6', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' },
  strictToggleContainer: { marginTop: '35px', backgroundColor: '#fdf2e9', border: '1px dashed #e67e22', padding: '12px 20px', borderRadius: '6px', color: '#d35400' }, plannerCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  taskInputRow: { display: 'flex', gap: '10px', margin: '20px 0' },
  taskFieldInput: { flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px' },
  addTaskBtn: { backgroundColor: '#2980b9', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  disabledBtn: { backgroundColor: '#bdc3c7', color: '#7f8c8d', border: 'none', padding: '12px 20px', borderRadius: '4px', cursor: 'not-allowed' },
  alertLightbox: { backgroundColor: '#fde8e8', border: '1px solid #f8b4b4', padding: '15px', borderRadius: '6px', color: '#9b1c1c', marginBottom: '15px', fontSize: '14px', lineHeight: '1.4' },
  dismissAlertBtn: { marginTop: '10px', backgroundColor: '#9b1c1c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' },
  tasksScrollList: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '5px' },
  taskRowItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #2980b9', transition: '0.2s' },
  taskTextActive: { fontSize: '15px', color: '#2c3e50', fontWeight: '500' },
  taskTextCompleted: { fontSize: '15px', color: '#95a5a6', textDecoration: 'line-through', fontStyle: 'italic' },
  deleteTaskRowBtn: { backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }
};