import Link from "next/link";
import React from "react";
import { utapi } from "~/server/uploadthing";

import { Button } from "~/components/ui/button";
import {
  Calendar,
  User,
  Tag,
  FileText,
  Building2,
  Download,
  Edit,
} from "lucide-react";

import DownloadButton from "./DownloadButton";
import RequestAccessModal from "./RequestAccessModal";
import {
  checkPendingRequest,
  hasApprovedAccess,
} from "~/server/access_request_queries";
import SaveDatasetButton from "./SaveDatasetButton";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { getDatasetById } from "~/server/dataset_queries";
import Loader from "~/components/Loader";
import DeleteDatasetButton from "~/components/DeleteDatasetButton";

const DatasetDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user_role = session?.user.role;
  const user_id = session?.user.id;
  const { id } = await props.params;
  const dataset = await getDatasetById(id);
  const hasPendingRequest = user_id
    ? await checkPendingRequest(id, user_id)
    : false;
  const hasAccess = user_id
    ? await hasApprovedAccess(id, user_id, user_role ?? "user")
    : false;

  if (!dataset) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Dataset not found
          </h2>
          <p className="mt-2 text-gray-600">
            The dataset you're looking for doesn't exist.
          </p>
          <Link href="/datasets">
            <Button className="mt-4">Return to Datasets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const data = dataset as {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    files: {
      fileUrl: string;
      fileType: string;
      fileName: string;
    }[];
    tags?: string;
    papers?: string;
    year: string;
    pi_name: string;
    division: string;
    description: string;
  };

  return (
    <div className="mx-auto w-full px-4 py-8">
      <div className="mb-6 flex-col items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">{data.title}</h1>
        <div className="mt-1 space-x-3">
          <div className="flex items-center gap-2">
            <Link href="/datasets">
              <Button variant="outline" className="h-10">
                Back to Datasets
              </Button>
            </Link>

            <RequestAccessModal
              datasetTitle={data.title}
              datasetId={data.id}
              disabled={hasPendingRequest || hasAccess}
            />
            <SaveDatasetButton
              datasetId={data.id}
              disabled={hasPendingRequest}
            />
            {/* Actions Section */}
            {/* Removed RequestAccessButton and duplicate SaveDatasetButton */}
            <div className="flex items-center gap-4">
              {/* Actions for admin/staff are below */}
              {user_role === "admin" && (
                <DeleteDatasetButton
                  datasetId={data.id}
                  datasetTitle={data.title}
                  isAdmin={true}
                />
              )}
              {user_role === "admin" || user_role === "staff" ? (
                <Link href={`/datasets/${id}/update`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Dataset
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6 shadow-sm">
        {/* Metadata Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">
              Year of Start:
            </span>
            <span className="text-sm text-primary">{data.year}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">
              Principal Investigator:
            </span>
            <span className="text-sm text-primary">{data.pi_name}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">Division:</span>
            <span className="text-sm text-primary">{data.division}</span>
          </div>

          {data.tags && (
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {data.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Description
          </h3>
          <p className="text-gray-700">{data.description}</p>
        </div>

        {/* Papers Section */}
        {data.papers && (
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-primary">
              Related Papers
            </h2>
            <div className="space-y-2">
              {(() => {
                try {
                  const papers = JSON.parse(data.papers);
                  return papers.map(
                    (paper: { title: string; url: string }, index: number) => (
                      <div key={index} className="rounded-md bg-gray-50 p-4">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div className="flex w-full justify-between gap-2 p-2">
                            <div className="w-1/2">
                              <div className="flow-text break-words text-gray-700">
                                {paper.title}
                              </div>
                            </div>
                            <div className="w-1/2">
                              <a
                                href={paper.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {paper.url}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  );
                } catch (e) {
                  return null;
                }
              })()}
            </div>
          </div>
        )}
        {data.files.length > 0 && hasAccess && (
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-primary">
              Dataset Files
            </h2>
            <div className="space-y-2">
              {data.files.map((file, index) => (
                <DownloadButton
                  key={index}
                  fileUrl={file.fileUrl}
                  fileName={file.fileName}
                  fileType={file.fileType}
                />
              ))}
            </div>
          </div>
        )}
        {/* Metadata Footer */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              Created: {new Date(data.createdAt).toLocaleDateString()}
            </span>
            <span>
              Last updated: {new Date(data.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailsPage;
