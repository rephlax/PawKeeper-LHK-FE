import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const RegularSidebar = ({ user }) => (
  <div className="space-y-6 p-4">
    <h2 className="text-xl font-semibold mb-6">Navigation</h2>
    <nav className="space-y-2">
      <Link 
        to="/" 
        className="flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg"
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>
      
      {user && (
        <Link 
          to={`/users/user/${user._id}`}
          className="flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg"
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      )}
    </nav>
  </div>
);
export default RegularSidebar;