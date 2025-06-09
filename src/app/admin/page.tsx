import RequestStatisticsComponent from "../customer/RequestStatisticsComponent";
import { getAllAccessRequestCounts } from "~/server/access_request_queries";
import DatasetStatisticsComponent from "~/components/DatasetStatisticsComponent";
const page = async () => {
  const counts = await getAllAccessRequestCounts();
  return (
    <div className="flex flex-col gap-4">
      {/* <TableComponent /> */}
      <DatasetStatisticsComponent />
      <RequestStatisticsComponent counts={counts} />
    </div>
  );
};

export default page;
