import { ScrollArea } from "@/components/ui/scroll-area";
import { useCommandMenuStore } from "@/hooks/command-menu-store";
import {
  deleteConstantValue,
  getConstant,
  pushValueOnConstant,
  updateConstantsValue,
} from "@/lib/actions/constant.action";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { Skeleton } from "@heroui/skeleton";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
const CommandValueList = ({
  onChange,
  formValue,
  isForm,
  defaultMenuType,
}: any) => {
  const {
    values,

    setValues,

    searchValue,

    menuType,
    editValue,
    setEditValue,
    setLoading,
    loading,
    deleteValue,
    setDeleteValue,
    isCreate,
    setIsCreate,
  } = useCommandMenuStore();
  const [filteredValues, setFilteredValues] = React.useState(values);
  const [inputValue, setInputValue] = React.useState("");

  const pathname = usePathname();

  useEffect(() => {
    const fetchValues = async () => {
      setLoading(true);
      try {
        const data = await getConstant(defaultMenuType ?? menuType);
        setValues(data.value);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchValues();
  }, [defaultMenuType, menuType]);
  useEffect(() => {
    if (!values) return;
    setFilteredValues(
      values.filter((value) =>
        value.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, values]);
  if (!values) return null;
  const handleEditClick = (value: string) => {
    setEditValue(value);
    setInputValue(value);
  };

  const handleSaveEdit = async () => {
    if (editValue && inputValue.trim()) {
      console.log("hit");
      try {
        const updateVal = await updateConstantsValue({
          type: defaultMenuType ?? defaultMenuType,
          newValue: inputValue,
          oldValue: editValue,
        });
        if (updateVal) {
          toast.success("Η τιμή ενημερώθηκε επιτυχώς.");
        }
        // optimistic update
        const newValues = values.map((value) =>
          value === editValue ? inputValue : value
        );
        setValues(newValues);
      } catch (error) {
        toast.error("Η ενημέρωση της τιμής απέτυχε.");
      } finally {
        setEditValue(null);
        setInputValue("");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditValue(null);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };
  const handleClickCard = (value: string) => {
    if (formValue === value) {
      onChange("");
      return;
    }
    onChange(value);
    setEditValue(null);
    setInputValue("");
  };
  const handleKeyPressCreate = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreate();
    } else if (e.key === "Escape") {
      handleCancelCreate();
    }
  };
  const handleCreate = async () => {
    // optimistic update
    const newValues = [...values, inputValue];
    setValues(newValues);
    if (inputValue.trim()) {
      try {
        const createVal = await pushValueOnConstant({
          type: defaultMenuType,
          value: inputValue,
          path: pathname, // Add the appropriate path value here
        });
        if (createVal) {
          toast.success("Η τιμή δημιουργήθηκε επιτυχώς.");
        }
      } catch (error) {
        toast.error("Η δημιουργία της τιμής απέτυχε.");
        // revert optimistic update
        const newValues = values.filter((val) => val !== inputValue);
        setValues(newValues);
      } finally {
        setIsCreate(false);
        setInputValue("");
      }
    }
  };
  const handleCancelCreate = () => {
    setIsCreate(false);
    setInputValue("");
  };
  const onDelete = async (value: string) => {
    setDeleteValue(value);
    try {
      const deleteVal = await deleteConstantValue(defaultMenuType, value);
      if (deleteVal) {
        toast.success("Η τιμή διαγράφηκε επιτυχώς.");
      }
      const newValues = values.filter((val) => val !== value);
      setValues(newValues);
    } catch (error) {
      toast.error("Η διαγραφή της τιμής απέτυχε.");
      // revert optimistic update
      const newValues: any = [...values, deleteValue];
      setValues(newValues);
    } finally {
      setDeleteValue("");
    }
  };
  if (isCreate)
    return (
      <div className="mb-auto flex h-full  w-full items-start justify-items-center">
        <div className="mt-2 flex h-[40px] w-full flex-row gap-2  px-2 ">
          <Input
            autoFocus
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyPressCreate}
            placeholder="Δώστε τιμή"
            className="flex-1 font-sans"
          />
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              color="success"
              variant="flat"
              onPress={handleCreate}
            >
              <Icon icon="lucide:check" className="h-4 w-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="flat"
              onPress={handleCancelCreate}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  return (
    <ScrollArea className="mb-12 flex-1">
      {filteredValues.map((value, index) => (
        <Skeleton isLoaded={!loading} key={value + index}>
          <Card
            className={cn("w-full", {
              "bg-neutral-950/80": formValue === value,
            })}
          >
            <CardBody className="flex items-center justify-between p-3">
              {editValue === value ? (
                <div className="flex w-full items-center gap-2">
                  <Input
                    autoFocus
                    value={inputValue}
                    onValueChange={setInputValue}
                    onKeyDown={handleKeyPress}
                    placeholder="Δώστε τιμή"
                    className="flex-1 font-sans"
                  />
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      color="success"
                      variant="flat"
                      onPress={handleSaveEdit}
                    >
                      <Icon icon="lucide:check" className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={handleCancelEdit}
                    >
                      <Icon icon="lucide:x" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "flex flex-row items-center gap-2 justify-between w-full pl-4"
                  )}
                  key={index + value}
                >
                  <div className="flex-1 font-sans tracking-widest text-default-700">
                    {value}
                  </div>
                  <div className="flex gap-2 self-end">
                    {isForm && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="success"
                        onPress={() => handleClickCard(value)}
                      >
                        <Icon icon="lucide:check" className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => handleEditClick(value)}
                    >
                      <Icon icon="lucide:edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => onDelete(value)}
                    >
                      <Icon icon="lucide:trash" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Skeleton>
      ))}
    </ScrollArea>
  );
};

export default CommandValueList;
