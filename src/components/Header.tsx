import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import piBy2Logo from "@/assets/pi-by-2-logo.png";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

const Header = ({ showBack = false, title }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          
          {title ? (
            <h1 className="font-display text-xl text-foreground">{title}</h1>
          ) : (
            <Link to="/home" className="flex items-center gap-3">
              <img src={piBy2Logo} alt="Pi By 2 Cafe" className="w-10 h-10 rounded-full object-cover" />
              <div className="hidden sm:block">
                <span className="font-display text-lg text-foreground block leading-tight">Pi By 2</span>
                <span className="text-xs text-muted-foreground">Your Food Constant</span>
              </div>
            </Link>
          )}
        </div>

        {/* Right Section - Logo when showing title */}
        {title && (
          <Link to="/home" className="flex items-center gap-2">
            <img src={piBy2Logo} alt="Pi By 2 Cafe" className="w-9 h-9 rounded-full object-cover" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
