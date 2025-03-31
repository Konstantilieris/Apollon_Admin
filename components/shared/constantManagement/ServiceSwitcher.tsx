import React from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  deleteClientService,
  updateClientServiceType,
} from "@/lib/actions/client.action";

interface Service {
  type: string;
  value: string;
}

interface ServiceSwitcherProps {
  className?: string;
  placeholder?: string;
  heading?: string;
  selectedItem: string | null;
  setSelectedItem: (value: string) => void;
  setAmount: (value: string) => void;
  client: any;
  items: any;
}

export const ServiceSwitcher = ({
  className = "",
  placeholder = "Select a service",
  heading = "Services",
  selectedItem,
  client,
  setAmount,
  setSelectedItem,
  items,
}: ServiceSwitcherProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Local copies for optimistic UI
  const [serviceFees, setServiceFees] = React.useState<Service[]>(
    client?.serviceFees ?? []
  );
  const [servicePreferences, setServicePreferences] = React.useState<string[]>(
    client?.servicePreferences ?? []
  );

  // Editing an existing service
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");

  // Per-item loading indicator
  const [loadingType, setLoadingType] = React.useState<string | null>(null);

  // Creating a new preferred service
  const [isCreating, setIsCreating] = React.useState(false);
  const [newServiceName, setNewServiceName] = React.useState("");
  const [newServiceValue, setNewServiceValue] = React.useState("");

  // 1) Filter only preferred services from local state
  const preferredServices = React.useMemo(() => {
    return serviceFees.filter((service) =>
      servicePreferences.includes(service.type)
    );
  }, [serviceFees, servicePreferences]);

  // Select a service (just set the chosen one in parent state)
  const handleSelect = (service: Service) => {
    setSelectedItem(service.type);
    setAmount(service.value);
    setIsOpen(false);
  };

  // Start editing
  const handleEdit = (service: Service) => {
    setIsEditing(service.type);
    setEditValue(service.type);
  };

  // Save an edited service name
  const handleSaveEdit = async (oldType: string) => {
    if (!editValue.trim() || editValue === oldType) {
      setIsEditing(null);
      return;
    }

    const oldServiceFees = [...serviceFees];
    const oldServicePreferences = [...servicePreferences];
    const oldSelectedItem = selectedItem;

    // Optimistic rename
    setServiceFees((prev) =>
      prev.map((svc) =>
        svc.type === oldType ? { ...svc, type: editValue } : svc
      )
    );

    if (oldServicePreferences.includes(oldType)) {
      setServicePreferences((prev) =>
        prev.map((pref) => (pref === oldType ? editValue : pref))
      );
    }

    if (selectedItem === oldType) {
      setSelectedItem(editValue);
    }

    try {
      setLoadingType(oldType);
      await updateClientServiceType(client._id, oldType, editValue);
    } catch (error) {
      // revert on error
      console.error("Error updating service:", error);
      setServiceFees(oldServiceFees);
      setServicePreferences(oldServicePreferences);
      if (oldSelectedItem !== selectedItem) {
        setSelectedItem(oldSelectedItem || "");
      }
    } finally {
      setLoadingType(null);
      setIsEditing(null);
    }
  };

  // Delete an existing preferred service
  const handleDelete = async (type: string) => {
    const oldServiceFees = [...serviceFees];
    const oldPreferences = [...servicePreferences];
    const oldSelectedItem = selectedItem;
    const oldAmount =
      client?.serviceFees.find((s: any) => s.type === type)?.value || "";

    // Optimistic remove
    setServiceFees((prev) => prev.filter((svc) => svc.type !== type));
    setServicePreferences((prev) => prev.filter((pref) => pref !== type));

    if (selectedItem === type) {
      setSelectedItem("");
      setAmount("");
    }

    try {
      setLoadingType(type);
      await deleteClientService(client._id, type);
    } catch (error) {
      // revert on error
      console.error("Error deleting preference:", error);
      setServiceFees(oldServiceFees);
      setServicePreferences(oldPreferences);
      setSelectedItem(oldSelectedItem || "");
      setAmount(oldAmount);
    } finally {
      setLoadingType(null);
    }
  };

  // Add a new service and mark it preferred locally
  const handleAddService = () => {
    if (!newServiceName.trim() || !newServiceValue.trim()) return;

    // Create new service object
    const newService: Service = {
      type: newServiceName,
      value: newServiceValue,
    };

    // Add to local state
    setServiceFees((prev) => [...prev, newService]);
    // Mark as preferred
    setServicePreferences((prev) => [...prev, newServiceName]);

    // If you have a server creation flow, handle it here with try/catch & revert
    // For now, purely local

    // Reset
    setIsCreating(false);
    setNewServiceName("");
    setNewServiceValue("");
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          className={`w-full items-center justify-between ${className}`}
          variant="flat"
          endContent={<Icon icon="lucide:chevrons-up-down" />}
          startContent={<Icon icon="lucide:star" />}
        >
          {selectedItem || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[90vw] max-w-[600px] p-0 font-sans">
        <div className="flex w-full flex-col gap-2 p-4">
          <div className="font-medium tracking-widest text-default-700">
            {heading}
          </div>

          {/*  ONLY Preferred Services */}
          <div className="border-t border-default-200 pt-2">
            <div className="mb-2 text-base font-medium text-warning">
              Προτιμήσεις
            </div>
            {preferredServices.map((service) => (
              <div key={service.type} className="mb-2 flex items-center gap-2">
                {isEditing === service.type ? (
                  <div className="flex flex-1 gap-2">
                    <Input
                      value={editValue}
                      onValueChange={setEditValue}
                      placeholder="Service name"
                      size="sm"
                    />
                    <Button
                      size="sm"
                      color="primary"
                      isDisabled={loadingType === service.type}
                      onPress={() => handleSaveEdit(service.type)}
                    >
                      <Icon icon="lucide:check" />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => setIsEditing(null)}
                    >
                      <Icon icon="lucide:x" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      className="flex-1 justify-start"
                      variant="flat"
                      onPress={() => handleSelect(service)}
                      startContent={<Icon icon="lucide:star" />}
                    >
                      {service.type}
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(service)}
                      isDisabled={!!loadingType}
                    >
                      <Icon icon="lucide:edit" />
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      isDisabled={loadingType === service.type}
                      onPress={() => handleDelete(service.type)}
                    >
                      <Icon icon="lucide:trash" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/*  Add a new (preferred) service */}
          <div className="mt-4 border-t border-default-200 pt-2">
            {!isCreating ? (
              <Button
                variant="light"
                onPress={() => setIsCreating(true)}
                startContent={<Icon icon="lucide:plus" />}
              >
                Προσθήκη νέας υπηρεσίας
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    size="sm"
                    label="Όνομα"
                    value={newServiceName}
                    onValueChange={setNewServiceName}
                    color="secondary"
                  />
                  <Input
                    size="sm"
                    label="Κόστος"
                    value={newServiceValue}
                    color="secondary"
                    onValueChange={setNewServiceValue}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      onPress={handleAddService}
                      isDisabled={!newServiceName || !newServiceValue}
                    >
                      <Icon icon="lucide:check" />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        setIsCreating(false);
                        setNewServiceName("");
                        setNewServiceValue("");
                      }}
                    >
                      <Icon icon="lucide:x" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default ServiceSwitcher;
