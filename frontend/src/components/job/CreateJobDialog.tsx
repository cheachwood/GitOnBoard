import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { JobDialogProps } from '.';
import { toast } from 'sonner';

const CreateJobDialog = ({ onCreateJob }: JobDialogProps) => {
  const [auteur, setAuteur] = useState('');
  const [description, setDescription] = useState('');
  const [dailyRate, setDailyRate] = useState(0);
  const [open, setOpen] = useState(false);

  const handleCreateJob = () => {
    if (!auteur || !description || dailyRate <= 0) {
      toast.error('Veuillez remplir tous les champs correctement', {
        style: {
          background: '#ef4444',
          color: '#fff',
          border: '2px solid #fca5a5',
        },
      });
      return;
    }
    onCreateJob({ author: auteur, description, dailyRate });
    toast.success('Offre créée avec succès !', {
      style: {
        background: '#7c3aed',
        color: '#fff',
        border: '2px solid #a78bfa',
      },
    });
    setOpen(false);
    setAuteur('');
    setDescription('');
    setDailyRate(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 text-white hover:bg-purple-700">➕ Ajouter une offre</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 modal-box w-11/12 max-w-2xl">
        <DialogHeader>
          <DialogTitle id="modalTitle" className="text-white font-bold text-2xl mb-4">
            Nouvelle Offre
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="author" className="text-white">
              👤 Auteur
            </Label>
            <Input id="author" name="auteur" placeholder="Auteur..." className="text-white bg-gray-900" value={auteur} onChange={(e) => setAuteur(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description" className="text-white">
              📋 Description
            </Label>
            <Textarea id="description" name="description" placeholder="Description..." className="h-32 text-white bg-gray-900" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tjm" className="text-white">
              💰 TJM (€/jour)
            </Label>
            <Input id="tjm" type="number" name="tjm" placeholder="0" className="text-white bg-gray-900" value={dailyRate} onChange={(e) => setDailyRate(Number(e.target.value))} />{' '}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="text-white bg-gray-700 hover:bg-gray-600">
              Annuler
            </Button>
          </DialogClose>
          <Button className="text-white bg-purple-600 hover:bg-purple-700" onClick={handleCreateJob}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobDialog;
