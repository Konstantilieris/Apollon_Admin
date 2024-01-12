import React from "react";

import { URLProps } from "@/types";
import { getClientById } from "@/lib/actions/client.action";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateString } from "@/lib/utils";

const Client = async ({ params, searchParams }: URLProps) => {
  const { id } = params;
  const client = await getClientById(id);

  return (
    <>
      <div className="flex flex-col-reverse items-center  p-8 sm:flex-row">
        <div className="flex flex-1 flex-col items-start gap-4 lg:flex-row">
          <Image
            src={"/assets/images/dog_client.webp"}
            alt="profile picture"
            width={300}
            height={300}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900 font-noto_sans">
              {client.lastName}
            </h2>
            <p className=" text-dark200_light800 mt-1 font-noto_sans text-lg font-bold">
              {client.firstName}
            </p>
            <p className="font-noto_sans font-semibold">
              {" "}
              created At {formatDateString(client.createdAt)}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5"></div>
          </div>
        </div>
        <div className="flex self-start max-sm:mb-5 max-sm:w-full sm:mt-3">
          <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3 font-bold hover:animate-pulse">
            Edit Profile
          </Button>
        </div>
      </div>
      <div className="mt-10 flex w-full flex-row items-center justify-center gap-10 ">
        <Tabs defaultValue="top-posts" className="">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab font-bold">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className=" tab font-bold">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts"></TabsContent>
          <TabsContent
            value="answers"
            className=" flex w-full flex-col gap-6"
          ></TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Client;
