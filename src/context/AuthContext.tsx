
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useData } from './DataContext';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if there's a stored user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('eduquest_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('eduquest_user');
      }
    }
    setIsLoading(false);
  }, [setUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to authenticate
      // For now, we'll use a mock implementation
      const mockUsers = [
        {
          id: 'admin1',
          name: 'Principal Adams',
          email: 'admin@school.edu',
          password: 'admin123', // In real app, never store plain passwords
          role: 'Admin' as const,
          school: 'Springfield High School',
          subjects: [],
        },
        {
          id: 'user1',
          name: 'Mr. John Doe',
          email: 'john.doe@example.edu',
          password: 'teacher123', // In real app, never store plain passwords
          role: 'Teacher' as const,
          school: 'Springfield High School',
          subjects: ['Biology', 'Chemistry'],
        },
      ];

      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Remove the password before storing the user
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to context and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('eduquest_user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });

      // Redirect based on role
      if (userWithoutPassword.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eduquest_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'Admin',
        isTeacher: user?.role === 'Teacher',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
