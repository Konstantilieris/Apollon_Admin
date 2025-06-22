"use client";

import React, { useMemo, useState } from "react";
import {
  Form,
  Select,
  SelectItem,
  Input,
  Checkbox,
  Textarea,
  Button,
  DatePicker,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { CalendarDateTime, getLocalTimeZone } from "@internationalized/date";
import { createTrainingSession } from "@/lib/actions/training.action";
import { useModalStore } from "@/hooks/client-profile-store";
import { IDog } from "@/database/models/client.model";
import { I18nProvider } from "@react-aria/i18n";
import { toast } from "sonner";
import { SERVICE_TYPE } from "@/constants";
import { useRouter } from "next/navigation";
// ─── Τύποι ────────────────────────────────────────────────
interface Dog extends IDog {
  _id: string;
}

type SessionKey = "Training" | "Daily Care";
type DurationKey =
  | "1"
  | "1.5"
  | "2"
  | "2.5"
  | "3"
  | "3.5"
  | "4"
  | "4.5"
  | "5"
  | "5.5"
  | "6"
  | "6.5"
  | "7"
  | "7.5"
  | "8"
  | "8.5"
  | "9"
  | "9.5"
  | "10"
  | "10.5"
  | "11"
  | "11.5"
  | "12";

const durationOptions: { key: DurationKey; label: string }[] = [
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
].map((k) => ({ key: k as DurationKey, label: `${k} ώρες` }));

function jsToCalendarDateTime(d: Date): CalendarDateTime {
  return new CalendarDateTime(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes()
  );
}

// ─── Component ─────────────────────────────────────────────
export default function CreateTrainingDailyCareView() {
  const [sessionType, setSessionType] = useState<SessionKey>("Training");
  const [price, setPrice] = useState("");
  const [selectedDogs, setSelectedDogs] = useState<Set<string>>(new Set());

  const [startDateTime, setStartDateTime] = useState<CalendarDateTime>(() =>
    jsToCalendarDateTime(roundToNextQuarterHour(new Date()))
  );
  const router = useRouter();
  const [duration, setDuration] = useState<DurationKey>("1");
  const [notes, setNotes] = useState("");

  const { modalData, closeModal } = useModalStore();
  const dogs: Dog[] = modalData?.client?.dog;

  // JS dates
  const startJSDate = useMemo(
    () => startDateTime.toDate(getLocalTimeZone()),
    [startDateTime]
  );

  const endJSDate = useMemo(() => {
    const hours = parseFloat(duration);
    return new Date(startJSDate.getTime() + hours * 60 * 60 * 1000);
  }, [startJSDate, duration]);

  // Υποβολή
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dogNames = dogs
        .filter((d) => selectedDogs.has(d._id))
        .map((d) => d.name);
      await createTrainingSession({
        clientId: modalData.client._id,
        dogIds: Array.from(selectedDogs),
        dogNames,
        sessionType:
          sessionType === "Training"
            ? SERVICE_TYPE.TRAINING
            : SERVICE_TYPE.DAILY_CARE,
        price: parseFloat(price || "0"),
        startTime: startJSDate,
        durationHours: parseFloat(duration),
        notes,
      });

      toast.success("Η συνεδρία καταχωρήθηκε με επιτυχία!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Σφάλμα: η συνεδρία δεν αποθηκεύτηκε. Προσπαθήστε ξανά.");
    } finally {
      router.refresh();
      closeModal();
    }
  };

  return (
    <Form
      aria-label="Φόρμα Εκπαίδευσης / Φροντίδας"
      className="h-full w-[35vw] self-center rounded-large  p-6  max-md:w-full "
      onSubmit={handleSubmit}
    >
      <div className="mt-12 flex h-full w-full  flex-col overflow-y-auto">
        <h2 className="my-8 w-full text-center text-2xl font-semibold tracking-wide">
          Καταχώρηση Εκπαίδευσης / Φροντίδας
        </h2>

        {/* Τύπος συνεδρίας */}
        <Select
          label="Τύπος Συνεδρίας"
          selectedKeys={new Set([sessionType])}
          onSelectionChange={(keys) =>
            setSessionType(Array.from(keys)[0] as SessionKey)
          }
          className="text-base"
          classNames={{
            label: "text-base  tracking-wide",
            popoverContent: "text-base font-sans",
          }}
        >
          <SelectItem key="Training">Εκπαίδευση</SelectItem>
          <SelectItem key="Daily Care">Ημερήσια Φροντίδα</SelectItem>
        </Select>

        {/* Τιμή */}
        <Input
          className="mt-6"
          type="number"
          label="Τιμή (€)"
          placeholder="0.00"
          classNames={{
            label: "text-base  tracking-wide",
          }}
          startContent={<Icon icon="lucide:euro" />}
          value={price}
          onValueChange={setPrice}
          min="0"
          step="0.01"
        />

        {/* Επιλογή σκύλων */}
        <div className="mt-6">
          <p className="mb-2 font-medium tracking-wide">Συμμετέχοντες Σκύλοι</p>
          {dogs?.map((dog) => (
            <Checkbox
              key={dog._id}
              className="mr-2"
              isSelected={selectedDogs.has(dog._id)}
              onValueChange={(checked) => {
                const next = new Set(selectedDogs);
                checked ? next.add(dog._id) : next.delete(dog._id);
                setSelectedDogs(next);
              }}
            >
              {dog.name}
            </Checkbox>
          ))}
        </div>

        {/* Ημερομηνία/Ώρα Έναρξης */}
        <I18nProvider locale="el">
          <DatePicker
            variant="underlined"
            className="mt-6"
            color="secondary"
            label="Ημερομηνία & Ώρα Έναρξης"
            classNames={{
              calendar: "rounded-lg font-sans text-base",
              label: "font-sans text-base",
              input: "font-sans text-light-900",
              inputWrapper: "font-sans text-lg ",
              calendarContent: "font-sans text-base",
              selectorButton: "font-sans  text-light-900",
              selectorIcon: "font-sans text-light-900",
              segment: "font-sans text-gray-400",
              base: "font-sans text-light-900",
              popoverContent: "font-sans text-light-900 text-base",
            }}
            granularity="minute"
            value={startDateTime}
            onChange={(val) => setStartDateTime(val as CalendarDateTime)}
          />
        </I18nProvider>
        {/* Διάρκεια */}
        <Select
          className="mt-6"
          classNames={{
            label: "text-base  tracking-wide",
            popoverContent: "text-base font-sans",
          }}
          label="Διάρκεια"
          placeholder="Επιλέξτε διάρκεια"
          selectedKeys={new Set([duration])}
          onSelectionChange={(keys) =>
            setDuration(Array.from(keys)[0] as DurationKey)
          }
        >
          {durationOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>

        {/* Ώρα Λήξης */}

        <Input
          className="mt-6"
          isReadOnly
          classNames={{ label: "text-base tracking-wide" }}
          label="Ώρα Λήξης"
          value={endJSDate.toLocaleString("el-GR", {
            dateStyle: "short", // π.χ. 21/6/2025
            timeStyle: "short", // π.χ. 14:30
          })}
        />

        {/* Σημειώσεις */}
        <Textarea
          className="mt-6"
          label="Σημειώσεις (προαιρετικά)"
          classNames={{
            label: "text-base  tracking-wide",
          }}
          placeholder="Εισάγετε πρόσθετες πληροφορίες"
          value={notes}
          onValueChange={setNotes}
        />

        <Button
          type="submit"
          color="default"
          variant="ghost"
          className="mt-8 w-full text-base tracking-widest"
          isDisabled={
            !selectedDogs.size || !startDateTime || !duration || !price
          }
        >
          Καταχώρηση
        </Button>
      </div>
    </Form>
  );
}

// ─── Βοηθητικό ───────────────────────────────────────────────
function roundToNextQuarterHour(date: Date): Date {
  const d = new Date(date);
  const mins = d.getMinutes();
  const rounded = Math.ceil(mins / 15) * 15;
  if (rounded === 60) {
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
  } else {
    d.setMinutes(rounded);
  }
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}
