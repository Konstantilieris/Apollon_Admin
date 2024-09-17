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
  suspended?: boolean;
  likes?: [
    {
      clientId: Schema.Types.ObjectId;
      dogName: string;
    },
  ];
}

export interface IReference {
  client?: {
    clientId: Schema.Types.ObjectId;
    name: string;
  };
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
    hasReferenced?: [
      {
        name?: string;
        clientId?: Schema.Types.ObjectId;
      },
    ];
  };
  dog?: IDog[];
  vet?: {
    name: string;
    phone: string;
    work_phone?: string;
  };
  roomPreference?: string;

  isTraining?: boolean;
  notes?: string;
  name: string;
  points?: number;
  lastActivity?: Date;
  tags?: string[];
  status?: string;
  owesTotal?: number;
  totalSpent?: number;
  servicePreferences?: string[];
  loyaltyLevel?: string;
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
  deathDate: {
    type: Date,
  },
  weight: {
    type: Number,
  },

  sterilized: {
    type: Boolean,
    default: false,
  },
  suspended: {
    type: Boolean,
    default: false,
  },
  medicalHistory: [
    {
      illness: {
        type: String,
      },
      treatment: {
        name: {
          type: String,
        },
        frequency: {
          type: String,
        },
        notes: {
          type: String,
        },
      },
    },
  ],
  likes: [
    {
      clientId: { type: Schema.Types.ObjectId, ref: "Client" },
      dogName: { type: String },
    },
  ],
});
export const ReferenceSchema = new Schema<IReference>({
  client: {
    clientId: { type: Schema.Types.ObjectId, ref: "Client" },
    name: { type: String },
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
    work_phone: { type: String },
  },
  references: {
    isReferenced: ReferenceSchema,
    hasReferenced: [
      {
        name: { type: String },
        clientId: { type: Schema.Types.ObjectId, ref: "Client" },
      },
    ],
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
  roomPreference: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  lastActivity: {
    type: Date,
  },
  tags: {
    type: [String], // e.g., ["vip", "high spender", "regular"]
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  owesTotal: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  servicePreferences: {
    type: [String], // e.g., ["grooming", "training"]
  },
  loyaltyLevel: {
    type: String,
    enum: ["bronze", "silver", "gold", "platinum"],
    default: "bronze",
  },
});
ClientSchema.pre("save", function (next) {
  const client = this; // Accessing the client document

  // Update loyalty level based on points
  if (client.isModified("points")) {
    if (client.points! >= 10000) {
      client.loyaltyLevel = "platinum"; // Platinum level for 10000+ points
    } else if (client.points! >= 5000) {
      client.loyaltyLevel = "gold"; // Gold level for 5000+ points
    } else if (client.points! >= 1000) {
      client.loyaltyLevel = "silver"; // Silver level for 1000+ points
    } else {
      client.loyaltyLevel = "bronze"; // Bronze level for less than 1000 points
    }
  }

  next(); // Move to the next middleware or save operation
});
const Client = models.Client || model<IClient>("Client", ClientSchema);

export default Client;
