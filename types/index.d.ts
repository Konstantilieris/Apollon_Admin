import { Schema } from "mongoose";
import { ILocation, IReference } from "../database/models/client.model";
import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

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
export type Expense = {
  id?: string;
  amount: number;
  taxAmount: number;
  totalAmount?: number;
  date: string;
  description: string;
  category: string;
  paymentMethod: string;
  vendor?: {
    name?: string;
    contactInfo?: string;
    serviceType?: string;
  };
  notes?: string;
  status: "pending" | "paid" | "overdue";
};
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
export interface CreateTrainingParams {
  name: string;
  clientId: string;
  price: number;
  date: Date;
  dogs: { dogId: any; dogName: any }[];
  timeArrival: string;
  timeDeparture: string;
  notes: string;
  path: string;
}
export interface DogProp {
  name: string;
  _id: any;
  gender: string;
  birthdate?: Date;
  food?: string;
  breed?: string;
  behavior?: string;
  microchip?: string;
  note?: string;
  dead?: boolean;
  deathDate?: Date;
  weight?: number;
  sterilized?: boolean;
  medicalHistory?: [
    {
      illness: string;
      treatment: {
        name: string;
        frequency: string;
        notes: string;
      };
    },
  ];
  likes?: [
    {
      clientId: Schema.Types.ObjectId;
      dogName: string;
    },
  ];
}
export interface ClientProfileProps {
  email?: string;
  profession?: string;
  _id: string;
  location?: ILocation;
  phone: {
    telephone?: string;
    mobile?: string;
    work_phone?: string;
    emergencyContact?: string;
  };
  serviceFees: { type: String; value: number }[];
  createdAt?: Date;
  owes?: Schema.Types.ObjectId[];
  references?: {
    isReferenced?: IReference;
    hasReferenced?: [
      {
        name?: string;
        clientId?: Schema.Types.ObjectId;
      },
    ];
  };
  dog: DogProp[];
  vet?: {
    name: string;
    phone: string;
    work_phone?: string;
  };
  roomPreference: string;

  isTraining?: boolean;
  notes?: string;
  name: string;
  points?: number;
}
