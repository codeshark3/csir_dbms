"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface RequestStatisticsProps {
  counts: { count: number; status: string }[];
}

const RequestStatisticsComponent = ({ counts }: RequestStatisticsProps) => {
  const getCount = (status: string) =>
    counts.find((c) => c.status === status)?.count ?? 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-yellow-600">Pending Requests</CardTitle>
          <CardDescription>
            Awaiting approval from administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">
            {getCount("pending")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Approved Requests</CardTitle>
          <CardDescription>
            Successfully approved access requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {getCount("approved")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Rejected Requests</CardTitle>
          <CardDescription>Access requests that were denied</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">
            {getCount("rejected")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestStatisticsComponent;
