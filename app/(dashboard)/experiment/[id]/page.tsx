"use client";
import React from "react";
import { Tabs, Tab } from "@heroui/react";
const page = () => {
  return (
    <section>
      <Tabs
        fullWidth
        classNames={{
          panel: "mt-2",
        }}
      >
        <Tab key="posts" title="Posts"></Tab>
        <Tab key="likes" title="Likes"></Tab>
        <Tab key="comments" title="Media"></Tab>
      </Tabs>
    </section>
  );
};

export default page;
