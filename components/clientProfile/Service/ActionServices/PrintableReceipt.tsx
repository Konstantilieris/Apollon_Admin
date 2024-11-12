"use client";
import { useServiceModal } from "@/hooks/use-service-modal";
import React from "react";

const PrintableReceipt = ({
  client,
  printRef,
}: {
  client: any;
  printRef: any;
}) => {
  const { selectedServices } = useServiceModal();

  return (
    <div ref={printRef} className="p-4">
      {/* Receipt Header */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold">ΑΠΟΛΛΩΝ ΣΧΟΛΗ ΣΚΥΛΩΝ</h1>
        <h2 className="text-xl font-bold">ΠΡΟΣΦΟΡΑ</h2>
        <p className="text-lg">
          {new Date().toLocaleDateString("el-GR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <p className="text-lg">ΠΕΛΑΤΗΣ: {client.client.name}</p>
      </div>

      {/* Services Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="py-2 text-left">Υπηρεσία</th>
            <th className="py-2 text-left">Ημερομηνία</th>
            <th className="py-2 text-right">Ποσό</th>
          </tr>
        </thead>
        <tbody>
          {selectedServices.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-center">
                Δεν υπάρχουν επιλεγμένες υπηρεσίες.
              </td>
            </tr>
          ) : (
            selectedServices.map((service) => (
              <tr key={service._id}>
                <td className="py-2">{service.serviceType}</td>
                <td className="py-2">
                  {new Date(service.date).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="py-2 text-right">{service.amount}€</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Subtotal, Tax, Total */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="font-bold">ΥΠΟΣΥΝΟΛΟ:</span>
          <span className="font-bold">
            {selectedServices.reduce((sum, service) => sum + service.amount, 0)}
            €
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">ΦΠΑ (24%):</span>
          <span className="font-bold">
            {(
              selectedServices.reduce(
                (sum, service) => sum + service.amount,
                0
              ) * 0.24
            ).toFixed(2)}
            €
          </span>
        </div>
        <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
          <span className="text-lg font-bold">ΣΥΝΟΛΟ:</span>
          <span className="text-lg font-bold">
            {(
              selectedServices.reduce(
                (sum, service) => sum + service.amount,
                0
              ) * 1.24
            ).toFixed(2)}
            €
          </span>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="mt-6 text-center">
        <p className="text-sm">Ευχαριστούμε για την προτίμηση!</p>
      </div>
    </div>
  );
};

export default PrintableReceipt;
