import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { EditJobDialogProps } from '.';
import { toast } from 'sonner';

const EditJobDialog = ({ job, open, onClose, onEditJob }: EditJobDialogProps) => {
  const [auteur, setAuteur] = useState(job.author);
  const [description, setDescription] = useState(job.description);
  const [dailyRate, setDailyRate] = useState(job.dailyRate);

  const handleEditJob = () => {
    if (!auteur || !description || dailyRate <= 0) {
      toast.error('Veuillez vérifier que tous les champs sont correctement renseignés', {
        style: {
          background: '#ef4444',
          color: '#fff',
          border: '2px solid #fca5a5',
        },
      });
      return;
    }
    onEditJob({ id: job.id, author: auteur, description, dailyRate });
    toast.success('Offre modifiée avec succès !', {
      style: {
        background: '#7c3aed',
        color: '#fff',
        border: '2px solid #a78bfa',
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 modal-box w-11/12 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white font-bold text-2xl mb-4">Modifier l'offre #{job.id}</DialogTitle>
          <DialogDescription className="text-gray-400">Modifiez les informations de l'offre ci-dessous.</DialogDescription>
        </DialogHeader>

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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="text-white bg-gray-700 hover:bg-gray-600">
              Annuler
            </Button>
          </DialogClose>
          <Button className="text-white bg-purple-600 hover:bg-purple-700" onClick={handleEditJob}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
