import { Link } from 'react-router-dom';

/**
 * Application header component with navigation
 */
const Header = () => {
  return (
    <header className="py-4 border-b border-white/10 bg-surface/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-semibold">Clarity</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white/80 hover:text-white transition-colors">
            Accueil
          </Link>
          <a 
            href="https://github.com/yourusername/clarity" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 