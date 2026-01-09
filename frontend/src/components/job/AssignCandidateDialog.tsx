import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { AssignCandidateDialogProps } from '.';
import { toast } from 'sonner';

const AssignCandidateDialog = ({ job, open, onClose, onCandidateJob }: AssignCandidateDialogProps) => {
  const [nom, setNom] = useState('');
  const [mail, setMail] = useState('');
  const [wallet, setWallet] = useState('');

  const handleCandidate = () => {
    // 1. Définition des validations
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    const isWalletValid = /^0x[a-fA-F0-9]{40}$/.test(wallet);

    // 2. Fonction utilitaire pour éviter de répéter le style
    const showError = (message: string) => {
      toast.error(message, {
        style: { background: '#ef4444', color: '#fff', border: '2px solid #fca5a5' },
      });
    };

    // 3. Logique de validation groupée
    if (!nom || !mail) return showError('Tous les champs sont requis');
    if (!isEmailValid) return showError('Format email invalide');
    if (wallet && !isWalletValid) return showError('Format wallet invalide (0x...)');

    onCandidateJob({ id: job.id, candidatNom: nom, candidatMail: mail, candidatWallet: wallet });
    toast.success('Candidature envoyée avec succès !', {
      style: {
        background: '#7c3aed',
        color: '#fff',
        border: '2px solid #a78bfa',
      },
    });
    onClose();
    setNom('');
    setMail('');
    setWallet('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 modal-box w-11/12 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white font-bold text-2xl mb-4">Candidater à l'offre #{job.id}</DialogTitle>
          <DialogDescription className="text-gray-400">Candidater en rensignant les informations de l'offre ci-dessous.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="nom" className="text-white">
              👨‍💻 Nom du candidat
            </Label>
            <Input id="nom" name="nom" placeholder="Nom..." className="text-white bg-gray-900" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="mail" className="text-white">
              📧 Email du candidat
            </Label>
            <Input id="mail" name="mail" type="email" placeholder="Email..." className="text-white bg-gray-900" value={mail} onChange={(e) => setMail(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="wallet" className="text-white">
              🔐 Adresse wallet du candidat
            </Label>
            <Input id="wallet" name="wallet" placeholder="wallet..." className="text-white bg-gray-900" value={wallet} onChange={(e) => setWallet(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="text-white bg-gray-700 hover:bg-gray-600">
              Annuler
            </Button>
          </DialogClose>
          <Button className="text-white bg-purple-600 hover:bg-purple-700" onClick={handleCandidate}>
            📝 Candidater
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCandidateDialog;
