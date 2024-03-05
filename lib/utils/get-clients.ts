import "server-only";
import { cache } from "react";
import { getAllClients } from "../actions/client.action";
export const preloadClients = () => {
  // eslint-disable-next-line no-void
  void getClients();
};

export const getClients = cache(async () => {
  const clients = JSON.parse(await getAllClients());
  return clients;
});
