import { SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/form.svg",
    route: "/form",
    label: "Form",
  },
  {
    imgURL: "/assets/icons/bed.svg",
    route: "/rooms",
    label: "Rooms",
  },
  {
    imgURL: "/assets/icons/chart.svg",
    route: "/logistics",
    label: "Logistics",
  },
  {
    imgURL: "/assets/icons/calendar.svg",
    route: "/calendar",
    label: "Calendar",
  },
  {
    imgURL: "/assets/icons/clients.svg",
    route: "/clients",
    label: "Clients",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/training",
    label: "Training",
  },
  {
    imgURL: "/assets/icons/transport.svg",
    route: "/transport",
    label: "Transport",
  },
];
