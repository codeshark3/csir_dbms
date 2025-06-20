"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { Dataset, columns } from "./columns";
import { datasetSchema } from "~/schemas";
import { z } from "zod";

// Uncomment and use this interface
interface TableComponentProps {
  initialData: Dataset[];
  isAdmin: boolean;
}

export default function TableComponent({
  initialData,
  isAdmin,
}: TableComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<Dataset[]>(initialData);

  return (
    <div>
      <DataTable
        columns={columns(isAdmin)}
        data={initialData}
        globalFilter={searchQuery}
        setGlobalFilter={setSearchQuery}
      />
    </div>
  );
}
