import * as z from "zod";
export const ExpenseSchema = z.object({
  amount: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    },
    z
      .number({ invalid_type_error: "το πεδιο πρέπει να είναι αριθμός" })
      .nonnegative({
        message: "Το ποσό πρέπει να ειναι θετικό",
      })
  ),
  taxAmount: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    },
    z.number({ invalid_type_error: "το πεδιο πρέπει να είναι αριθμός" })
  ),
  date: z.string(),

  category: z.string(),
  paymentMethod: z.string(),
  vendor: z
    .object({
      name: z.string().nullable(),
      contactInfo: z.string().nullable(),
      serviceType: z.string().nullable(),
    })
    .nullable(),
  notes: z.string(),
  status: z.enum(["pending", "paid", "overdue"]),
});

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
  name: z
    .string()
    .min(2, { message: "Πρέπει να είναι τουλάχιστον 2 χαρακτήρες" })
    .max(20),
  password: z
    .string()
    .min(2, { message: "Πρέπει να είναι τουλάχιστον 2 χαρακτήρες" })
    .max(15),
});
export const EmailValidation = z.object({
  email: z
    .string()
    .min(5, { message: "Το email πρέπει να έχει τουλάχιστον 5 χαρακτήρες." }) // Prevents very short emails
    .max(254, { message: "Το email είναι πολύ μεγάλο." }) // RFC 5321 max length for emails
    .email({ message: "Μη έγκυρη μορφή email." }) // Ensures valid email format
    .trim(), // Trims whitespace
});

export const ExpensesValidation = z.object({
  description: z.string().optional(),

  amount: z.string(),
  date: z.date(),
});
export const ChargeValidation = z.object({
  serviceType: z.string(),
  amount: z.string(),
  date: z.date(),
});
export const IncomeValidation = z.object({
  serviceType: z.string(),
  notes: z.string().optional(),
  amount: z.string(),
  date: z.date(),
});
export const ClientValidation = z.object({
  name: z
    .string()
    .min(2, { message: "Το όνομα πρέπει να έχει τουλάχιστον δύο χαρακτήρες" })
    .max(40),
  email: z.string().optional(),
  profession: z.string().optional(),
  numberOfDogs: z.string(),
  residence: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  telephone: z.string().optional(),

  mobile: z.string().min(6, {
    message: "Το τηλέφωνο πρέπει να είναι τουλάχιστον 6 χαρακτήρες",
  }),
  emergencyContact: z.string().optional(),
  workMobile: z.string().optional(),
  vetName: z.string().optional(),
  vetNumber: z.string().optional(),
  vetLocation: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  vetWorkPhone: z.string().optional(),
});
export const UpdateClientValidation = z.object({
  name: z.string().min(2).max(40),
  email: z.string().optional(),
  profession: z.string().optional(),

  residence: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  telephone: z.string().optional(),
  mobile: z.string().min(6, {
    message: "Το τηλέφωνο πρέπει να είναι τουλάχιστον 6 χαρακτήρες",
  }),
  emergencyContact: z.string().optional(),
  workMobile: z.string().optional(),
  vetName: z.string().optional(),
  vetNumber: z.string().optional(),
  vetWorkPhone: z.string().optional(),
  vetLocation: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }),
});

export const DogValidation = z.object({
  dogs: z.array(
    z.object({
      name: z
        .string()
        .min(2, {
          message: "Το όνομα πρέπει να είναι μεγαλύτερο απο δύο χαρακτήρες",
        })
        .max(20, {
          message: "Το όνομα πρέπει να είναι μικρότερο απο 20 χαρακτήρες",
        }),
      gender: z.string(),
      birthdate: z
        .string()
        .optional()
        .refine(
          (val) => !val || !isNaN(Date.parse(val)),
          "Δεν ειναι σωστή η ημερομηνία!"
        ),
      food: z.string().optional(),
      breed: z.string().optional(),
      behavior: z.string().optional(),
      microchip: z.string().optional(),
      sterilized: z.boolean().optional(),
    })
  ),
});
export const SingleDogValidation = z.object({
  name: z
    .string()
    .min(2, {
      message: "Το όνομα πρέπει να είναι μεγαλύτερο απο δύο χαρακτήρες",
    })
    .max(20, {
      message: "Το όνομα πρέπει να είναι μικρότερο απο 20 χαρακτήρες",
    }),
  gender: z.string(),
  birthdate: z.string(),

  food: z.string().optional(),
  breed: z.string().optional(),
  behavior: z.string().optional(),
  microchip: z.string().optional(),
  sterilized: z.boolean().optional(),
});

export const BookingValidation1 = z.object({
  rangeDate: z.object({
    from: z.date({
      required_error: "Διάλεξε ημερομηνία",
      invalid_type_error: "That's not a date!",
    }),
    to: z.date({
      required_error: "Διάλεξε ημερομηνία",
      invalid_type_error: "That's not a date!",
    }),
  }),
  client: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().optional(),
    id: z.string(),
  }),
});
export const BookingValidation2 = z.object({
  time_arrival: z.custom((value) => value instanceof Date) as z.ZodType<Date>,
  time_departure: z.custom((value) => value instanceof Date) as z.ZodType<Date>,
});
export const searchRoomValidation = z.object({
  rangeDate: z.object({
    from: z.date({
      required_error: "Διάλεξε ημερομηνία",
      invalid_type_error: "That's not a date!",
    }),
    to: z.date({
      required_error: "Διάλεξε ημερομηνία",
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

export const TrainingValidation1 = z.object({
  name: z.string().min(1).max(20),
  client: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    id: z.string(),
  }),
  date: z.date(),
});
export const TrainingValidation2 = z.object({
  time_arrival: z.custom((value) => value instanceof Date) as z.ZodType<Date>,
  time_departure: z.custom((value) => value instanceof Date) as z.ZodType<Date>,
  totalprice: z.string(),
  notes: z.string().min(1).max(80).optional(),
});
export const TaskValidation = z.object({
  title: z.string().min(1).max(20),
  description: z.string().min(8).max(40),
  priority: z.string(),
});
export const TransportationValidation = z.object({
  delivery_time: z.custom((value) => value instanceof Date) as z.ZodType<Date>,
  pickup_time: z.custom((value) => value instanceof Date) as z.ZodType<Date>,
  notes: z.string().optional(),
});
