import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Mentors from './pages/Mentors';
import MentorDetail from './pages/MentorDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import StudentDetail from './pages/StudentDetail';
import MyRequests from './pages/MyRequests';
import Home from './pages/Home';
import AiMentor from './pages/AiMentor';
import MyMentees from './pages/MyMentees';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Sadece Öğrencilerin Girebileceği Sayfalar */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route path="mentors" element={<Mentors />} />
              <Route path="mentors/:id" element={<MentorDetail />} />
            </Route>

            {/* Sadece Mezunların (Mentor) Girebileceği Sayfalar */}
            <Route element={<ProtectedRoute allowedRoles={['ALUMNI']} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-mentees" element={<MyMentees />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route path="my-requests" element={<MyRequests />} />
            </Route>

            {/* Herkesin Kendi Profilini Yöneteceği Sayfa */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="students/:id" element={<StudentDetail />} />
              <Route path="ai-mentor" element={<AiMentor />} />
            </Route>

          </Route>
        </Routes>
        </NotificationProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
