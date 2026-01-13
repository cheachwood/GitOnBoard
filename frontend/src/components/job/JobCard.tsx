import { Label } from '@radix-ui/react-label';
import { Button } from '../ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '@/components/ui/badge';
import { statusColors, type JobProps } from '.';
import EditJobDialog from './EditJobDialog';
import { useState } from 'react';
import AssignCandidateDialog from './AssignCandidateDialog';
import ChangeStatusDialog from './ChangeStatusDialog';

const getStatusColor = (status: string): string => {
  return statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
};

const JobCard = ({ job, callbacks }: JobProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCandidatDialogOpen, setIsCandidatDialogOpen] = useState(false);
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState(false);

  const hasCandidate = job.candidat.candidateName !== '';

  const renderButtons = () => {
    // Auteur du job
    if (job.isOwner) {
      // Completed ou Cancelled : Supprimer uniquement
      if (job.status === 'Completed' || job.status === 'Cancelled') {
        return (
          <Button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition" onClick={() => callbacks.onDeleteJob(job.id)}>
            🗑️ Supprimer
          </Button>
        );
      }

      // Open ou InProgress : Modifier + Supprimer
      return (
        <>
          <Button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition" onClick={() => setIsEditDialogOpen(true)}>
            ✏️ Modifier
          </Button>
          <Button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition" onClick={() => callbacks.onDeleteJob(job.id)}>
            🗑️ Supprimer
          </Button>
        </>
      );
    }

    // Non-auteur (candidat)
    // Open sans candidat : Bouton Candidater
    if (job.status === 'Open' && !hasCandidate) {
      return (
        <Button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition" onClick={() => setIsCandidatDialogOpen(true)}>
          📝 Candidater
        </Button>
      );
    }

    // Tous les autres cas : Rien
    return null;
  };

  const buttons = renderButtons();

  return (
    <>
      <Card className="h-full flex flex-col bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 overflow-hidden">
        <CardHeader className="flex justify-between items-start mb-4">
          <CardTitle className="text-xl font-bold text-purple-400">Job #{job.id}</CardTitle>
          <CardAction>
            <Badge className={`${getStatusColor(job.status)} cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => setIsChangeStatusDialogOpen(true)}>
              {job.status}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col text-sm text-gray-300">
          <div className="space-y-3 flex-1">
            <div>
              <Label className="font-semibold text-gray-400">👤 Auteur:</Label>
              <Label className="ml-2">{job.author}</Label>
            </div>

            {hasCandidate && (
              <div>
                <Label className="font-semibold text-gray-400">👨‍💻 Candidat:</Label>
                <Label className="ml-2 text-green-400">{job.candidat.candidateName}</Label>
              </div>
            )}

            <CardDescription>
              <Label className="font-semibold text-gray-400">📋 Description:</Label>
              <p className="mt-1 text-gray-400 line-clamp-3">{job.description}</p>
            </CardDescription>
          </div>

          <div className="pt-4">
            <p className="text-3xl font-bold text-purple-400">
              💰 {job.dailyRate}€<span className="text-lg text-gray-400">/jour</span>
            </p>
          </div>
        </CardContent>

        {buttons && <CardFooter className="flex justify-end gap-2 pt-4 border-t border-gray-700">{buttons}</CardFooter>}
      </Card>
      <EditJobDialog key={`edit-${job.id}-${isEditDialogOpen}`} job={job} open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} onEditJob={callbacks.onEditJob} />
      <AssignCandidateDialog key={`candidate-${job.id}-${isCandidatDialogOpen}`} job={job} open={isCandidatDialogOpen} onClose={() => setIsCandidatDialogOpen(false)} onCandidateJob={callbacks.onCandidateJob} />
      <ChangeStatusDialog key={`change-status-${job.id}-${isChangeStatusDialogOpen}`} job={job} open={isChangeStatusDialogOpen} onClose={() => setIsChangeStatusDialogOpen(false)} onStatusChanged={callbacks.onStatusChanged} />
    </>
  );
};

export default JobCard;
