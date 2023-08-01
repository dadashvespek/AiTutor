import React, { useEffect, useState } from 'react';
import logo from '../assets/favtutorlogo.png';
import { supabase } from '../supabaseClient';


const NavBar = ({session}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const userName = session.user.identities[0].identity_data.name;
    const userEmail = session.user.email;

      
    useEffect(() => {
        const pageClickEvent = (e) => {
            if (!e.target.closest('#user-menu-button') && !e.target.closest('#user-dropdown')) {
              setDropdownOpen(false);
            }
          };
  
      // If the item is active (ie open) then listen for clicks
      if (dropdownOpen) {
        window.addEventListener('mousedown', pageClickEvent);
      }
  
      return () => {
        window.removeEventListener('mousedown', pageClickEvent);
      }
  
    }, [dropdownOpen]);
  
    return (
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://favtutor.com/" className="flex items-center">
        <img src={logo} className="h-8 mr-3" alt="FavTutor Logo" />
          </a>
          <div className="relative flex items-center md:order-2">
              <button type="button" className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo" />
              </button>
              {dropdownOpen && (
                <div className="z-50 absolute top-full right-0 mt-4 py-2 w-48 bg-white rounded-md shadow-xl dark:bg-gray-800" id="user-dropdown">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">{userName}</span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{userEmail}</span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
                    </li>
                    <li>
                      <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
                    </li>
                    <li>
                      <a href="/earnings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
                    </li>
                    <li>
                      <button onClick={() => supabase.auth.signOut()} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</button>
                    </li>
                  </ul>
                </div>
              )}
          </div>
        </div>
      </nav>
    );
}

export default NavBar;
