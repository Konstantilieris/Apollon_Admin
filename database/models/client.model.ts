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
  note?: string;
  dead?: boolean;
}
export interface IReference {
  clientId?: Schema.Types.ObjectId;
  google?: boolean;
  other?: string;
}
export interface IClient {
  email?: string;
  profession?: string;
  _id?: Schema.Types.ObjectId;
  location?: ILocation;
  phone: {
    telephone?: string;
    mobile?: string;
    work_phone?: string;
    emergencyContact?: string;
  };
  serviceFees?: { type: String; value: Number }[];
  createdAt?: Date;
  owes?: Schema.Types.ObjectId[];
  references?: {
    isReferenced?: IReference;
    hasReferenced?: IReference[];
  };
  dog?: IDog;
  vet?: {
    name: string;
    phone: string;
  };
  isTraining?: boolean;
  notes?: string;
  name: string;
  points?: number;
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
  note: {
    type: String,
    default: null,
  },
  dead: {
    type: Boolean,
    default: false,
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
    emergencyContact: {
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
    name: { type: String },
    phone: { type: String },
  },
  references: {
    isReferenced: ReferenceSchema,
    hasReferenced: [{ type: Schema.Types.ObjectId, ref: "Client" }],
  },
  isTraining: {
    type: Boolean,
  },
  notes: {
    type: String,
  },
  serviceFees: [
    {
      type: { type: String },
      value: { type: Number },
    },
  ],
  points: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
});
const Client = models.Client || model<IClient>("Client", ClientSchema);

export default Client;
