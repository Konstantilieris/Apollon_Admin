"use client";
import CommandMenuProvider from "@/components/shared/CommandMenu/CommandMenuProvider";
import { toast } from "sonner";
import { CommandMenuType } from "@/hooks/command-menu-store";
import {
  handleAddClientTag,
  handleDeleteTag,
} from "@/lib/actions/client.action";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

import React from "react";

const TagManager = ({ tags, id }: any) => {
  const [newTag, setNewTag] = React.useState<string>("");

  const [optimisticTags, setOptimisticTags] = React.useState<string[]>(tags);
  const handleDelete = async (tag: string) => {
    setOptimisticTags((prev) => prev.filter((t) => t !== tag));
    try {
      const res = await handleDeleteTag({
        clientId: id,
        tag,
      });
      if (res.success) {
        toast.success(`Η ετικέτα ${tag} διαγράφηκε επιτυχώς`);
      }
    } catch (error) {
      toast.error(`Η διαγραφή της ετικέτας ${tag} απέτυχε`);
      setOptimisticTags((prev) => [...prev, tag]);
    }
  };
  const handleAddTag = async (tag: string) => {
    setOptimisticTags((prev) => [...prev, tag]);
    setNewTag("");
    try {
      const res = await handleAddClientTag({
        clientId: id,
        tag,
      });
      if (res.success) {
        toast.success(`Η ετικέτα ${tag} προστέθηκε επιτυχώς`);
      }
    } catch (error) {
      toast.error(`Η προσθήκη της ετικέτας ${tag} απέτυχε`);
      setOptimisticTags((prev) => prev.filter((t) => t !== tag));
    }
  };
  return (
    <div className="flex gap-2 pb-1 pt-2">
      {(optimisticTags ?? []).length > 0 &&
        (optimisticTags ?? []).map((tag: string, index: number) => (
          <Badge
            key={index + tag}
            color="danger"
            className="text-center text-lg hover:scale-110"
            onClick={() => handleDelete(tag)}
            classNames={{
              badge: "flex items-center justify-center ",
            }}
            variant="faded"
            shape="circle"
            content={"-"}
          >
            <Chip radius="full" size="md" variant="flat">
              {tag}
            </Chip>
          </Badge>
        ))}
      {newTag && (
        <Badge
          color="success"
          className="text-center text-lg hover:scale-110"
          onClick={() => handleAddTag(newTag)}
          classNames={{
            badge: "flex items-center justify-center ",
          }}
          variant="faded"
          shape="circle"
          content={"+"}
        >
          <Chip radius="full" size="md" variant="flat">
            {newTag}
          </Chip>
        </Badge>
      )}
      <CommandMenuProvider
        isForm={true}
        disabled={true}
        value={newTag}
        defaultMenuType={CommandMenuType.Tags}
        onChange={setNewTag}
        hasTrigger={true}
        TriggerComponent={
          <Icon
            icon="akar-icons:plus"
            color="green"
            className=" ml-4 self-center rounded-xl ring-1 ring-green-700 hover:scale-105"
          />
        }
      />
    </div>
  );
};

export default TagManager;
