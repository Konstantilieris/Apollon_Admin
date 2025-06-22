import { SidebarLink } from "@/types";

export const HomePageFilters = [
  { name: "Καινούργια", value: "newest" },
  { name: "Παλιά", value: "oldest" },
];
export const ADMIN = "66c753da1234567800000014";
export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Αρχική",
  },
  {
    imgURL: "/assets/icons/dashboard.svg",
    route: "/main",
    label: "Επισκόπηση",
  },

  {
    imgURL: "/assets/icons/form.svg",
    route: "/form",
    label: "Εισαγωγή Πελάτη",
  },
  {
    imgURL: "/assets/icons/client.svg",
    route: "/clients",
    label: "Πελάτες",
  },
  {
    imgURL: "/assets/icons/calendar.svg",
    route: "/calendar",
    label: "Ημερολόγιο",
  },
  {
    imgURL: "/assets/icons/reservation.svg",
    route: "/booking",
    label: "Κρατήσεις",
  },

  {
    imgURL: "/assets/icons/chart.svg",
    route: "/logistics",
    label: "Ανάλυση",
  },

  {
    imgURL: "/assets/icons/expenses.svg",
    route: "/expenses",
    label: "Έξοδα",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/training",
    label: "Εκπαίδευση",
  },
];
export const mainCategoryColors = [
  "#FF6347",
  "#4682B4",
  "#32CD32",
  "#FFD700",
  "#9370DB",
  "#008080",
  "#8B4513",
  "#4169E1",
  "#FFA07A",
  "#556B2F",
  "#800080",
  "#20B2AA",
  "#FF69B4",
  "#000080",
];
export const Priority = [1, 2, 3];
export const TypesOfGender = ["Αρσενικό", "Θηλυκό"];
export const TypesOfFood = [
  "Ομοφαγία",
  "Μαγειρευτό",
  "Μπάρφ",
  "Ξηρά τροφή",
  "Υγρή τροφή",
  "Συνδυασμός",
];

export const TypesOfResidence = [
  "Μονοκατοικία",
  "Διαμέρισμα",
  "Ξενοδοχείο",
  "Υπόγειο",
  "Ισόγειο",
  "1ος",
  "2ος",
  "3ος",
  "4ος",
  "5ος",
  "6ος",
  "7ος",
  "Εργασία",
];

export const TypesOfSterilized = [
  { label: "Ναι", value: true },
  { label: "Όχι", value: false },
];

export const colors = [
  { label: "Tomato", value: "#FF6347" },
  { label: "SteelBlue", value: "#4682B4" },
  { label: "LimeGreen", value: "#32CD32" },
  { label: "Gold", value: "#FFD700" },
  { label: "MediumPurple", value: "#9370DB" },
  { label: "Teal", value: "#008080" },
  { label: "SaddleBrown", value: "#8B4513" },
  { label: "RoyalBlue", value: "#4169E1" },
  { label: "LightSalmon", value: "#FFA07A" },
  { label: "DarkOliveGreen", value: "#556B2F" },
  { label: "Purple", value: "#800080" },
  { label: "LightSeaGreen", value: "#20B2AA" },
  { label: "HotPink", value: "#FF69B4" },
  { label: "Navy", value: "#000080" },
];
export const CATEGORY = {
  PERSONAL: 1,
  ARRIVAL: 2,
  TRANSPORT: 3,
  DEPARTURE: 4,
  TRAINING: 5,
  DAILY_CARE: 6,
} as const;

export type CategoryId = (typeof CATEGORY)[keyof typeof CATEGORY];

export const CATEGORY_META = [
  { text: "Personal", id: CATEGORY.PERSONAL, color: "#00008B" },
  { text: "Arrival", id: CATEGORY.ARRIVAL, color: "#4B0082" },
  { text: "Departure", id: CATEGORY.DEPARTURE, color: "#9d174d" },
  { text: "Transport", id: CATEGORY.TRANSPORT, color: "#32CD32" },
  { text: "Training", id: CATEGORY.TRAINING, color: "#ea580c" },
  { text: "Daily Care", id: CATEGORY.DAILY_CARE, color: "#f59e0b" },
] as const;
export const SERVICE_TYPE = {
  TRAINING: "EΚΠΑΙΔΕΥΣΗ",
  DAILY_CARE: "ΦΡΟΝΤΙΔΑ",
} as const;
