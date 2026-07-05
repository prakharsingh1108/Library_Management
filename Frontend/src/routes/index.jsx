import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import GuestRoute from '../components/ProtectedRoute/GuestRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyOTP from '../pages/VerifyOTP';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';
import Books from '../pages/Books';
import BookDetails from '../pages/BookDetails';
import BorrowedBooks from '../pages/BorrowedBooks';
import AdminDashboard from '../pages/AdminDashboard';
import AddBook from '../pages/AddBook';
import Users from '../pages/Users';
import RegisterAdmin from '../pages/RegisterAdmin';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'books', element: <Books /> },
      { path: 'books/:id', element: <BookDetails /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },
      {
        path: 'verify-otp',
        element: (
          <GuestRoute>
            <VerifyOTP />
          </GuestRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        ),
      },
      {
        path: 'password/reset/:token',
        element: (
          <GuestRoute>
            <ResetPassword />
          </GuestRoute>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'profile', element: <Profile /> },
      { path: 'my-books', element: <BorrowedBooks /> },
    ],
  },
  {
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'admin/dashboard', element: <AdminDashboard /> },
      { path: 'admin/books', element: <Books /> },
      { path: 'admin/books/add', element: <AddBook /> },
      { path: 'admin/borrows', element: <BorrowedBooks /> },
      { path: 'admin/users', element: <Users /> },
      { path: 'admin/register-admin', element: <RegisterAdmin /> },
    ],
  },
]);

export default router;
