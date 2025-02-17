import React from "react";
import {
  IconBrandRedux,
  IconMedal2,
  IconStarsFilled,
} from "@tabler/icons-react";

import { CardWrapperClientRow } from "../../../Layout/CardClientRow";
import ClientTags from "../Tags/ClientTags";

function ClientProfileRow({ client }: { client: any }) {
  const loyaltyStyle =
    client.loyaltyLevel === "bronze"
      ? "text-bronze"
      : client.loyaltyLevel === "silver"
        ? "text-gray-400"
        : "text-yellow-600";

  // Build the card items
  const items = [
    {
      icon: IconBrandRedux,
      value: client.status === "active" ? "Ενεργός" : "Ανενεργός",
      description: "Κατάσταση",
    },
    {
      icon: IconMedal2,
      value: client.loyaltyLevel,
      description: "Επίπεδο Πιστότητας",
      iconStyle: loyaltyStyle,
    },
    {
      icon: IconStarsFilled,
      value: client.points,
      description: "Πόντοι",
      iconStyle: "text-yellow-600",
    },
  ];

  return (
    <div className="flex w-full items-end justify-between">
      <ClientTags clientTags={client.tags} client={client} />

      {items.map((item, idx) => (
        <CardWrapperClientRow
          key={idx}
          item={item}
          iconStyle={item.iconStyle}
        />
      ))}
    </div>
  );
}

export default ClientProfileRow;
