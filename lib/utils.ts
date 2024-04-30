import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import {
  QuestionMarkCircledIcon,
  StopwatchIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import {
  CircleIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateString(inputDateString: Date) {
  // Parse the input date string
  const inputDate = new Date(inputDateString);

  // Get the day, month, and year components
  const day = inputDate.getDate();
  const month = inputDate.getMonth() + 1; // Months are zero-based
  const year = inputDate.getFullYear();

  // Format the date components
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}

interface URLQueryParams {
  params: string;
  key: string;
  value: string;
}
interface removeUrlQueryParams {
  params: string;
  keysToRemove: string[];
}
export const constructDogsArray = (selectedDogs: any, selectedRoom: any) => {
  // Construct an array of objects with dogId and roomId
  const dogsArray = selectedDogs.map((dog: any) => ({
    dogId: dog._id,
    dogName: dog.name,
    roomId: selectedRoom._id,
    roomName: selectedRoom.name, // Assuming _id is the identifier for rooms
  }));
  return dogsArray;
};
export function removeKeysFromQuery({
  params,
  keysToRemove,
}: removeUrlQueryParams) {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}
export function formUrlQuery({ params, key, value }: URLQueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
export const viewClientOptions = [
  {
    label: "Dog",
    title: "Σκύλοι",
    value: [
      "dog_name",
      "dog_gender",
      "Dog Birthdate",
      "dog_food",
      "dog_breed",
      "dog_behavior",
      "dog_vet",
      "dog_vetNumber",
    ],
  },
];
export const isTrainingOptions = {
  column_name: "isTraining",
  title: "Εκπαίδευση",

  options: [
    { label: "Ναι", value: true },
    { label: "Όχι", value: false },
  ],
};

export function formatDate(date: Date, language: string) {
  return new Intl.DateTimeFormat(language, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
export function formatDateUndefined(date: Date | undefined, language: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat(language, {
    weekday: "short",
    month: "long",
    day: "numeric",
  }).format(date);
}
export function formatTime(date: Date | undefined, language: string) {
  return new Intl.DateTimeFormat(language, {
    hour: "numeric",
    minute: "numeric",
    hour12: false, // Use 24-hour format
  }).format(date);
}

export function getDatesInRange(
  startDate: Date | undefined,
  endDate: Date | undefined
) {
  if (!startDate || !endDate) {
    return;
  }

  const dateArray = [];

  const currentDate = new Date(startDate);
  dateArray.push(new Date(currentDate));

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate < endDate) {
    currentDate.setDate(currentDate.getDate() + 1);
    dateArray.push(new Date(currentDate));
  }

  return dateArray;
}
export function getDatesInRangeVal(
  startDate: Date | undefined,
  endDate: Date | undefined
): string[] | undefined {
  if (!startDate || !endDate) {
    return;
  }

  const dateArray: string[] = [];

  const currentDate = new Date(startDate);
  dateArray.push(currentDate.toISOString().split("T")[0]);
  let tempDate;
  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate < endDate) {
    currentDate.setDate(currentDate.getDate() + 1);
    tempDate = new Date(currentDate);
    dateArray.push(tempDate.toISOString().split("T")[0]);
  }

  return dateArray;
}

export function isRoomAvailable(
  roomUnavailableDates: String[] | undefined,
  bookingDates: String[] | undefined
) {
  if (!bookingDates) return;
  if (!roomUnavailableDates) return true;
  return !roomUnavailableDates.some((date) => bookingDates.includes(date));
}
export function getTotalDays(
  startDate: Date | undefined,
  endDate: Date | undefined
) {
  if (!startDate || !endDate) {
    return;
  }
  let totalDays = 1;

  const currentDate = new Date(startDate);

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate < endDate) {
    currentDate.setDate(currentDate.getDate() + 1);
    totalDays++;
  }

  return totalDays;
}
export function replacePercent20(inputString: string | null) {
  // Use regular expression to replace all occurrences of %20 with a space
  if (!inputString) {
    return;
  }
  return inputString.replace(/%20/g, "").split(" ").join("");
}
export function calculateTotal(
  fromDate: Date,
  timeOfArrival: Date,
  toDate: Date,
  timeOfDeparture: Date,
  dailyPrice: number
): number {
  // Combine the date and time parts
  const arrivalDateTime = new Date(fromDate);
  arrivalDateTime.setHours(
    timeOfArrival.getHours(),
    timeOfArrival.getMinutes()
  );

  const departureDateTime = new Date(toDate);
  departureDateTime.setHours(
    timeOfDeparture.getHours(),
    timeOfDeparture.getMinutes()
  );

  // If arrival time is after 14:00, move to the next day
  if (timeOfArrival.getHours() >= 14) {
    arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
    arrivalDateTime.setHours(14, 0, 0, 0);
  } else {
    arrivalDateTime.setHours(14, 0, 0, 0);
  }

  // If departure time is after 14:00, move to the next day
  if (timeOfDeparture.getHours() >= 14) {
    departureDateTime.setDate(departureDateTime.getDate() + 1);
    departureDateTime.setHours(14, 0, 0, 0);
  } else {
    departureDateTime.setHours(14, 0, 0, 0);
  }

  // Ensure the arrivalDateTime is before the departureDateTime
  if (arrivalDateTime >= departureDateTime) return 0;

  // Calculate the number of nights based on the 14:00 start and end time
  const numberOfNights = Math.floor(
    (departureDateTime.getTime() - arrivalDateTime.getTime()) /
      (24 * 60 * 60 * 1000)
  );

  // Calculate the total cost
  const totalCost = numberOfNights * dailyPrice;

  return totalCost;
}
export function ManageAvailability(
  roomUnavailableDates: string[] | undefined,
  rangeDate: { from: Date | undefined; to: Date | undefined }
) {
  if (!rangeDate.from || !rangeDate.to) return false; // if no range date provided, room is not available
  if (!roomUnavailableDates || roomUnavailableDates.length === 0) return true; // if no unavailable dates, room is available

  const fromISO = rangeDate.from.toISOString().split("T")[0];
  const toISO = rangeDate.to.toISOString().split("T")[0];

  return !roomUnavailableDates.some((date) => {
    return date >= fromISO || date <= toISO;
  });
}
export function resetHours(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0); // Resetting hours, minutes, seconds, and milliseconds to 0
  return newDate;
}
export function isIdIncluded(dogs: any, id: any) {
  return dogs.some((dog: any) => dog._id === id);
}
export const options = {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "short",
};
export function findRoomNameById(id: string, rooms: any) {
  const room = rooms.find((room: any) => room._id === id);
  return room ? room.name : "Room not found"; // Return room name if found, otherwise a default message
}
export function isBookingLive(booking: any) {
  const currentDate = Date.now();
  const fromDate = booking.fromDate.getTime();
  const toDate = booking.toDate.getTime();

  return currentDate >= fromDate && currentDate <= toDate;
}
export function sumTotalOwesAndSpent(transactions: any[]) {
  if (!transactions) return { totalOwes: 0, totalSpent: 0 };
  let totalOwes = 0;
  let totalSpent = 0;

  for (const transaction of transactions) {
    if (transaction.paid === false) {
      totalOwes += transaction.amount;
    } else {
      totalSpent += transaction.amount;
    }
  }

  return { totalOwes, totalSpent };
}

export function ExpendsLabel({ categories }: any) {
  const obj: any = [];
  categories.map((item: any) => {
    obj.push(`${item._id.toUpperCase()}-${item.totalAmount}€`);
    return obj;
  });
  return obj;
}
export function findDogWithUndesiredBehavior(dogs: any[]) {
  if (!dogs) return null; // Return null if no dogs are provided
  for (const dog of dogs) {
    if (dog.behavior === "Ενθουσιώδης") {
      return dog;
    }
  }
  return null; // Return null if no dog with the specified behavior is found
}

export function numberToHexString(number: number) {
  // Convert the number to hexadecimal
  let hexString = number.toString(16);

  // Pad the hexadecimal string with zeros to ensure it's 24 characters long
  while (hexString.length < 24) {
    hexString = "0" + hexString;
  }

  return hexString;
}
export function DateValidation(item: string) {
  const date = new Date(item);
  if (date.toString() === "Invalid Date") {
    return new Date();
  }
  return date;
}
export function weatherCondition(code: number) {
  switch (code) {
    case 0:
      return {
        label: "Καθαρός ουρανός",
        imgUrl: "/assets/weather/clearSky.svg",
      };
    case 1:
      return {
        label: "Κυρίως αίθριος",
        imgUrl: "/assets/weather/mainlyClear.svg",
      };
    case 2:
      return {
        label: "Αραιή Συννεφιά",
        imgUrl: "/assets/weather/partlyCloudy.svg",
      };
    case 3:
      return { label: "Συννεφιά", imgUrl: "/assets/weather/cloudy.svg" };
    case 45 | 48:
      return { label: "Ομίχλη", imgUrl: "/assets/weather/fog.svg" };

    case 51 | 53:
      return { label: "Ψιλόβροχο", imgUrl: "/assets/weather/drizzle.svg" };
    case 55:
      return {
        label: "βαρύ ψιλόβροχο",
        imgUrl: "/assets/weather/heavyDrizzle.svg",
      };
    case 56 | 57:
      return {
        label: "Παγερό ψιλόβροχο",
        imgUrl: "/assets/weather/freezingDrizzle.svg",
      };
    case 61 | 63 | 65:
      return { label: "Βροχή", imgUrl: "/assets/weather/rain.svg" };
    case 66 | 67:
      return {
        label: "Παγωμένη βροχή",
        imgUrl: "/assets/weather/freezingRain.svg",
      };
    case 71:
      return {
        label: "Χιονόνερο",
        imgUrl: "/assets/weather/lightSnowfall.svg",
      };
    case 73:
      return { label: "Χιόνι", imgUrl: "/assets/weather/moderateSnowfall.svg" };
    case 75:
      return { label: "Πυκνό χιόνι", imgUrl: "/assets/weather/heavySnow.svg" };
    case 80 | 81 | 82:
      return {
        label: "Ντούς Βροχής",
        imgUrl: "/assets/weather/rainShowers.svg",
      };
    case 85 | 86:
      return {
        label: "Ντούς Χιόνι",
        imgUrl: "/assets/weather/snowShower.svg",
      };
    case 95 | 96 | 99:
      return {
        label: "Θυελλώδεις Βροχές",
        imgUrl: "/assets/weather/thunderstorm.svg",
      };
    default:
      return { label: "Άγνωστο", imgUrl: "/assets/weather/unknown.svg" };
  }
}
