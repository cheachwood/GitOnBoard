import CreateJobDialog from '../job/CreateJobDialog';
import type { JobDialogProps } from '../job';

const Header = ({ onCreateJob }: JobDialogProps) => {
  return (
    <header className="sticky top-0 bg-slate-900 z-50 py-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">🚀 Web3 Jobs Board</h1>
            <p className="text-gray-400 mt-2">Trouvez votre prochaine mission blockchain</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Bouton AppKit */}
            <appkit-button />

            <CreateJobDialog onCreateJob={onCreateJob} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
