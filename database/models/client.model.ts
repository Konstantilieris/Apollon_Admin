import { Schema, models, model } from "mongoose";
export interface IService {
  service: Schema.Types.ObjectId;
  amount: number;
  date: Date;
  serviceType: "Booking" | "Transportation" | "OtherService" | string;
}
export interface ILocation {
  residence: String;
  address: String;
  city: String;
}
export interface IDog {
  name: string;
  gender: string;
  birthdate: Date;
  food: string;
  breed: string;
  behavior: string;
}
export interface IClient {
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  birthdate: Date;
  location: ILocation;
  phone: {
    telephone: string;
    mobile: string;
  };
  _id?: string;
  createdAt?: Date;
  owes?: IService[];
  totalSpent?: number;
  dog?: IDog;
  vet: string;
  vetNumber: string;
}
export const DogSchema = new Schema<IDog>({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  food: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  behavior: {
    type: String,
    required: true,
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
    required: true,
    unique: true,
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
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  phone: {
    telephone: {
      type: String,
    },
    mobile: {
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
    required: true,
  },
  vetNumber: {
    type: String,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
});
const Client = models.Client || model<IClient>("Client", ClientSchema);

export default Client;
