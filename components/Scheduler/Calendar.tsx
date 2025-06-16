"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Week,
  Day,
  Month,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  TimelineMonth,
  DragAndDrop,
  ResourcesDirective,
  ResourceDirective,
  TimelineViews,
  Inject,
  Resize,
} from "@syncfusion/ej2-react-schedule";
import {
  registerLicense,
  L10n,
  loadCldr,
  removeClass,
} from "@syncfusion/ej2-base";

import * as greekLocale from "cldr-data/main/el/ca-gregorian.json"; // Greek CLDR data
import * as greekNumbers from "cldr-data/main/el/numbers.json";
import * as greekTime from "cldr-data/main/el/timeZoneNames.json";
import {
  IconCar,
  IconUser,
  IconLetterK,
  IconPhone,
  IconCalendar,
  IconCheck,
} from "@tabler/icons-react";
import {
  createEvent,
  deleteEvent,
  getEventsWithPairs,
  updateBookingDateChange,
  updateEvent,
  updateEventBookingOnlyTimeChange,
} from "@/lib/actions/event.action";

import "./calendar.css";

import moment from "moment";
import useCalendarModal from "@/hooks/use-calendar-modal";
import { cn, formatTime } from "@/lib/utils";

import BarLoader from "../ui/shuffleLoader";
import { IEvent } from "@/database/models/event.model";

const registerKey = process.env.NEXT_PUBLIC_REGISTER_KEY; // Set a default value if the key is undefined
registerLicense(registerKey!);
loadCldr(greekLocale, greekNumbers, greekTime);
L10n.load({
  el: {
    schedule: {
      day: "ΗΜΕΡΑ",
      week: "ΕΒΔΟΜΑΔΑ ",
      workWeek: "ΕΡΓΑΣΙΜΗ ΕΒΔΟΜΑΔΑ",
      month: "ΜΗΝΑΣ",
      agenda: "Ατζέντα",
      weekAgenda: "Εβδομαδιαία ατζέντα",
      workWeekAgenda: "Ατζέντα εργασίας εβδομάδας",
      monthAgenda: "Μηνιαία ατζέντα",
      today: "ΣΗΜΕΡΑ",
      noEvents: "Δεν υπάρχουν γεγονότα",
      emptyContainer:
        "Δεν υπάρχουν προγραμματισμένα γεγονότα για αυτήν την ημέρα.",
      allDay: "Όλη μέρα",
      start: "Αρχή",
      end: "Τέλος",
      more: "περισσότερα",
      close: "Κλείσιμο",
      cancel: "Ακύρωση",
      noTitle: "Χωρίς τίτλο",
      delete: "Διαγραφή",
      deleteEvent: "Διαγραφή γεγονότος",
      deleteMultipleEvent: "Διαγραφή πολλαπλών γεγονότων",
      selectedItems: "Επιλεγμένα αντικείμενα",
      deleteSeries: "Διαγραφή σειράς",
      edit: "Επεξεργασία",
      editSeries: "Επεξεργασία σειράς",
      editEvent: "Επεξεργασία γεγονότος",
      createEvent: "Δημιουργία",
      subject: "Θέμα",
      addTitle: "Προσθήκη τίτλου",
      moreDetails: "Περισσότερες λεπτομέρειες",
      save: "Αποθήκευση",
      editContent:
        "Θέλετε να επεξεργαστείτε μόνο αυτό το γεγονός ή ολόκληρη τη σειρά;",
      deleteRecurrenceContent:
        "Θέλετε να διαγράψετε μόνο αυτό το γεγονός ή ολόκληρη τη σειρά;",
      deleteContent: "Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το γεγονός;",
      deleteMultipleContent:
        "Είστε σίγουροι ότι θέλετε να διαγράψετε τα επιλεγμένα γεγονότα;",
      newEvent: "Νέο γεγονός",
      title: "Τίτλος",
      location: "Τοποθεσία",
      description: "Περιγραφή",
      timezone: "Ζώνη ώρας",
      startTimezone: "Ζώνη ώρας έναρξης",
      endTimezone: "Ζώνη ώρας λήξης",
      repeat: "Επανάληψη",
      saveButton: "Αποθήκευση",
      cancelButton: "Ακύρωση",
      deleteButton: "Διαγραφή",
      recurrence: "Επαναλαμβανόμενο",
      wrongPattern: "Το μοτίβο επανάληψης δεν είναι έγκυρο.",
      seriesChangeAlert:
        "Οι αλλαγές που έγιναν σε συγκεκριμένα περιστατικά αυτής της σειράς θα ακυρωθούν και αυτά τα γεγονότα θα ταιριάζουν ξανά με τη σειρά.",
      createError:
        "Η διάρκεια του γεγονότος πρέπει να είναι μικρότερη από τη συχνότητα με την οποία συμβαίνει. Μειώστε τη διάρκεια ή αλλάξτε το μοτίβο επανάληψης στον επεξεργαστή επανάληψης.",
      recurrenceDateValidation:
        "Ορισμένοι μήνες έχουν λιγότερες ημέρες από την επιλεγμένη ημερομηνία. Για αυτούς τους μήνες, η εμφάνιση θα πέσει στην τελευταία ημέρα του μήνα.",
      sameDayAlert:
        "Δύο περιστατικά του ίδιου γεγονότος δεν μπορούν να συμβούν την ίδια ημέρα.",
      editRecurrence: "Επεξεργασία επανάληψης",
      repeats: "Επαναλαμβάνεται",
      alert: "Ειδοποίηση",
      startEndError:
        "Η επιλεγμένη ημερομηνία λήξης είναι πριν από την ημερομηνία έναρξης.",
      invalidDateError: "Η καταχωρημένη ημερομηνία δεν είναι έγκυρη.",
      ok: "Εντάξει",
      occurrence: "Περιστατικό",
      series: "Σειρά",
      previous: "Προηγούμενο",
      next: "Επόμενο",
      timelineDay: "Χρονική Ημέρα",
      timelineWeek: "ΧΡΟΝΙΚΗ ΕΒΔΟΜΑΔΑ",
      timelineWorkWeek: "Χρονική Εργάσιμη Εβδομάδα",
      timelineMonth: "ΧΡΟΝΙΚΟΣ ΜΗΝΑΣ",
      expandAllDaySection: "Επέκταση",
      collapseAllDaySection: "Σύμπτυξη",
    },

    recurrenceeditor: {
      repeat: "Επανάληψη",
      days: "Ημέρες",
      weeks: "Εβδομάδες",
      months: "Μήνες",
      years: "Χρόνια",
      never: "Ποτέ",
      daily: "Καθημερινά",
      weekly: "Εβδομαδιαία",
      monthly: "Μηνιαία",
      yearly: "Ετήσια",
      until: "Μέχρι",
      count: "Πλήθος",
      first: "Πρώτο",
      second: "Δεύτερο",
      third: "Τρίτο",
      fourth: "Τέταρτο",
      last: "Τελευταίο",
      repeatEvery: "Επανάληψη κάθε",
      repeatOn: "Επανάληψη στις",
      end: "Τέλος",
      after: "Μετά",
      occurrences: "Εμφανίσεις",
      summaryTimes: "φορές",
      summaryOn: "στις",
      summaryUntil: "μέχρι",
      summaryRepeat: "Επαναλαμβάνεται",
      summaryDay: "ημέρα",
      summaryWeek: "εβδομάδα",
      summaryMonth: "μήνας",
      summaryYear: "έτος",
    },
  },
});
interface CalendarEvent extends IEvent {
  __shadow?: boolean; // 👈 invisible partner marker
}
// No dependencies, this will remain the same unless the logic inside changes.

const Scheduler: React.FC<{ revenueData: any }> = ({ revenueData }) => {
  const { setPairDate, setStage, setSelectedEvent, toggleOpen, open } =
    useCalendarModal();
  const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
  const scheduleObj = useRef<any>(null);
  const [roomOccupancyMap, setRoomOccupancyMap] = useState<
    Record<string, Set<string>>
  >({});
  const [loading, setLoading] = useState(false);
  const dateRef = useRef(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [originalStartTime, setOriginalStartTime] = useState<Date | null>(null);
  const buildRoomOccupancyMap = (bookings: any[]) => {
    const map: Record<string, Set<string>> = {};
    bookings.forEach((booking) => {
      const from = moment(booking.fromDate || booking.StartTime);
      const to = moment(booking.toDate || booking.EndTime);
      const dogs = booking.dogs || booking.dogsData || [];
      while (from.isSameOrBefore(to, "day")) {
        const key = from.format("YYYY-MM-DD");
        if (!map[key]) map[key] = new Set();
        dogs.forEach((dog: any) => {
          if (dog.roomId) map[key].add(dog.roomId.toString());
        });
        from.add(1, "day");
      }
    });
    return map;
  };
  const loadWindow = useCallback(async (start?: Date, end?: Date) => {
    if (!start || !end) return;

    // ①  fetch events + their mates
    const raw = await getEventsWithPairs(
      start.toISOString(),
      end.toISOString()
    );
    const events: CalendarEvent[] =
      typeof raw === "string" ? JSON.parse(raw) : raw;

    // ②  tag the off-screen ones
    const viewStart = moment(start).startOf("day");
    const viewEnd = moment(end).endOf("day");
    const decorated = events.map((e) => ({
      ...e,
      __shadow:
        moment(e.StartTime).isAfter(viewEnd) ||
        moment(e.EndTime).isBefore(viewStart),
    }));

    setAppointments(decorated); // ← KEEP ALL of them
    setRoomOccupancyMap(buildRoomOccupancyMap(decorated));
  }, []);

  const checkRoomConflictFrontend = (
    date: Date,
    draggedEvent: any,
    pairedEvent: any
  ): boolean => {
    const roomIds = draggedEvent.dogsData.map((dog: any) =>
      dog.roomId.toString()
    );
    const isArrival = draggedEvent.isArrival;
    const from = moment(isArrival ? date : pairedEvent?.StartTime);
    const to = moment(!isArrival ? date : pairedEvent?.StartTime);
    while (from.isSameOrBefore(to, "day")) {
      const dayStr = from.format("YYYY-MM-DD");
      const occupied = roomOccupancyMap[dayStr] || new Set();
      if (roomIds.some((id: string) => occupied.has(id))) return true;
      from.add(1, "day");
    }
    return false;
  };

  const updateRoomOccupancyAfterDrag = (
    fromDate: Date,
    toDate: Date,
    roomIds: string[]
  ) => {
    setRoomOccupancyMap((prevMap) => {
      const updatedMap = { ...prevMap };
      const from = moment(fromDate);
      const to = moment(toDate);
      while (from.isSameOrBefore(to, "day")) {
        const dayStr = from.format("YYYY-MM-DD");
        if (!updatedMap[dayStr]) updatedMap[dayStr] = new Set();
        roomIds.forEach((id) => updatedMap[dayStr].add(id));
        from.add(1, "day");
      }
      return updatedMap;
    });
  };
  const clickTimeoutRef = useRef<any | null>(null);

  const renderIcon = useCallback((categoryId: number) => {
    switch (categoryId) {
      case 1:
        return <span className="absolute -top-1 right-0  p-1 text-xl">🤠</span>;
      case 2:
        return (
          <IconLetterK
            size={30}
            className="absolute right-0 top-0 rounded-full border border-white p-1 text-purple-400"
          />
        );
      case 3:
        return (
          <IconCar
            size={30}
            className="absolute right-0 top-0 rounded-full border border-white p-1 text-green-500"
          />
        );
      case 4:
        return (
          <IconLetterK
            size={30}
            className="absolute right-0 top-0 rounded-full border border-white p-1 text-purple-400"
          />
        );
      default:
        return null;
    }
  }, []);
  const mockCategoryData = useMemo(
    () => [
      { text: "Personal", id: 1, color: "#00008B" },
      { text: "Arrival", id: 2, color: "#4B0082" },
      { text: "Departure", id: 4, color: "#9d174d" },
      { text: "Transport", id: 3, color: "#32CD32" },
      { text: "Training", id: 5, color: "#ea580c" },
    ],
    []
  );
  const debounce = (func: Function, delay: number) => {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  const eventTemplate = useMemo(
    // eslint-disable-next-line react/display-name
    () => (props: any) => {
      if (props.__shadow) return null;
      return (
        <div className="flex w-full gap-2 pl-1 pt-1 text-[1rem] text-white">
          <span
            className={cn({ "w-full text-center": props.categoryId === 1 })}
          >
            {props.Subject}
          </span>
          {props.dogsData && (
            <span className="flex flex-row gap-1 truncate pt-[2px] text-sm">
              {props.dogsData.map((dog: any) => dog.dogName).join(", ")}
            </span>
          )}
          {props.paid && (
            <IconCheck
              size={24}
              className={cn("text-green-500", {
                "text-dark-100": props.categoryId === 3,
              })}
            />
          )}
        </div>
      );
    },
    []
  );
  const findMate = async (ev: CalendarEvent) => {
    // a) try local state first
    let mate = appointments.find(
      (e) =>
        e.bookingId?.toString() === ev.bookingId?.toString() &&
        e.isArrival !== ev.isArrival
    );
    if (mate) return mate;

    // b) fallback fetch – tiny window around ev
    const extraRaw = await getEventsWithPairs(
      ev.StartTime.toISOString(),
      ev.EndTime.toISOString()
    );
    const extra: any[] =
      typeof extraRaw === "string" ? JSON.parse(extraRaw) : extraRaw;
    mate = extra.find(
      (e: any) =>
        e.bookingId?.toString() === ev.bookingId?.toString() &&
        e.isArrival !== ev.isArrival
    ) as CalendarEvent | undefined;

    if (mate) setAppointments((a) => [...a, mate]); // keep state consistent
    return mate;
  };
  useEffect(() => {
    // Syncfusion already calculated the dates once it mounts
    const id = setTimeout(() => {
      const dates = scheduleObj.current?.getCurrentViewDates?.();
      console.log("Current view dates:", dates);
      if (dates?.length) {
        loadWindow(dates[0], dates[dates.length - 1]);
      }
    }, 0);
    return () => clearTimeout(id);
  }, [loadWindow]);

  const tooltip = (props: any) => {
    if (open || isDragging) return null;

    return (
      <div className="z-30 h-full min-w-[22vw] border-none text-light-900 outline-none">
        {renderIcon(props.categoryId)}
        <div className="mt-4 flex w-full flex-col gap-4 px-4">
          <div className="text-lg uppercase">{props.Subject}</div>
          {props.clientName && (
            <div className="flex flex-row items-center gap-2 truncate text-lg">
              <IconUser size={24} className="text-light-900" />
              {props.clientName}
            </div>
          )}
          {props.StartTime && (
            <div className="flex flex-row items-center gap-2 text-lg">
              <IconCalendar size={24} className="text-light-900" />
              {formatTime(new Date(props.StartTime), "el")}
            </div>
          )}
          {props.mobile && (
            <div className="flex flex-row items-center gap-2 text-lg">
              <IconPhone size={24} className="text-light-900" />
              {props.mobile}
            </div>
          )}
        </div>
      </div>
    );
  };
  const onActionBegin = (args: any) => {
    if (args.requestType === "viewNavigate") {
      loadWindow(args.startDate, args.endDate);
    }
  };
  const refreshCurrentWindow = () => {
    const dates = scheduleObj.current?.getCurrentViewDates?.();
    if (!dates[0] || !dates[dates.length - 1]) return;
    if (dates?.length) {
      loadWindow(dates[0], dates[dates.length - 1]);
    }
  };
  const onActionComplete = async (args: any) => {
    if (open) return;
    if (args.requestType === "eventCreated") {
      await createEvent({ event: args.addedRecords[0] });
    } else if (args.requestType === "eventChanged") {
      await updateEvent({ event: args.changedRecords[0] });
    } else if (args.requestType === "eventRemoved") {
      await deleteEvent({ event: args.deletedRecords[0] });
    }
    await refreshCurrentWindow();
  };

  const todayDayOfWeek = useMemo(() => new Date().getDay(), []);
  const onDragStart = (args: any) => {
    setIsDragging(true);
    // set Start Time to compare with end time
    setOriginalStartTime(args.data.StartTime);
  };
  const onDragStop = async (args: any) => {
    setIsDragging(false);
    if (open) return;
    const draggedEvent = args.data;
    const { StartTime, EndTime, isArrival, categoryId } = draggedEvent;
    if (![2, 3, 4].includes(categoryId)) return;
    const pairedEvent = await findMate(draggedEvent);
    if (!pairedEvent) return;

    if (isArrival && moment(EndTime).isAfter(pairedEvent.StartTime)) {
      alert(
        "Το χρονικό διάστημα της άφιξης δεν μπορεί να είναι μετά την αναχώρηση ή την παράδοση."
      );
      args.cancel = true;
      return;
    }
    if (!isArrival && moment(StartTime).isBefore(pairedEvent.EndTime)) {
      alert(
        "Η αναχώρηση ή η παράδοση δεν μπορεί να είναι πριν από την άφιξη ή την παραλαβή."
      );
      args.cancel = true;
      return;
    }

    setPairDate(isArrival ? pairedEvent.StartTime : pairedEvent.EndTime);

    if (
      moment(originalStartTime)
        .startOf("day")
        .isSame(moment(StartTime).startOf("day"))
    ) {
      try {
        await updateEventBookingOnlyTimeChange({ event: draggedEvent });
      } catch (error) {
        console.error(error);
      } finally {
        setOriginalStartTime(null);
      }
      return;
    }

    args.cancel = true;
    setLoading(true);
    const roomAvailability = checkRoomConflictFrontend(
      StartTime,
      draggedEvent,
      pairedEvent
    );
    if (roomAvailability) {
      alert("Δεν υπάρχει διαθέσιμο δωμάτιο για αυτήν την ημερομηνία.");
      setSelectedEvent(draggedEvent);
      setStage(2);
      toggleOpen();
      setLoading(false);
      return;
    }

    try {
      await updateBookingDateChange({
        event: draggedEvent,
        pairDate: pairedEvent?.StartTime,
      });
      const roomIds = draggedEvent.dogsData.map((dog: any) =>
        dog.roomId.toString()
      );
      const [from, to] = moment(StartTime).isBefore(pairedEvent.StartTime)
        ? [moment(StartTime), moment(pairedEvent.StartTime)]
        : [moment(pairedEvent.StartTime), moment(StartTime)];
      updateRoomOccupancyAfterDrag(from.toDate(), to.toDate(), roomIds);
      refreshCurrentWindow();
    } catch (error) {
      console.error(error);
    } finally {
      setOriginalStartTime(null);
      setLoading(false);
    }
  };
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const renderCell = (args: any) => {
    // For header cells (e.g., the date headers)
    if (args.element.classList.contains("e-header-cells")) {
      const dateHeader = args.element.querySelector(".e-header-day");
      if (dateHeader) {
        const cellDate = new Date(args.date); // args.date holds the date for that cell
        const formattedDate = formatDate(cellDate);

        // Check if revenue data exists for this date
        if (revenueData[formattedDate]) {
          const revenue = revenueData[formattedDate];
          // Append the revenue next to the date header
          dateHeader.innerHTML += ` <span class='headerDetail'>${revenue.toFixed(
            2
          )}€</span>`;
        }
      }
    }

    // For work cells (e.g., time slots)
    if (args.element.classList.contains("e-work-cells")) {
      const cellDate = new Date(args.date); // args.date holds the date for this cell
      const formattedTime = formatTime(cellDate, "el"); // Format the time (e.g., "09:30 π.μ.")

      // Create a new element to display the time
      const timeElement = document.createElement("div");
      timeElement.style.fontSize = "14px";
      timeElement.style.color = "#cbd5e1";
      timeElement.style.textAlign = "center";
      timeElement.textContent = formattedTime;

      // Append the time element to the cell
      args.element.appendChild(timeElement);
    }
  };

  const handleDoubleClick = async (args: any) => {
    const eventData = args.event;
    if (
      eventData?.categoryId === 2 ||
      eventData?.categoryId === 3 ||
      eventData?.categoryId === 4
    ) {
      args.cancel = true;
      // Prevent the default popup
      const pairEvent = await findMate(eventData);
      if (!pairEvent) return;
      dateRef.current = eventData.StartTime;
      setPairDate(pairEvent?.StartTime);
      setSelectedEvent(eventData);
      setStage(1);
      toggleOpen();
    }

    // Handle double click event
  };

  const handleSingleClick = async (args: any) => {
    if (
      args.event.categoryId === 2 ||
      args.event.categoryId === 3 ||
      args.event.categoryId === 4
    ) {
      args.cancel = true;
      setSelectedEvent(args.event);

      const pairEvent = await findMate(args.event);
      if (!pairEvent) return;
      setPairDate(pairEvent?.StartTime);
      setStage(0);
      dateRef.current = args.event.StartTime;
      removeClass([document.body], "e-popup-open");
      toggleOpen();
    }
  };
  const handleSingleClickDebounced = useMemo(
    () => debounce(handleSingleClick, 250),
    []
  );
  const onEventClick = (args: any) => {
    if ([2, 3, 4].includes(args.event.categoryId)) {
      args.cancel = true;
    }
    handleSingleClickDebounced(args);
  };

  const onEventDoubleClick = (args: any) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    handleDoubleClick(args); // Handle the double-click immediately
  };
  const timeScale = useMemo(
    () => ({ enable: true, interval: 60, slotCount: 2 }),
    []
  );
  const onPopupOpen = (args: any) => {
    if (args.type === "Editor") {
      const categoryElement = args.element.querySelector("#categoryId");

      // If the category dropdown exists, remove it from the DOM
      if (categoryElement) {
        const categoryContainer = categoryElement.closest(".e-control-wrapper"); // Find the wrapper to remove
        if (categoryContainer) {
          categoryContainer.remove(); // Remove the entire category dropdown container
        }
      }
    }
  };

  const onResizeStart = (args: any) => {
    const eventData = args.data;
    if (eventData.categoryId !== 1) {
      args.cancel = true; // Prevent resizing for events not in category 1
    }
  };
  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <BarLoader />
      </div>
    );
  return (
    <ScheduleComponent
      ref={scheduleObj}
      popupOpen={onPopupOpen}
      actionBegin={onActionBegin}
      rowAutoHeight={true}
      className="h-full w-full rounded-lg"
      width="100%"
      height="100%"
      startHour="07:00"
      endHour="23:45"
      timeScale={timeScale}
      renderCell={renderCell}
      allowResizing={true}
      resizeStart={onResizeStart}
      eventSettings={{
        ignorewhitespace: true,
        dataSource: appointments,
        tooltipTemplate: tooltip,
        enableTooltip: !isDragging && !open,
        allowEditing: true,
        resources: ["Categories"],

        template: eventTemplate,
      }}
      dragStart={onDragStart}
      actionComplete={onActionComplete}
      eventDoubleClick={onEventDoubleClick}
      eventClick={onEventClick}
      selectedDate={dateRef.current}
      dragStop={onDragStop}
      locale="el"
      enablePersistence={true}
    >
      <ResourcesDirective>
        <ResourceDirective
          field="categoryId" // Map CategoryId from the event data
          title="Category"
          name="Categories"
          // Allow single category per event
          dataSource={mockCategoryData} // Categories for Personal, Booking, Transport
          textField="text"
          idField="id"
          colorField="color"
        />
      </ResourcesDirective>
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" firstDayOfWeek={todayDayOfWeek} />
        <ViewDirective option="Month" />
        <ViewDirective option="TimelineMonth" />
        <ViewDirective option="TimelineWeek" firstDayOfWeek={todayDayOfWeek} />
      </ViewsDirective>

      <Inject
        services={[
          Day,
          Week,
          Month,
          TimelineMonth,
          DragAndDrop,
          TimelineViews,
          Resize,
        ]}
      />
    </ScheduleComponent>
  );
};

export default Scheduler;
