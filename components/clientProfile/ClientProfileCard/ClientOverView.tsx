import React from "react";

import { CardWrapperClientRow } from "../Layout/CardClientRow";
import { IconMoneybag } from "@tabler/icons-react";

const ClientOverView = ({ client }: any) => {
  return (
    <div className=" flex w-full items-end justify-end gap-20">
      <CardWrapperClientRow
        item={{
          icon: IconMoneybag,
          value: client.totalSpent,
          description: "ΠΛΗΡΩΜΕΝΑ",
        }}
        hasEuro={true}
        className="dark:border-green-500"
      />
      <CardWrapperClientRow
        item={{
          icon: IconMoneybag,
          value: client.owesTotal,
          description: "ΟΦΕΙΛΟΜΕΝΑ",
        }}
        hasEuro={true}
        className="dark:border-red-500"
      />
    </div>
  );
};

export default ClientOverView;
