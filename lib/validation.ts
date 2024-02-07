import * as z from "zod";

export const AdminValidation = z
  .object({
    name: z.string().min(2).max(20),
    password: z.string().min(2).max(15),
    confirm: z.string().min(2),
    role: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });
export const LogInValidation = z.object({
  name: z.string().min(2).max(20),
  password: z.string().min(2).max(15),
});
export const ClientValidation = z.object({
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  email: z.coerce.string().email().min(5),
  profession: z.string().min(2).max(20),
  birthdate: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  residence: z.string().min(2).max(20),
  address: z.string().min(2).max(20),
  city: z.string().min(2).max(20),
  telephone: z.string().min(2).max(20),
  mobile: z.string().min(2).max(20),
  name: z.string().min(2).max(20),
  gender: z.string().min(2).max(20),
  dog_birthdate: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  food: z.string().min(2).max(30),
  breed: z.string().min(2).max(40),
  behavior: z.string().min(2).max(20),
  vet: z.string().min(2).max(20),
  vetNumber: z.string().min(2).max(20),
});

export const BookingValidation = z.object({
  time_arrival: z.custom(
    (value) => value === undefined || value instanceof Date
  ) as z.ZodType<Date | undefined>,
  time_departure: z.custom(
    (value) => value === undefined || value instanceof Date
  ) as z.ZodType<Date | undefined>,
  rangeDate: z.object({
    from: z.date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    }),
    to: z.date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    }),
  }),
  client: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    id: z.string(),
  }),
  price: z.string(),
});

export const searchRoomValidation = z.object({
  rangeDate: z.object({
    from: z.date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    }),
    to: z.date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    }),
  }),
  client: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    id: z.string(),
  }),
});

export const TrainingValidation = z.object({
  name: z.string().min(1).max(20),
  client: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    id: z.string(),
  }),
  date: z.date(),
  durationHours: z.number(),
  pricePerHour: z.number(),
  notes: z.string().min(1).max(30),
});
export const TaskValidation = z.object({
  title: z.string().min(1).max(20),
  description: z.string().min(8).max(40),
  priority: z.string(),
});
