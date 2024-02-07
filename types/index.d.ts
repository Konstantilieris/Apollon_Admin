export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}
export interface ParamsProps {
  params: { id: string };
}
export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}
export interface CreateClientParams {
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  residence: string;
  address: string;
  city: string;
  telephone: string;
  mobile: string;
  birthdate: Date;
  name: string;
  gender: string;
  food: string;
  breed: string;
  behavior: string;
  vet: string;
  vetNumber: string;
  dog_birthdate: Date;
}
export interface getAllClientParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}
export type Id = string | number;
export type ColumnT = {
  id: Id;
  title: string;
};
export interface updateTaskProps {
  id: string;
  path: string;
}
