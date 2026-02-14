import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import Forum from './pages/Forum';
import VideoView from './pages/VideoView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/foro" element={<Forum />} />
        <Route path="/video" element={<VideoView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;