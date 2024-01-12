import { Schema, models, model } from "mongoose";

export interface IClient {
  firstName: string;
  lastName: string;
  email: string;
  profession?: string;
  birthdate?: Date;
  location?: {
    residence: string;
    address?: string;
    city?: string;
  };
  phone?: {
    telephone?: string;
    mobile?: string;
  };
  _id?: string;
  createdAt?: Date;
  owes?: number;
  totalSpent?: number;
  dog?: {
    name?: string;
    gender?: string;
    birthdate?: Date;
    food?: string;
    breed?: string;
    behavior?: string;
    vet?: string;
    vetNumber?: string;
  };
}
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
    },
    address: {
      type: String,
    },
    city: {
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owes: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },

  dog: {
    name: {
      type: String,
    },
    gender: {
      type: String,
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
    vet: {
      type: String,
    },
    vetNumber: {
      type: String,
    },
  },
});
const Client = models.Client || model<IClient>("Client", ClientSchema);

export default Client;
