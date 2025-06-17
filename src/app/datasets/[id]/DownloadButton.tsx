"use client";

import { Button } from "~/components/ui/button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
}

const DownloadButton = ({
  fileUrl,
  fileName,
  fileType,
}: DownloadButtonProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-2 hover:bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <p className="font-medium">{fileName}</p>
          <p className="text-sm text-gray-500">{fileType}</p>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => window.open(fileUrl, "_blank", "noopener,noreferrer")}
      >
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
    </div>
  );
};

export default DownloadButton;
