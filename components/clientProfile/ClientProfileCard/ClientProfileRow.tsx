import ClientTags from "./ClientTags";
import {
  IconBrandRedux,
  IconMedal2,
  IconStarsFilled,
} from "@tabler/icons-react";

import React from "react";

import { CardWrapperClientRow } from "../Layout/CardClientRow";

function ClientProfileRow({ client }: { client: any }) {
  const loyaltyStyle =
    client.loyaltyLevel === "bronze"
      ? "text-bronze"
      : client.loyaltyLevel === "silver"
        ? "text-gray-400"
        : "text-yellow-600";

  return (
    <div className=" flex w-full items-end justify-between ">
      <ClientTags clientTags={client.tags} client={client} />

      <CardWrapperClientRow
        item={{
          icon: IconBrandRedux,
          value: client.status === "active" ? "Ενεργός" : "Ανενεργός",
          description: "Κατάσταση",
        }}
      />
      <CardWrapperClientRow
        item={{
          icon: IconMedal2,
          value: client.loyaltyLevel,
          description: "Επίπεδο Πιστότητας",
        }}
        iconStyle={loyaltyStyle}
      />
      <CardWrapperClientRow
        item={{
          icon: IconStarsFilled,
          value: client.points,
          description: "Πόντοι",
        }}
        iconStyle="text-yellow-600"
      />
    </div>
  );
}
export default ClientProfileRow;
