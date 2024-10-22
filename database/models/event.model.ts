import mongoose, { Schema, model, models } from "mongoose";

export interface IEvent {
  Id: Schema.Types.ObjectId;
  Subject: String;
  Description?: string;
  Type?: string;
  StartTime: Date;
  EndTime: Date;

  RecurrenceRule?: string;
  categoryId: number;
  Color?: string;
  Location?: string;
  isArrival?: boolean;
  clientName?: string;
  clientId?: Schema.Types.ObjectId;
  mobile?: string;
  isTransport?: string;
  dogsData?: [
    {
      dogId: Schema.Types.ObjectId;
      roomId: Schema.Types.ObjectId;
      dogName?: string;
      roomName?: string;
    },
  ];
}
const EventSchema = new mongoose.Schema<IEvent>({
  Id: {
    type: String,
    required: true,
  },

  Subject: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
  },
  Location: {
    type: String,
  },
  Description: {
    type: String,
  },

  Color: {
    type: String,
  },
  clientName: {
    type: String,
  },
  clientId: { type: Schema.Types.ObjectId, ref: "Client" },
  mobile: {
    type: String,
  },

  dogsData: [
    {
      dogId: { type: Schema.Types.ObjectId, ref: "Dog" },
      roomId: { type: Schema.Types.ObjectId, ref: "Room" },
      roomName: { type: String },
      dogName: { type: String },
    },
  ],
  categoryId: {
    type: Number,

    default: 1,
  },
  isTransport: {
    type: String,
  },
  isArrival: {
    type: Boolean,
  },

  RecurrenceRule: {
    type: String,
  },
  StartTime: {
    type: Date,
    required: true,
  },
  EndTime: {
    type: Date,
    required: true,
  },
});

const Appointment =
  models.Appointment || model<IEvent>("Appointment", EventSchema);

export default Appointment;
