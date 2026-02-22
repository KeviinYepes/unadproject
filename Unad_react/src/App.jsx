import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Forum from './pages/Forum';
import VideoView from './pages/VideoView';
import Profile from './pages/Profile'; // <-- importar
import Users from './pages/Users';
import VideosAdmin from './pages/VideosAdmin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/foro" element={<Forum />} />
        <Route path="/video" element={<VideoView />} />
        <Route path="/profile" element={<Profile />} /> {/* Nueva ruta */}

        {/* Rutas administrativas */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/videos" element={<VideosAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;