import React from "react";

import ServicesList from "./Owes/OwedServices";
import { Tab, Tabs } from "@heroui/react";
import PaymentList from "./Payment/PaymentList";
import PaidServicesList from "./History/PaidServicesList";

const FinancialView = ({ client }: any) => {
  const storageKey = React.useMemo(
    () => `financialTabKey-${client?._id}`,
    [client?._id]
  );
  const [activeKey, setActiveKey] = React.useState("Owes");
  React.useEffect(() => {
    // On mount, read from localStorage (if exists)
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem(storageKey);
      if (savedTab) {
        setActiveKey(savedTab);
      }
    }
  }, [storageKey]);

  const handleTabChange = (key: React.Key) => {
    setActiveKey(key as string);
    // Persist the new active tab
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, key as string);
    }
  };
  return (
    <div className="flex h-full w-full">
      <Tabs
        isVertical={true}
        aria-label="Financial tabs"
        className="h-full w-full"
        classNames={{
          base: " min-h-[70vh] max-w-[10vw] min-w-[8vw]",
          panel: "flex-1 min-w-[83vw]",
          tabList: "absolute top-1/2 transform -translate-y-1/2",
          tab: "",
          tabContent: "w-full h-full text-base",
        }}
        selectedKey={activeKey}
        onSelectionChange={handleTabChange}
      >
        <Tab key="Owes" title="Οφειλές">
          <div className="h-full w-full">
            <ServicesList client={client} />
          </div>
        </Tab>
        <Tab key="Paid" title="Πληρώθηκε">
          <div className="h-full w-full">
            <PaymentList client={client} />
          </div>
        </Tab>
        <Tab key="History" title="Ιστορικό">
          <PaidServicesList client={client} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default FinancialView;
