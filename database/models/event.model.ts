import mongoose, { model, models } from "mongoose";
interface IEvent {
  Id: mongoose.Schema.Types.ObjectId;
  Subject: string;
  Description: string;
  StartTime: Date;
  Type: string;
  EndTime: Date;
}
const EventSchema = new mongoose.Schema<IEvent>({
  Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Subject: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
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
