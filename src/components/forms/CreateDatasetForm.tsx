"use client";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SelectItem } from "../ui/select";
import CustomFormField from "~/components/CustomFormField";
import { Form } from "~/components/ui/form";
import { FormFieldType } from "~/components/CustomFormField";
import { toast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { datasetSchema } from "~/schemas";
import { years, divisions } from "~/constants";
import { insertDataset } from "~/server/dataset_queries";
import { useRouter } from "next/navigation";
import { useUploadThing } from "~/utils/uploadthing";
import { X } from "lucide-react";

const CreateDatasetForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { startUpload } = useUploadThing("datasetUploader");

  const form = useForm<z.infer<typeof datasetSchema>>({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      title: "",
      year: "",
      pi_name: "",
      description: "",
      division: "",
      fileUrls: [],
      papers: [],
      tags: "",
    },
  });

  // Retry file upload function with exponential backoff
  const uploadWithRetry = async (files: File[], retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await startUpload(files);
        if (!result || result.length === 0) {
          throw new Error("Upload failed");
        }
        return result;
      } catch (err) {
        if (attempt === retries) throw err;
        await new Promise((res) => setTimeout(res, 1000 * attempt)); // exponential backoff
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof datasetSchema>) => {
    if (files.length === 0) {
      toast({
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    const datasetId = uuidv4();

    startTransition(async () => {
      try {
        const uploadResult = await uploadWithRetry(files);

        if (!uploadResult || uploadResult.length === 0) {
          toast({
            description: "Upload failed. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log("Upload result:", uploadResult); // for dev only

        const fileUrls = uploadResult.map((result) => result.ufsUrl);

        const result = await insertDataset({
          values: {
            ...values,
            fileUrls,
          },
          fileUrl: fileUrls[0] || "",
          fileType: fileUrls[0]?.split(".").pop() || "",
          fileName: fileUrls[0]?.split("/").pop() || "",
          datasetId,
        });

        if (result.success) {
          toast({
            description: "Dataset created successfully",
            variant: "default",
            className: "bg-emerald-500 text-white font-bold",
          });
          router.push("/datasets");
        }
      } catch (error) {
        console.error(error);
        toast({
          description: "An error occurred during upload. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="title"
          label="Dataset Name"
          placeholder="Dataset Name"
        />

        <div className="flex gap-2">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="year"
            label="Year of Start"
            placeholder="Year of Start"
          >
            {years.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="division"
            label="Division"
            placeholder="Select Division"
          >
            {divisions.map((division) => (
              <SelectItem key={division} value={division}>
                {division}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="pi_name"
          label="Principal Investigator"
          placeholder="Name of Principal Investigator"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          name="description"
          label="Description"
          placeholder="Description"
        />

        <div>
          {(form.watch("papers") || []).map((paper, index) => (
            <div key={index} className="mb-4 flex items-center gap-2">
              <div className="w-1/2">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name={`papers.${index}.title`}
                  label="Paper Title"
                  placeholder="Paper Title"
                />
              </div>
              <div className="w-1/2">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name={`papers.${index}.url`}
                  label="Paper URL"
                  placeholder="Paper URL"
                />
              </div>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const papers = form.getValues("papers") || [];
                    papers.splice(index, 1);
                    form.setValue("papers", papers);
                  }}
                  className="mt-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const papers = form.getValues("papers") || [];
              form.setValue("papers", [...papers, { title: "", url: "" }]);
            }}
          >
            Add Paper
          </Button>
        </div>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="tags"
          label="Tags"
          placeholder="Tags"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Dataset Files</label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isPending}
            className="w-full"
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
            multiple
          />
          {files.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">Selected files:</p>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <span className="text-sm text-gray-600">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || files.length === 0}
        >
          {isPending ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateDatasetForm;
