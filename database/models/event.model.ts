import mongoose, { Schema, model, models } from "mongoose";

interface IEvent {
  Id: Schema.Types.ObjectId;
  Subject: String;
  Description?: string;
  Type?: string;
  StartTime: Date;
  EndTime: Date;
  isReadonly?: boolean;
  RecurrenceRule?: string;
  Color?: string;
  Location?: string;
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

  isReadonly: {
    type: Boolean,
    default: false,
  },
  Color: {
    type: String,
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
