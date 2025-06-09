"use client";

import { useTransition, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "~/hooks/use-toast";
import { datasetSchema } from "~/schemas/index";
import { updateDataset, getDatasetById } from "~/server/dataset_queries";
import { Form } from "~/components/ui/form";
import { FormFieldType } from "~/components/CustomFormField";
import CustomFormField from "~/components/CustomFormField";
import { Button } from "~/components/ui/button";
import * as z from "zod";
import { SelectItem } from "~/components/ui/select";
import { years, divisions } from "~/constants";

const getDefaultValues = async (id: string) => {
  const data = await getDatasetById(id);
  if (!data?.[0]) {
    throw new Error("Dataset not found");
  }
  const dataset = data[0];
  return {
    title: dataset.title,
    year: String(dataset.year),
    pi_name: dataset.pi_name,
    description: dataset.description,
    division: String(dataset.division),
    papers: dataset.papers ? JSON.parse(dataset.papers) : [],
    tags: dataset.tags ?? "",
  };
};

const formFields = [
  {
    type: FormFieldType.INPUT,
    name: "title",
    label: "Dataset Name",
    placeholder: "Dataset Name",
  },
  {
    type: FormFieldType.SELECT,
    name: "year",
    label: "Year of Start",
    placeholder: "Year of Start",
    options: years,
  },
  {
    type: FormFieldType.INPUT,
    name: "pi_name",
    label: "Principal Investigator",
    placeholder: "Name of Principal Investigator",
  },
  {
    type: FormFieldType.SELECT,
    name: "division",
    label: "Division",
    placeholder: "Select Division",
    options: divisions,
  },
  {
    type: FormFieldType.TEXTAREA,
    name: "description",
    label: "Description",
    placeholder: "Dataset Description",
  },
  {
    type: FormFieldType.INPUT,
    name: "tags",
    label: "Tags",
    placeholder: "Dataset Tags",
  },
];

const showErrorToast = (description: string) => {
  toast({
    description,
    variant: "destructive",
  });
};

const UpdateDatasetForm = () => {
  const { id } = useParams() as { id: string };
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof datasetSchema>>({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      title: "",
      year: "",
      pi_name: "",
      description: "",
      division: "",
      papers: [],
      tags: "",
    },
  });

  useEffect(() => {
    getDefaultValues(id)
      .then((defaults) => {
        form.reset(defaults);
      })
      .catch((err) => {
        console.error(err);
        showErrorToast("Failed to load dataset");
      });
  }, [id]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "papers",
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof datasetSchema>) => {
      startTransition(() => {
        updateDataset(id, values)
          .then((data) => {
            if (data.success) {
              toast({
                description: "Dataset updated successfully",
                variant: "default",
                className: "bg-emerald-500 text-white font-bold",
              });
              router.push(`/datasets/${id}`);
            } else {
              showErrorToast("An error occurred while updating the dataset");
            }
          })
          .catch((err) => {
            console.error(err);
            showErrorToast("An unexpected error occurred");
          });
      });
    },
    [id, router],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formFields.map((field) =>
          field.type === FormFieldType.SELECT ? (
            <CustomFormField
              key={field.name}
              control={form.control}
              fieldType={field.type}
              name={field.name}
              label={field.label}
              placeholder={field.placeholder}
            >
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </CustomFormField>
          ) : (
            <CustomFormField
              key={field.name}
              control={form.control}
              fieldType={field.type}
              name={field.name}
              label={field.label}
              placeholder={field.placeholder}
            />
          ),
        )}

        <div>
          <label className="mb-1 block font-medium">Papers</label>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-2 flex items-end gap-2">
              <input
                className="input input-bordered flex-1 rounded border px-2 py-1"
                placeholder="Paper Title"
                {...form.register(`papers.${index}.title` as const)}
              />
              <input
                className="input input-bordered flex-1 rounded border px-2 py-1"
                placeholder="Paper URL"
                {...form.register(`papers.${index}.url` as const)}
              />
              <button
                type="button"
                className="btn btn-error rounded bg-red-500 px-2 py-1 text-white"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary rounded bg-blue-600 px-3 py-1 text-white"
            onClick={() => append({ title: "", url: "" })}
          >
            Add Paper
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update Dataset"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateDatasetForm;
