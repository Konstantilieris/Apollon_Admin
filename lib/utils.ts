import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

import moment from "moment-timezone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function sanitizeQuery(query: string | undefined): string {
  if (query === "" || !query) return "";
  if (typeof query !== "string") {
    throw new Error("Invalid query type");
  }

  // Trim whitespace
  let sanitizedQuery = query.trim();

  // Escape special regex characters
  sanitizedQuery = sanitizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return sanitizedQuery;
}
export function formatDateString2(inputDateString: Date) {
  // Parse the input date string
  const inputDate = new Date(inputDateString);

  // Get the day, month, and year components
  const day = inputDate.getDate();
  const month = inputDate.getMonth() + 1; // Months are zero-based

  // Format the date components
  const formattedDate = `${day}/${month}`;

  return formattedDate;
}
export function formatDateString(inputDateString: Date) {
  // Parse the input date string
  const inputDate = new Date(inputDateString);

  // Get the day, month, and year components
  const day = String(inputDate.getDate()).padStart(2, "0"); // Pad day with leading zero if needed
  const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based and pad month with leading zero if needed
  const year = inputDate.getFullYear();

  // Format the date components
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
export async function getDayAndMonth(date: Date) {
  const day = String(date.getDate()).padStart(2, "0"); // Pad day with leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based and pad month with leading zero if needed
  return `${day}/${month}`;
}
export function formatDateToTime(inputDateString: Date | undefined) {
  // Parse the input date string
  if (!inputDateString) return "";
  const inputDate = new Date(inputDateString);

  // Get the hours and minutes components
  const hours = inputDate.getHours();
  const minutes = inputDate.getMinutes();

  // Format the time components
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
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
export function formCombinedParams(params: any, updates: any) {
  const currentUrlParams = qs.parse(params);
  const combinedParams = { ...currentUrlParams, ...updates };
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: combinedParams,
    },
    { skipNull: true }
  );
}

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
export function formatDateForBooking(date: Date, language: string) {
  return new Intl.DateTimeFormat(language, {
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDate(date: Date | undefined, language: string) {
  if (!date) return "";
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
export function formatDateUndefined2(date: Date | undefined, language: string) {
  if (!date) return "";

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false, // Use 24-hour format
  };

  return new Intl.DateTimeFormat(language, options).format(date);
}

export function formatTime(date: Date | undefined, language: string) {
  if (!date) return "";

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false, // Use 24-hour format
  };

  return new Intl.DateTimeFormat(language, options).format(date);
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
  return inputString.replace(/%20/g, " ");
}
export function calculateTotalPrice({
  fromDate,
  toDate,
  dailyPrice,
}: {
  fromDate: Date;
  toDate: Date;
  dailyPrice: number;
}) {
  // Ensure the dates are Date objects (this step is not necessary if fromDate and toDate are already Date objects)
  fromDate = new Date(fromDate);
  toDate = new Date(toDate);

  // If toDate is before or same as fromDate, return 0
  if (toDate <= fromDate) {
    return 0;
  }

  // Calculate the total number of days
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day

  // Set fromDate and toDate to midday of their respective days to avoid time discrepancies
  const checkInMidday = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
    12,
    0,
    0
  );
  const checkOutMidday = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate(),
    12,
    0,
    0
  );

  // Calculate the difference in days between checkOutMidday and checkInMidday
  const timeDiff = checkOutMidday.getTime() - checkInMidday.getTime();
  const totalDays = Math.ceil(timeDiff / oneDay); // Use Math.ceil to ensure any partial day is counted as a full day

  // Calculate the total price
  const totalPrice = totalDays * dailyPrice;

  return totalPrice;
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
  if (!booking) return false;

  const fromDate = new Date(booking.fromDate).getTime();
  const toDate = new Date(booking.toDate).getTime();

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

export function ExpendsLabel({ total }: any) {
  const obj: any = [];
  total.map((item: any) => {
    obj.push(`${item._id.toUpperCase()}-${item.totalAmount}€`);
    return obj;
  });
  return obj;
}
export function findDogWithUndesiredBehavior(dogs: any[]) {
  if (!dogs) return null; // Return null if no dogs are provided
  for (const dog of dogs) {
    if (dog.behavior === "Ανεπιθύμητος") {
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
export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};
export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}
export function dateToInt(date: Date | undefined) {
  if (!date) return 0;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() returns 0-11, so add 1
  const day = date.getDate().toString().padStart(2, "0");
  return parseInt(`${year}${month}${day}`);
}

export function intToDate(dateInt: number | undefined) {
  if (!dateInt) return undefined;
  const dateStr = dateInt.toString();
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // JavaScript months are 0-based
  const day = parseInt(dateStr.substring(6, 8));
  return new Date(Date.UTC(year, month, day));
}
export function intToDate2(dateInt: number | undefined) {
  if (!dateInt) return new Date();
  const dateStr = dateInt.toString();
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // JavaScript months are 0-based
  const day = parseInt(dateStr.substring(6, 8));
  return new Date(Date.UTC(year, month, day));
}
export function setTimeOnDate(date: Date, time: string) {
  // Parse the date using moment
  let dateTime = moment(date);

  // Parse the time input into hours and minutes
  const [hours, minutes] = time.split(":").map(Number);

  // Set the time on the parsed date
  dateTime = dateTime.set({
    hour: hours,
    minute: minutes,
    second: 0,
    millisecond: 0,
  });

  // Return the updated date with the new time
  return dateTime.toDate();
}
export const GlobalSearchFilters = [
  { name: "Προφιλ ", value: "client" },
  { name: "Κρατηση", value: "booking" },
  { name: "Εκπαιδευση", value: "training" },
];
export function setLocalTime(date: Date, time: string): Date {
  if (!time) return date;

  // Split the time string to extract hours and minutes
  const [hours, minutes] = time.split("-").map(Number);

  // Create a moment object from the date
  let m = moment(date);

  // Set the time in UTC+3 (Greece, Eastern European Summer Time)
  m = m
    .tz("Europe/Athens")
    .set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

  // Return the updated Date object
  return m.toDate();
}
export const addMinutes = (
  date: moment.Moment,
  minutes: number
): moment.Moment => {
  return date.clone().add(minutes, "minutes");
};
export const getTime = (date: Date): string => {
  return moment(date).format("HH:mm");
};
