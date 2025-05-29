"use client";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import RequestAccessModal from "../datasets/[id]/RequestAccessModal";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AccessRequest = {
  id: number;
  createdAt: string;

  userId: string;
  datasetId: number;
  reason: string;
  status: string;
  dataset_title: string;
};

export type SavedDataset = {
  id: number;
  userId: string;
  datasetId: string;
  title: string | null;
  status: string | null;
};

export const columns: ColumnDef<SavedDataset>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Dataset Title",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("title")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | null;
      return (
        <span
          className={`rounded-md px-2 py-1 text-sm font-medium ${
            status === "approved"
              ? "bg-emerald-500 text-white"
              : status === "rejected"
                ? "bg-red-500 text-white"
                : "bg-gray-500 text-white"
          }`}
        >
          {status ?? "not requested"}
          {/* {status === "not requested" && (
            <RequestAccessModal
              datasetId={row.getValue("id")}
              datasetTitle={row.getValue("title")}
            />
          )} */}
        </span>
      );
    },
  },
];
