import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";
import { ThemeProvider } from "./theme/ThemeProvider";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Forum from "./pages/Forum";
import VideoView from "./pages/VideoView";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import AdminDashboard from "./pages/AdminDashboard";
import VideosLibrary from "./pages/VideosLibrary";
import Roles from "./pages/Roles";
import Categories from "./pages/Categories";

/**
 * Rutas de la aplicacion.
 *
 * El marco (barra lateral + encabezado) es una ruta de layout, no codigo
 * repetido dentro de cada pagina. Las rutas y los permisos por rol son los
 * mismos de antes; /admin/videos y /admin/historico se conservan como alias
 * que redirigen a las rutas canonicas actuales.
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Todo lo autenticado comparte el marco de la aplicacion */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/main" element={<Main />} />
            <Route path="/foro" element={<Forum />} />
            <Route path="/video" element={<VideoView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/biblioteca" element={<VideosLibrary />} />
            <Route path="/admin/videos" element={<Navigate to="/admin/biblioteca" replace />} />

            {/* Rutas exclusivas de administrador */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/historico" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Roles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Categories />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
