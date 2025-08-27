import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Crown, GraduationCap } from 'lucide-react';
import logo from '@/logo.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} className="h-20 w-20"/>
          <span className="text-xl font-bold gradient-text">Circle Belajar Bareng</span>
        </Link>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/edukasi"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/edukasi') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Edukasi
            </Link>
            <Link
              to="/premium"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/premium') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Premium
            </Link>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{profile?.nama || 'User'}</span>
                  {profile?.role === 'premium' && (
                    <Crown className="h-4 w-4 text-primary" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link to="/auth">Masuk</Link>
              </Button>
              <Button asChild className="btn-premium">
                <Link to="/auth">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
