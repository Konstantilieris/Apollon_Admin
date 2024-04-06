import { Schema, models, model } from "mongoose";
export interface IService {
  service: Schema.Types.ObjectId;
  amount: number;
  date: Date;
  serviceType: "Booking" | "Transportation" | "OtherService" | string;
  paid: boolean;
}
export interface ILocation {
  residence?: String;
  address?: String;
  city?: String;
  postalCode?: String;
}
export interface IDog {
  name: string;
  gender: string;
  birthdate: Date;
  food: string;
  breed: string;
  behavior: string;
  microchip?: string;
}
export interface IClient {
  firstName: string;
  lastName: string;
  email?: string;
  profession?: string;
  birthdate?: Date;
  location?: ILocation;
  phone: {
    telephone?: string;
    mobile: string;
    work_phone?: string;
  };
  _id?: string;
  createdAt?: Date;
  owes?: IService[];

  dog?: IDog;
  vet?: string;
  vetNumber?: string;
  emergencyContact?: string;
}
export const DogSchema = new Schema<IDog>({
  name: {
    type: String,
    required: true,
  },
  microchip: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
  },
  food: {
    type: String,
  },
  breed: {
    type: String,
  },
  behavior: {
    type: String,
  },
});
const ServiceSchema = new Schema<IService>({
  service: {
    type: Schema.Types.ObjectId,
    refPath: "owes.serviceType",
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
});
const ClientSchema = new Schema<IClient>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  profession: {
    type: String,
  },
  birthdate: {
    type: Date,
  },
  location: {
    residence: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
  },
  phone: {
    telephone: {
      type: String,
    },
    mobile: {
      type: String,
    },
    work_phone: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owes: [ServiceSchema],
  dog: [DogSchema],
  vet: {
    type: String,
  },
  vetNumber: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
});
const Client = models.Client || model<IClient>("Client", ClientSchema);

export default Client;
