import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Database, 
  Home, 
  Settings, 
  LogOut,
  BookOpen,
  Menu,
  X,
  Users,
  School,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const getNavItems = () => {
    const teacherItems = [
      { path: '/', label: 'Home', icon: Home },
      { path: '/question-bank', label: 'Question Bank', icon: Database },
      { path: '/question-papers', label: 'Question Papers', icon: FileText },
      { path: '/create-paper', label: 'Create Paper', icon: BookOpen },
      { path: '/settings', label: 'Settings', icon: Settings },
    ];
    
    const adminItems = [
      { path: '/admin-dashboard', label: 'Dashboard', icon: Home },
      { path: '/admin-dashboard', label: 'Teacher Management', icon: Users },
      { path: '/question-papers', label: 'Question Papers', icon: FileText },
      { path: '/settings', label: 'Settings', icon: Settings },
    ];
    
    return isAdmin ? adminItems : teacherItems;
  };
  
  const navItems = getNavItems();
  
  React.useEffect(() => {
    if (!currentUser && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [currentUser, location.pathname, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-educate-400 text-white shadow-md fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <School className="h-6 w-6" />
            ) : (
              <BookOpen className="h-6 w-6" />
            )}
            <h1 className="text-xl font-bold">EduQuest</h1>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white hover:bg-educate-500">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {currentUser && (
              <>
                <div className="text-sm">
                  <div className="font-medium">{currentUser.name}</div>
                  <div className="text-xs opacity-80">{currentUser.school}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-educate-500"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <div className={cn(
        "md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity mt-[57px]",
        menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white transform transition-transform ease-in-out duration-300",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-educate-400">
                <BookOpen className="h-6 w-6" />
                <h1 className="text-xl font-bold">EduQuest</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X size={20} />
              </Button>
            </div>
            
            {currentUser && (
              <div className="border-b pb-4 mb-4">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-sm text-gray-600">{currentUser.school}</div>
              </div>
            )}
            
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                    location.pathname === item.path
                      ? "bg-educate-100 text-educate-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto pt-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:bg-gray-100" 
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex pt-[57px]">
        <div className="hidden md:flex flex-col w-64 bg-gray-50 border-r fixed h-[calc(100vh-57px)] overflow-y-auto">
          <div className="p-5 space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === item.path
                    ? "bg-educate-100 text-educate-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto md:ml-64">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
