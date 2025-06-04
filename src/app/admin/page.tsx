import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import TableComponent from "./TableComponent";
import RequestStatisticsComponent from "../customer/RequestStatisticsComponent";
import { getAllAccessRequestCounts } from "~/server/access_request_queries";
import DatasetStatisticsComponent from "~/components/DatasetStatisticsComponent";
const page = async () => {
  const counts = await getAllAccessRequestCounts();
  return (
    <>
      {/* <TableComponent /> */}
      <DatasetStatisticsComponent />
      <RequestStatisticsComponent counts={counts} />
    </>
  );
};

export default page;
