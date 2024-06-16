import { Schema, models, model } from "mongoose";

export interface ILocation {
  residence?: String;
  address?: String;
  city?: String;
  postalCode?: String;
}
export interface IDog {
  name: string;
  gender: string;
  birthdate?: Date;
  food?: string;
  breed?: string;
  behavior?: string;
  microchip?: string;
}
export interface IReference {
  clientId?: Schema.Types.ObjectId;
  google?: boolean;
  other?: string;
}
export interface IClient {
  firstName: string;
  lastName: string;
  email?: string;
  profession?: string;

  location?: ILocation;
  phone: {
    telephone?: string;
    mobile?: string;
    work_phone?: string;
  };
  bookingPerDay?: number;
  createdAt?: Date;
  owes?: Schema.Types.ObjectId[];
  reference?: IReference;
  dog?: IDog;
  vet?: string;
  vetNumber?: string;
  isTraining?: boolean;
  emergencyContact?: string;
  notes?: string;
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
export const ReferenceSchema = new Schema<IReference>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  google: {
    type: Boolean,
  },
  other: {
    type: String,
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
  owes: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  dog: [DogSchema],

  vet: {
    type: String,
  },
  vetNumber: {
    type: String,
  },
  reference: ReferenceSchema,
  isTraining: {
    type: Boolean,
  },
  notes: {
    type: String,
  },
  bookingPerDay: {
    type: Number,
    default: 30,
  },

  emergencyContact: {
    type: String,
  },
});
const Client = models.Client || model<IClient>("Client", ClientSchema);

export default Client;
