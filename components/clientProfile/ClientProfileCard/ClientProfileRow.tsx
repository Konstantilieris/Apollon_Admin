import ClientLoyalty from "./ClientLoyalty";
import ClientTags from "./ClientTags";

import ClientPoints from "./ClientPoints";
import ClientStatus from "./ClientStatus";

export function ClientProfileRow({ client }: { client: any }) {
  return (
    <div className=" flex w-full items-end justify-between ">
      <ClientTags clientTags={client.tags} client={client} />
      <ClientStatus status={client.status} />
      <ClientLoyalty loyaltyLevel={client.loyaltyLevel} />
      <ClientPoints points={client.points} />
    </div>
  );
}
