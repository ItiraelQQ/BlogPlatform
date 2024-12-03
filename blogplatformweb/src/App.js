import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import Posts from './components/Posts';  
import UserProfile from './components/UserProfile';
import '../src/styles/App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/new" element={<Posts type="new" />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/popular" element={<Posts type="popular" />} />
        <Route path="/posts" element={<Posts type="all" />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
