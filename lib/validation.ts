import * as z from "zod";
import { getDatesInRange, isRoomAvailable } from "./utils";

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
  dog_name: z.string().min(2).max(20),
  dog_gender: z.string().min(2).max(20),
  dog_birthdate: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  dog_food: z.string().min(2).max(20),
  dog_breed: z.string().min(2).max(20),
  dog_behavior: z.string().min(2).max(20),
  dog_vet: z.string().min(2).max(20),
  dog_vetNumber: z.string().min(2).max(20),
});

export const BookingValidation = z
  .object({
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
    unavailableDates: z.date().array().optional(),
  })
  .refine(
    (data) => {
      return isRoomAvailable(
        data.unavailableDates,
        getDatesInRange(data.rangeDate.from, data.rangeDate.to)
      );
    },
    { message: "Μη διαθέσιμες ημερομηνίες", path: ["rangeDate"] }
  );
