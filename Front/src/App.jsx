import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Main from './pages/Main';
import Forum from './pages/Forum';
import VideoView from './pages/VideoView';
import Profile from './pages/Profile';
import Users from './pages/Users';
import VideosAdmin from './pages/VideosAdmin';
import AdminDashboard from './pages/AdminDashboard';
import VideosLibrary from './pages/VideosLibrary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/main" element={<ProtectedRoute><Main /></ProtectedRoute>} />
        <Route path="/foro" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
        <Route path="/video" element={<ProtectedRoute><VideoView /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Rutas administrativas protegidas */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/admin/videos" element={<ProtectedRoute><VideosLibrary /></ProtectedRoute>} />
        <Route path="/admin/videos/agregar" element={<ProtectedRoute><VideosAdmin /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;