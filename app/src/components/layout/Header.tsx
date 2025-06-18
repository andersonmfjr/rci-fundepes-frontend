
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { authService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b bg-white shadow-sm flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-base lg:text-lg">R</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg lg:text-xl font-bold text-gray-900">RCI BI</h1>
          <p className="text-xs text-gray-500 hidden lg:block">Sistema de Gestão RCI</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700 hidden sm:inline">{user?.name}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
