import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Leaf } from "lucide-react";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

const Header = ({ showBack = false, title }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-earth" />
            </button>
          )}
          
          {title ? (
            <h1 className="font-display text-xl text-earth">{title}</h1>
          ) : (
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage to-forest flex items-center justify-center">
                <Leaf className="w-5 h-5 text-cream" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-lg text-earth block leading-tight">Earthmonk</span>
                <span className="text-xs text-muted-foreground">Nature's Kitchen</span>
              </div>
            </Link>
          )}
        </div>

        {/* Right Section - Logo when showing title */}
        {title && (
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage to-forest flex items-center justify-center">
              <Leaf className="w-4 h-4 text-cream" />
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
