import { getDatasetStatistics } from "~/server/dataset_queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default async function DatasetStatisticsComponent() {
  const [totalDatasets, totalRequests, totalUsers] =
    await getDatasetStatistics();
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Total Datasets</CardTitle>
          <CardDescription>Number of datasets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {totalDatasets}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Total Requests</CardTitle>
          <CardDescription>Number of requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {totalRequests}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Total Users</CardTitle>
          <CardDescription>Number of users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{totalUsers}</div>
        </CardContent>
      </Card>
    </div>
  );
}
