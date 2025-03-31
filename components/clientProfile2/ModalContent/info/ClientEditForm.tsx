/* eslint-disable react/jsx-no-undef */
import React, { Suspense } from "react";
import UpdateClientForm from "@/components/form/UpdateClientForm";
import { useModalStore } from "@/hooks/client-profile-store";
import { getConstant } from "@/lib/actions/constant.action";

const ClientEditForm = () => {
  const { modalData } = useModalStore();
  const [professions, setProfessions] = React.useState([]);
  React.useEffect(() => {
    const fetchProfessions = async () => {
      const data = await getConstant("Professions");
      console.log("professions", data);
      setProfessions(data);
    };
    fetchProfessions();
  }, [modalData]);
  if (!modalData?.client || !professions) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <UpdateClientForm client={modalData.client} />
      </div>
    </Suspense>
  );
};

export default ClientEditForm;
