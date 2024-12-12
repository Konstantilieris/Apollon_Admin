"use client";

import React, { useCallback, useRef, useState } from "react";

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
} from "@tabler/icons-react";
import {
  createEvent,
  deleteEvent,
  updateBookingDateChange,
  updateEvent,
  updateEventBookingOnlyTimeChange,
} from "@/lib/actions/event.action";

import { checkBookingRoomAvailability } from "@/lib/actions/booking.action";
import "./calendar.css";

import moment from "moment";
import useCalendarModal from "@/hooks/use-calendar-modal";
import { cn, formatTime } from "@/lib/utils";

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
// No dependencies, this will remain the same unless the logic inside changes.

const Scheduler: React.FC<{ appointments: any; revenueData: any }> = ({
  appointments,
  revenueData,
}) => {
  const { setPairDate, setStage, setSelectedEvent, toggleOpen, open } =
    useCalendarModal();
  const scheduleObj = useRef(null);

  const dateRef = useRef(new Date());
  const [isDragging, setIsDragging] = useState(false);
  // eslint-disable-next-line no-undef
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
  const mockCategoryData = [
    { text: "Personal", id: 1, color: "#00008B" },
    { text: "Arrival", id: 2, color: "#4B0082" },
    { text: "Departure", id: 4, color: "#9d174d" },
    { text: "Transport", id: 3, color: "#32CD32" },
    { text: "Training", id: 5, color: "#ea580c" },
  ];

  const eventTemplate = (props: any) => {
    return (
      <div
        style={{
          // Apply the event color or default
          color: "white", // You can also change the text color here
        }}
        className={cn("flex  gap-2 pl-1 pt-1 text-[1rem] w-full  ")}
      >
        <span
          className={cn(" ", { "w-full text-center": props.categoryId === 1 })}
        >
          {props.Subject}
        </span>

        <span className="  flex flex-row gap-1 truncate pt-[2px] text-sm">
          {" "}
          {props.dogsData
            ? props.dogsData.map((dog: any) => dog.dogName).join(", ")
            : ""}
        </span>
        {}
      </div>
    );
  };

  const tooltip = (props: any) => {
    if (open || isDragging) return null;

    return (
      <div className="h-full min-w-[22vw] border-none  text-light-900 outline-none ">
        {renderIcon(props.categoryId)}
        <div
          className={cn("mt-4 flex w-full flex-col gap-4 px-4", {
            "pt-2": props.categoryId === 1,
          })}
        >
          <div className="text-lg uppercase">{props.Subject}</div>
          {props.clientName ? (
            <div className="flex flex-row items-center gap-2 truncate text-lg">
              <IconUser size={24} className="text-light-900" />
              {props.clientName}
            </div>
          ) : (
            <></>
          )}
          {props.StartTime ? (
            <div className="flex flex-row items-center gap-2 text-lg">
              <IconCalendar size={24} className="text-light-900" />
              {formatTime(new Date(props.StartTime), "el")}
            </div>
          ) : (
            ""
          )}
          {props.mobile ? (
            <div className="flex flex-row items-center gap-2 text-lg">
              <IconPhone size={24} className="text-light-900" />
              {props.mobile}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
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
  };

  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const onDragStart = (args: any) => {
    setIsDragging(true);
  };
  const onDragStop = async (args: any) => {
    setIsDragging(false);
    if (open) return;
    const draggedEvent = args.data;

    // Check if it's a booking event and has a paired event (e.g., arrival/departure or pick-up/delivery)
    if (
      draggedEvent?.categoryId === 2 ||
      draggedEvent?.categoryId === 3 ||
      draggedEvent?.categoryId === 4
    ) {
      const { Id, StartTime, EndTime, Type, isArrival } = draggedEvent;

      // Find the paired event (e.g., the other event with the same bookingId)
      const pairedEvent = appointments.find(
        (event: any) => event.Id === Id && event.isArrival !== isArrival
      );

      let isTimeChangeValid = true; // Track if the time change is valid

      if (pairedEvent) {
        const pairedStartTime = pairedEvent.StartTime;
        const pairedEndTime = pairedEvent.EndTime;

        // Check constraints based on the event type (arrival/departure or pick-up/delivery)
        if (isArrival) {
          if (moment(EndTime).isAfter(pairedStartTime)) {
            alert(
              "The arrival or pick-up cannot be later than the departure or delivery."
            );
            isTimeChangeValid = false;

            args.cancel = true;
          }
          setPairDate(pairedStartTime);
        } else if (!isArrival) {
          // For departure or delivery, make sure the dragged event starts after the paired arrival or pick-up
          if (moment(StartTime).isBefore(pairedEndTime)) {
            alert(
              "The departure or delivery cannot be earlier than the arrival or pick-up."
            );
            isTimeChangeValid = false;
            args.cancel = true;
          }
        }
        setPairDate(pairedEndTime);
      }

      // If time constraints are valid and there's a time change, check room availability
      if (isTimeChangeValid) {
        // Check if only the time has changed (compare the mm/dd/yyyy of both dates)
        const originalEvent = appointments.find(
          (event: any) => event.Id === Id && event.Type === Type
        );

        const originalStartDate = new Date(
          originalEvent.StartTime
        ).toLocaleDateString();
        const draggedStartDate = new Date(StartTime).toLocaleDateString();

        // If only the time has changed (same mm/dd/yyyy), skip room availability check
        if (originalStartDate === draggedStartDate) {
          try {
            await updateEventBookingOnlyTimeChange({ event: draggedEvent });
          } catch (error) {
            console.error(error);
          }
        } else {
          // If the date has changed, check for room availability
          const roomAvailability = await checkBookingRoomAvailability({
            date: StartTime,
            bookingId: Id,
            type: Type,
          });

          if (roomAvailability) {
            alert("The room is not available for the selected time range.");
            setStage(2);
            setSelectedEvent(draggedEvent);
            args.cancel = true;
            removeClass([document.body], ["e-popup-open", "e-navigate"]);
            toggleOpen();
          } else {
            try {
              const pairDate = pairedEvent?.StartTime;
              await updateBookingDateChange({
                event: draggedEvent,
                pairDate,
              });
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
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

  const handleDoubleClick = (args: any) => {
    const eventData = args.event;
    if (
      eventData?.categoryId === 2 ||
      eventData?.categoryId === 3 ||
      eventData?.categoryId === 4
    ) {
      args.cancel = true;
      // Prevent the default popup
      const pairEvent = appointments.find(
        (event: any) =>
          event.Id === args.event.Id && event.isArrival !== args.event.isArrival
      );
      dateRef.current = eventData.StartTime;
      setPairDate(pairEvent?.StartTime);
      setSelectedEvent(eventData);
      setStage(1);
      toggleOpen();
    }

    // Handle double click event
  };

  const handleSingleClick = (args: any) => {
    if (
      args.event.categoryId === 2 ||
      args.event.categoryId === 3 ||
      args.event.categoryId === 4
    ) {
      args.cancel = true;
      setSelectedEvent(args.event);

      const pairEvent = appointments.find(
        (event: any) =>
          event.Id === args.event.Id && event.isArrival !== args.event.isArrival
      );
      setPairDate(pairEvent?.StartTime);
      setStage(0);
      dateRef.current = args.event.StartTime;
      removeClass([document.body], "e-popup-open");
      toggleOpen();
    }
  };
  const onEventClick = (args: any) => {
    if (
      args.event.categoryId === 2 ||
      args.event.categoryId === 3 ||
      args.event.categoryId === 4
    ) {
      args.cancel = true;
    }
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Set a timeout for single-click handling
    clickTimeoutRef.current = setTimeout(() => {
      handleSingleClick(args); // Handle single-click after delay
    }, 250); // 250ms delay for detecting double-clicks
  };

  const onEventDoubleClick = (args: any) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    handleDoubleClick(args); // Handle the double-click immediately
  };
  const timeScale = { enable: true, interval: 60, slotCount: 2 };
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

  return (
    <ScheduleComponent
      ref={scheduleObj}
      popupOpen={onPopupOpen}
      rowAutoHeight={true}
      className="   w-full rounded-lg "
      height={"100%"}
      width={"100%"}
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
        enableTooltip: !isDragging,
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
