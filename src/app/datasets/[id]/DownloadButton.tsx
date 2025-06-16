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
}: DownloadButtonProps) => (
  <div className="flex flex-col gap-2">
    <p className="text-sm text-gray-500">{fileName}</p>
    <p className="text-sm text-gray-500">{fileType}</p>
    <Button
      variant="secondary"
      className="h-10"
      onClick={() => window.open(fileUrl, "_blank", "noopener,noreferrer")}
    >
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  </div>
);

export default DownloadButton;
