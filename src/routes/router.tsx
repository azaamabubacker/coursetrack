import { createBrowserRouter } from 'react-router';
import AppLayout from '../ui/AppLayout';
import HomePage from '../feature/home/HomePage';
import CoursesPage from '../feature/courses/CoursesPage';
import LoginPage from '../feature/auth/LoginPage';
import CourseDetailPage from '../feature/courses/CourseDetailsPage';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'courses', element: <CoursesPage /> },
      {
        path: 'courses/:id',
        element: (
          <ProtectedRoute>
            <CourseDetailPage />
          </ProtectedRoute>
        ),
      },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
