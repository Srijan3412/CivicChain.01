import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, MessageSquare, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/insights', label: 'AI Insights', icon: Brain },
    { path: '/feedback', label: 'Feedback', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-scale">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">Municipal Portal</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  asChild
                  size="sm"
                  className={`h-10 transition-all duration-200 ${
                    isActive(item.path) 
                      ? "bg-gradient-primary shadow-md" 
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Link to={item.path} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-foreground">Welcome back</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={signOut} className="hover-scale">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" className="bg-gradient-primary hover:opacity-90 shadow-md">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex space-x-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                asChild
                size="sm"
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive(item.path) 
                    ? "bg-gradient-primary shadow-md" 
                    : "hover:bg-accent/50"
                }`}
              >
                <Link to={item.path} className="flex flex-col items-center space-y-1 min-w-max px-3">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.label.split(' ')[0]}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;