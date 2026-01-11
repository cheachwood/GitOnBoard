import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { JOB_TYPE_OPTIONS, type ChangeStatusDialogProps, type JobStatus } from '.';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

const ChangeStatusDialog = ({ job, open, onClose, onStatusChanged }: ChangeStatusDialogProps) => {
  const [newStatus, setNewStatus] = useState<JobStatus>(job.status);

  const handleStatusChanged = () => {
    console.log(newStatus);
    if (newStatus === job.status) {
      toast.error("Le status n'a pas changé!", {
        style: {
          background: '#ef4444',
          color: '#fff',
          border: '2px solid #fca5a5',
        },
      });
      return;
    }

    onStatusChanged(job.id, newStatus);
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
          <DialogTitle className="text-white font-bold text-2xl mb-4">Changement le status de #{job.id}</DialogTitle>
          <DialogDescription className="text-gray-400">Afficher le statut actuel et le nouveau statut de l'offre.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="author" className="text-white">
              👤 Auteur
            </Label>
            <span className="text-white bg-gray-900 p-2 rounded">{job.author}</span>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description" className="text-white">
              📋 Description
            </Label>
            <span className="text-white bg-gray-900 p-2 rounded min-h-32">{job.description}</span>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tjm" className="text-white">
              💰 TJM (€/jour)
            </Label>
            <span className="text-white bg-gray-900 p-2 rounded">{job.dailyRate}€</span>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="status" className="text-white">
              🔄 Status (actuel: <span className="text-purple-400">{job.status}</span>)
            </Label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as JobStatus)}>
              <SelectTrigger className="w-full bg-gray-900 text-white border-gray-700 hover:bg-gray-800">
                <SelectValue placeholder="Sélectionner un status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectGroup>
                  <SelectLabel className="text-gray-400">Status</SelectLabel>
                  {JOB_TYPE_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-800 focus:bg-gray-800">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="text-white bg-gray-700 hover:bg-gray-600">
              Annuler
            </Button>
          </DialogClose>
          <Button className="text-white bg-purple-600 hover:bg-purple-700" onClick={handleStatusChanged}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeStatusDialog;
