
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, Calendar, Clipboard, BarChart3, Users, DollarSign, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AdminLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActivePath = (path: string) => {
    return currentPath.includes(path) ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-600 hover:bg-gray-100';
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { path: '/admin/bookings', label: 'Bookings', icon: <Calendar size={20} /> },
    { path: '/admin/customers', label: 'Customers', icon: <Users size={20} /> },
    { path: '/admin/jobs', label: 'Jobs', icon: <Clipboard size={20} /> },
    { path: '/admin/technicians', label: 'Technicians', icon: <Wrench size={20} /> },
    { path: '/admin/accounting', label: 'Accounting', icon: <DollarSign size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/admin/dashboard" className="font-bold text-xl text-brand-blue">
            Klin Ride Admin
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-600">
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-white hidden md:block">
          <nav className="py-4">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center px-6 py-3 ${isActivePath(item.path)}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <nav className="flex justify-between px-4 py-2">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`p-2 flex flex-col items-center text-xs ${
                  currentPath.includes(item.path) ? 'text-brand-blue' : 'text-gray-600'
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
