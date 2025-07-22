import React from 'react';
import { Outlet } from 'react-router-dom';
import Role from '../auth/Role';

function Layout() {
    return (
        <div className="flex">
        {/* Left Side - Image/Role Component */}
        <div className="w-1/2 flex items-center justify-center bg-white-600">
            <Outlet />
        </div>
        <div className="w-1/2">
            <Role />
        </div>

        {/* Right Side - Login/Signup via Outlet */}

        </div>
    );
}

export default Layout;
