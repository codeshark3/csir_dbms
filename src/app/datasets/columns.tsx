"use client";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import RequestAccessModal from "../datasets/[id]/RequestAccessModal";
import DeleteDatasetButton from "~/components/DeleteDatasetButton";

import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Dataset = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  year: string;
  pi_name: string;
  tags: string | null;
  papers: string | null;
  division: string;
  description: string;
  user_id: string | null;
  additionalFileUrls: string[];
};

// export type SavedDataset = {
//   id: number;
//   userId: string;
//   datasetId: string;
//   title: string | null;
//   status: string | null;
// };

export const columns = (isAdmin: boolean): ColumnDef<Dataset>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dataset Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="font-medium">
          {title.length > 50 ? `${title.slice(0, 50)}...` : title}
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: "Year Of Start",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("year")}</div>;
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = (row.getValue("description") as string) || "";
      const truncatedDescription =
        description.length > 100
          ? `${description.slice(0, 100)}...`
          : description;
      return <div className="font-medium">{truncatedDescription}</div>;
    },
  },

  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as string | null;
  //     return (
  //       <span
  //         className={`rounded-md px-2 py-1 text-center text-sm font-medium ${
  //           status === "approved"
  //             ? "bg-emerald-500 text-white"
  //             : status === "rejected"
  //               ? "bg-red-500 text-white"
  //               : "bg-gray-500 text-white"
  //         }`}
  //       >
  //         {status ?? "not requested"}
  //         {/* {status === "not requested" && (
  //           <RequestAccessModal
  //             datasetId={row.getValue("id")}
  //             datasetTitle={row.getValue("title")}
  //           />
  //         )} */}
  //       </span>
  //     );
  //   },
  // },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const dataset = row.original;

  //     return (
  //       <div className="flex items-center gap-2">
  //         <Link
  //           href={`/datasets/${dataset.id}`}
  //           className="text-sm text-blue-600 hover:underline"
  //         >
  //           View Details
  //         </Link>
  //         {isAdmin && (
  //           <DeleteDatasetButton
  //             datasetId={dataset.id}
  //             datasetTitle={dataset.title}
  //             isAdmin={isAdmin}
  //           />
  //         )}
  //       </div>
  //     );
  //   },
  // },
];
