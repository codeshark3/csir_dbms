import { getAllAccessRequestCounts } from "~/server/access_request_queries";
import DatasetStatisticsComponent from "~/components/DatasetStatisticsComponent";
import RequestStatisticsComponent from "../customer/RequestStatisticsComponent";

const page = async () => {
  const counts = await getAllAccessRequestCounts();
  return (
    <div className="flex flex-col gap-4">
      <DatasetStatisticsComponent />
      <RequestStatisticsComponent counts={counts} />
    </div>
  );
};

export default page;
