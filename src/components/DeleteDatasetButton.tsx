"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteDataset } from "~/server/dataset_queries";

interface DeleteDatasetButtonProps {
  datasetId: string;
  datasetTitle: string;
  isAdmin: boolean;
}

export default function DeleteDatasetButton({
  datasetId,
  datasetTitle,
  isAdmin,
}: DeleteDatasetButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Only render for admin users
  if (!isAdmin) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDataset(datasetId);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Success",
        description: result.message,
      });
      setIsOpen(false);
      router.push("/datasets");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete dataset",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete Dataset
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dataset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{datasetTitle}&quot;? This
              action cannot be undone. All related data including files, access
              requests, and saved references will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
