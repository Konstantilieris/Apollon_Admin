/* eslint-disable no-unused-vars */
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
export interface Booking {
  _id: string;
  client: {
    clientId: string;
    clientName: string;
    phone: string;
    location: string;
    transportFee: number;
    bookingFee: number;
  };
  fromDate: Date | null;
  toDate: Date | null;
  arrivalTime: string;
  departureTime: string;
  extraDay: boolean;
  services: string[];
  dogs: {
    id: string;
    name: string;
    roomId: string;
    roomName: string;
  }[];
  flag1: boolean;
  flag2: boolean;
  totalAmount: number;
}

export interface Dog {
  id: string;
  name: string;
  gender: string;
  birthdate: Date;
  food: string;
  breed: string;
  behavior: string;
  microchip: string;
  note: string;
  weight: number;
  dead: boolean;
  deathDate: Date;
  sterilized: boolean;
  suspended: boolean;
  medicalHistory: {
    illness: string;
    treatment: {
      name: string;
      frequency: string;
      notes: string;
    };
  }[];
  likes: {
    clientId: string;
    dogName: string;
  }[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Service {
  id: string;
  serviceType: string;
  date: string;
  endDate: string;
  amount: number;
  discount: number;
  taxRate: number;
  notes?: string;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "Paid" | "Partially Paid" | "Unpaid";
}
export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface Location {
  residence: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export interface ClientProfile {
  name: string;
  email: string;
  profession: string;
  location: Location;
  phone: {
    telephone: string;
    mobile: string;
    work_phone: string;
    emergencyContact: string;
  };
  serviceFees: {
    type: string;
    value: number;
  }[];
  createdAt: Date;
  owes: string[];
  points: number;
  lastActivity: Date;
  owesTotal: number;
  totalSpent: number;
  credit: number;
  dogs: Dog[];
  vet: {
    name: string;
    phone: string;
    work_phone: string;
    location: {
      address: string;
      city: string;
      postalCode: string;
    };
  };
  references: {
    isReferenced: {
      client: { clientId: string; name: string };
      google: boolean;
      other: string;
    };
    hasReferenced: {
      name: string;
      clientId: string;
    }[];
  };
  isTraining: boolean;
  notes: string;
  tags: string[];
  status: string;
  servicePreferences: string[];
  roomPreference: string;
  loyaltyLevel: string;
  dailyBookingFees: {
    oneDog: number;
    twoDogs: number;
    threeDogs: number;
    additionalDog: number;
  };
  monthlySpending: MonthlySpending[];
}

export interface IPayment {
  serviceId?: string; // Changed from Schema.Types.ObjectId
  clientId: string; // Changed from Schema.Types.ObjectId
  amount: number;
  date: Date;
  notes?: string;
  reversed?: boolean;
  allocations?: {
    serviceId: string; // Changed from Schema.Types.ObjectId
    amount: number;
  }[];
}

export interface IService {
  serviceType: string;
  amount: number;
  clientId: string; // Changed from Schema.Types.ObjectId
  date: Date;
  paid: boolean;
  bookingId?: string; // Changed from Schema.Types.ObjectId
  paymentDate?: Date | null;
  endDate?: Date;
  notes?: string;
  paidAmount?: number;
  remainingAmount?: number;
  payments?: string[]; // Changed from Schema.Types.ObjectId[]
  discount?: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount?: number;
}
export interface Client {
  _id: string;
  name: string;
  email?: string;
}

export interface ServiceAllocation {
  serviceId: string;
  amount: number;
}

export interface Payment {
  _id: string;
  clientId: string;
  amount: number;
  date: string;
  notes?: string;
  reversed?: boolean;
  allocations?: ServiceAllocation[];
}

export interface ViewPayment {
  id: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface ViewBooking {
  id: string;
  fromDate: string;
  toDate: string;
  location: string;
  summary: string;
}

export interface ViewService {
  id: string;
  serviceType: string;
  amount: number;
  discount?: number;
  totalAmount: number;
  paidAmount?: number;
  remainingAmount?: number;
  paid: boolean;
  paymentDate?: string;
  bookingId?: string;
  payments: string[]; // assuming it's an array of payment IDs
  createdAt: string;
  updatedAt: string;
}
export interface AllocationInfo {
  id: string; // _id of the service
  serviceType: string; // type of service
  startDate?: Date; // optional start date
  endDate?: Date; // optional end date
  amount: number; // amount allocated to this service
}

export interface PaymentRow {
  id: string; // _id from the database
  date: Date; // payment date
  clientName: string; // populated from clientId
  service?: {
    id: string;
    serviceType: string; // serviceType from Service
    date?: Date;
    endDate?: Date;
  };
  amount: number; // payment amount
  notes?: string; // optional notes
  reversed: boolean; // true if reversed/refunded
  allocations: AllocationInfo[]; // breakdown of allocation per service
}

// Current filter state for the table
export interface PaymentFilters {
  search: string; // free-text search value
  reversedFilter:
    | "reversed" // only reversed=true
    | "notReversed"; // only reversed=false
  dateRange: [Date | null, Date | null]; // [start, end]
}

// Bulk action handlers passed in from parent
export interface BulkActionHandlers {
  onReverseSelected: (ids: string[]) => void;
  onExportSelected: (ids: string[]) => void;
  onDeleteSelected: (ids: string[]) => void;
}

// Single-row action handlers
export interface RowActionHandlers {
  onViewDetails: (id: string) => void;
  onReverse: (id: string) => void;
  onEditNotes: (id: string) => void;
  onDelete: (id: string) => void;
}

// Props for the PaymentsTable component
export interface PaymentsTableProps {
  initialData: PaymentRow[]; // page=1, limit=10
  totalAmount: number;
  totalPages: number;
  weeklyRevenue: any; // sum of all matching payments
}
