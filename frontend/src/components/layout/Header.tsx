import { Wallet } from 'lucide-react';
import { Button } from '../ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 bg-slate-900 z-50 py-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">🚀 Web3 Jobs Board</h1>
            <p className="text-gray-400 mt-2">Trouvez votre prochaine mission blockchain</p>
          </div>
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            <Wallet className="mr-2 w-5 h-5" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
