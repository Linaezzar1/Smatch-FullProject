import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Events from "./components/dashboard/events/Events";
import Players from "./components/dashboard/Volley/Players/Players";
import Matches from "./components/dashboard/Volley/Matches/Matches";
import Orders from "./components/dashboard/Sales/Orders/Orders";
import Products from "./components/dashboard/Sales/Products/Products";
import Sidebar from "./components/dashboard/Sidebar/Sidebar";
import './App.css';
import MainDashboard from './components/dashboard/MainDashboard/MainDashboard';
import EventForm from './components/dashboard/events/EventForm';
import Navbar from './components/dashboard/Navbar/Navbar';
import Profile from './components/dashboard/Profile/Profile';
import Login from './components/Login/Login';
import Category from './components/dashboard/Sales/Category/Category';
import Teams from './components/dashboard/Volley/Teams/Teams';
import ProtectedRoute from './routes/ProtectedRoute'; 
import TournamentDetails from './components/dashboard/events/TournamentDetails';

function DashboardLayout() {
  return (
    <>
      <div className="navbar-container">
        <Navbar />
      </div>
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page de login sans protection */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées par ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MainDashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="event-form/:id" element={<EventForm />} />
            <Route path="tournament/:id" element={<TournamentDetails />} />
          <Route path="players" element={<Players />} />
          <Route path="matches" element={<Matches />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Category />} />
          <Route path="profile" element={<Profile />} />
          <Route path="teams" element={<Teams />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
