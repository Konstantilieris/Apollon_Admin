import React, { useEffect } from "react";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

import { formatCurrency } from "@/lib/utils";
import { BookingDetails } from "./BookingDetails";
import { PaymentsList } from "./Paymentlist";
import { useModalStore } from "@/hooks/client-profile-store";
import { getServiceView } from "@/lib/actions/service.action";

const ServiceDetails = () => {
  const { modalData } = useModalStore();
  const { serviceId } = modalData || {};
  const [service, setService] = React.useState<any>(null);
  const [payments, setPayments] = React.useState<any>(null);
  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!serviceId) return;
        const { service, payments } = await getServiceView({ serviceId });
        if (service) {
          const data = JSON.parse(service);
          const paymentData = JSON.parse(payments);
          if (paymentData) {
            setPayments(paymentData);
          }
          setService(data);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchService();
  }, [serviceId]);
  if (!serviceId) return null;
  if (!service) return null;

  return (
    <div className="mx-auto min-w-[30vw] max-w-[700px] space-y-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-widest">
          Λεπτομέρειες Υπηρεσίας
        </h1>
        <Chip
          color={service.paid ? "success" : "danger"}
          className="p-4 text-lg"
          size="lg"
          variant="flat"
          startContent={
            <Icon
              icon={service.paid ? "lucide:check-circle" : "lucide:x-circle"}
              className="text-xl"
            />
          }
        >
          {service.paid ? "Εξοφλημένη" : "Μη εξοφλημένη"}
        </Chip>
      </div>

      <Card>
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:briefcase" className="text-2xl text-default-500" />
          <div className="flex flex-col">
            <p className="text-base">{service.serviceType}</p>
            <p className="text-small text-default-500">ID: {service._id}</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base text-default-500">Ποσό</p>
              <p className="text-medium">{formatCurrency(service.amount)}</p>
            </div>
            <div>
              <p className="text-base text-default-500">Έκπτωση</p>
              <p className="text-medium">
                {formatCurrency(service.discount ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-base text-default-500">Πληρωμένο Ποσό</p>
              <p className="text-medium">
                {formatCurrency(service.paidAmount ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-base text-default-500">Υπόλοιπο</p>
              <p className="text-medium">
                {formatCurrency(service.remainingAmount ?? 0)}
              </p>
            </div>
            <div className="col-span-2">
              <Divider className="my-2" />
            </div>
            <div>
              <p className="text-base text-default-500">Ημερομηνία</p>
              <p className="text-medium">
                {new Date(service.date).toLocaleDateString()}
              </p>
            </div>
            {service.paymentDate && (
              <div>
                <p className="text-base text-default-500">
                  Ημερομηνία Πληρωμής
                </p>
                <p className="text-medium">
                  {new Date(service.paymentDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {service?.bookingId && <BookingDetails booking={service.bookingId} />}

      <PaymentsList payments={payments || []} serviceId={serviceId} />
    </div>
  );
};
export default ServiceDetails;
