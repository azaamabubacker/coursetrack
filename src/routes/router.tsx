import { createBrowserRouter } from 'react-router';
import AppLayout from '../ui/AppLayout';
import { lazy, Suspense, type JSX } from 'react';

const HomePage = lazy(() => import('../feature/home/HomePage'));
const CoursesPage = lazy(() => import('../feature/courses/CoursesPage'));
const NewCoursePage = lazy(() => import('../feature/courses/NewCourse'));
const EditCoursePage = lazy(() => import('../feature/courses/EditCourse'));
const CourseDetailPage = lazy(() => import('../feature/courses/CourseDetailsPage'));
const LoginPage = lazy(() => import('../feature/auth/LoginPage'));

const wrap = (el: JSX.Element) => <Suspense fallback={<p className="p-4">Loading…</p>}>{el}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: wrap(<HomePage />) },
      { path: 'courses', element: wrap(<CoursesPage />) },
      { path: 'courses/new', element: wrap(<NewCoursePage />) },
      { path: 'courses/:id/edit', element: wrap(<EditCoursePage />) },
      { path: 'courses/:id', element: wrap(<CourseDetailPage />) },
      { path: 'login', element: wrap(<LoginPage />) },
    ],
  },
]);
