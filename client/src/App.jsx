import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css"

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/sign-up" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
