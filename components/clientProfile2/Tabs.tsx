"use client";
import React, { useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import ClientInfo from "./MainTabs/Info/ClientInfo";
import FinancialView from "./Financial/FinancialView";
import { ServiceFeesTab } from "./MainTabs/ServiceFees/ServiceFees";
import CreateBookingMulti from "./MainTabs/CreateBooking/CreateBookingMulti";
import { useSearchParams, useRouter } from "next/navigation";

interface ClientTabsProps {
  client: { _id?: string; [key: string]: any };
}

const ClientTabs = ({ client }: ClientTabsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const storageKey = React.useMemo(
    () => `clientTabsKey-${client._id}`,
    [client._id]
  );

  // Track the currently active tab
  const [activeKey, setActiveKey] = React.useState("Info");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    const savedTab = localStorage.getItem(storageKey);

    if (tabFromUrl) {
      setActiveKey(tabFromUrl);
      localStorage.setItem(storageKey, tabFromUrl);

      // Remove the query param from the URL
      const newUrl = window.location.pathname;
      router.replace(newUrl, { scroll: false });
    } else if (savedTab && !tabFromUrl) {
      setActiveKey(savedTab);
    }
  }, [searchParams, storageKey, router]);

  const handleTabChange = (key: React.Key) => {
    setActiveKey(key as string);
    localStorage.setItem(storageKey, key as string);
  };

  if (!client) return null;

  return (
    <Tabs
      fullWidth
      className="h-full w-full"
      selectedKey={activeKey}
      onSelectionChange={handleTabChange}
      classNames={{
        panel: "mt-2",
        tab: "w-full",
        tabContent: "w-full",
        tabList: "w-full",
        tabWrapper: "w-full",
      }}
    >
      <Tab key="Info" title="ΠΡΟΦΙΛ">
        <ClientInfo client={client} />
      </Tab>
      <Tab key="Financial" title="ΥΠΗΡΕΣΙΕΣ">
        <FinancialView client={client} />
      </Tab>
      <Tab key="ServiceFees" title="ΤΙΜΟΛΟΓΙΑ">
        <ServiceFeesTab client={client} />
      </Tab>
      <Tab key="booking" title="ΚΡΑΤΗΣΗ">
        <CreateBookingMulti client={client} />
      </Tab>
    </Tabs>
  );
};

export default ClientTabs;
