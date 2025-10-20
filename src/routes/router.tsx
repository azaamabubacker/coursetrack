import { createBrowserRouter } from 'react-router';
import AppLayout from '../ui/AppLayout';
import HomePage from '../feature/home/HomePage';
import CoursesPage from '../feature/courses/CoursesPage';
import LoginPage from '../feature/auth/LoginPage';
import CourseDetailPage from '../feature/courses/CourseDetailsPage';
import ProtectedRoute from './ProtectedRoute';
import NewCoursePage from '../feature/courses/NewCourse';
import EditCoursePage from '../feature/courses/EditCourse';

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
      { path: 'courses/new', element: <NewCoursePage /> },
      { path: 'courses/:id/edit', element: <EditCoursePage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
