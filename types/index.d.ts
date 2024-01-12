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
    dog_name: string;
    dog_gender: string;
    dog_food: string;
    dog_breed: string;
    dog_behavior: string;
    dog_vet: string;
    dog_vetNumber: string;
    dog_birthdate: Date;

}
export interface getAllClientParams{
  page?:number;
  pageSize?:number;
  filter?:string;
  searchQuery?:string;
}