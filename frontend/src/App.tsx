import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Search from './pages/Search';
import BookView from './pages/BookView';
import Library from './pages/Library';
import Header from './components/layout/Header';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/book/:id" element={<BookView />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/" element={<Navigate to="/home" replace />} />
                    </Routes>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
