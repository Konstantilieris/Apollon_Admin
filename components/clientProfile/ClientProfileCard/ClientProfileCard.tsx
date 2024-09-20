import { cn, formatDateString } from "@/lib/utils";

import ClientIcon from "./ClientIcon";
import ClientLoyalty from "./ClientLoyalty";
import ClientTags from "./ClientTags";
import { getConstant } from "@/lib/actions/constant.action";

export async function ClientProfileCard({ client }: any) {
  const tagRes = await getConstant("Tags");

  return (
    <div className=" w-full min-w-[15vw] max-w-[16vw] self-end  ">
      <div
        className={cn(
          " relative card h-36 bg-[#12002b] rounded-md shadow-md shadow-purple-800  min-w-[16vw] mx-auto flex flex-col justify-between p-4"
        )}
      >
        <div className="absolute left-0 top-0 h-full w-full  opacity-0 "></div>
        <div className="z-10 flex flex-row items-center space-x-4">
          <ClientIcon id={client._id} />
          <div className="flex flex-col">
            <p className="relative z-10 text-base font-normal text-light-900">
              {client?.name}
            </p>
            <p className="text-sm text-light-700">
              {formatDateString(client.createdAt)}
            </p>
          </div>
        </div>
        <div className=" flex w-full items-center justify-between gap-3 pl-2">
          <ClientLoyalty loyaltyLevel={client.loyaltyLevel} />
          <ClientTags
            clientTags={client.tags}
            allTags={tagRes}
            client={client}
          />
        </div>
      </div>
    </div>
  );
}
