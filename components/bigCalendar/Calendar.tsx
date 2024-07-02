"use client";

import React, { useEffect } from "react";

import {
  Week,
  Day,
  Month,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Inject,
} from "@syncfusion/ej2-react-schedule";
import { registerLicense, L10n, loadCldr } from "@syncfusion/ej2-base";

import * as greekLocale from "cldr-data/main/el/ca-gregorian.json"; // Greek CLDR data
import * as greekNumbers from "cldr-data/main/el/numbers.json";
import * as greekTime from "cldr-data/main/el/timeZoneNames.json";
import { cn } from "@/lib/utils";
import "./calendar.css";
const registerKey = process.env.NEXT_PUBLIC_REGISTER_KEY; // Set a default value if the key is undefined
registerLicense(registerKey!);
loadCldr(greekLocale, greekNumbers, greekTime);
L10n.load({
  el: {
    schedule: {
      day: "Ημέρα",
      week: "Εβδομάδα",
      workWeek: "Εργάσιμη εβδομάδα",
      month: "Μήνας",
      agenda: "Ατζέντα",
      weekAgenda: "Εβδομαδιαία ατζέντα",
      workWeekAgenda: "Ατζέντα εργασίας εβδομάδας",
      monthAgenda: "Μηνιαία ατζέντα",
      today: "Σήμερα",
      noEvents: "Δεν υπάρχουν γεγονότα",
      emptyContainer:
        "Δεν υπάρχουν προγραμματισμένα γεγονότα για αυτήν την ημέρα.",
      allDay: "Όλη μέρα",
      start: "Αρχή",
      end: "Τέλος",
      more: "περισσότερα",
      close: "Κλείσιμο",
      cancel: "Ακύρωση",
      noTitle: "(Χωρίς τίτλο)",
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
      timelineWeek: "Χρονική Εβδομάδα",
      timelineWorkWeek: "Χρονική Εργάσιμη Εβδομάδα",
      timelineMonth: "Χρονικός Μήνας",
      expandAllDaySection: "Επέκταση",
      collapseAllDaySection: "Σύμπτυξη",
    },
  },
});

const Scheduler = ({ appointments }: any) => {
  const [size, setSize] = React.useState({ width: 1600, height: 770 });
  useEffect(() => {
    const updatePageSize = () => {
      if (window.matchMedia("(min-width: 2000px)").matches) {
        setSize({ width: 2200, height: 1100 });
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        setSize({ width: 1600, height: 770 });
      } else {
        setSize({ width: 1200, height: 600 });
      }
    };

    updatePageSize(); // Initial update

    const resizeHandler = () => {
      updatePageSize();
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);
  const eventTemplate = (props: any) => {
    return (
      <div
        className={cn(
          "font-noto_sans p-1 text-center w-full text-white font-semibold",
          {
            "bg-red-500 relative":
              props.Type === "ΑΦΙΞΗ" || props.Type === "ΑΝΑΧΩΡΗΣΗ",
            "bg-blue-500 relative":
              props.Type === "ΠΑΡΑΔΟΣΗ" || props.Type === "ΠΑΡΑΛΑΒΗ",
          }
        )}
      >
        <div>{props.Subject}</div>
      </div>
    );
  };

  return (
    <ScheduleComponent
      className="w-full rounded-lg "
      height={size.height}
      width={size.width}
      readonly={true}
      eventSettings={{
        dataSource: appointments.map((appointment: any) => ({
          ...appointment,
        })),
        template: eventTemplate,
        enableTooltip: true,
      }}
      selectedDate={new Date()}
      quickInfoTemplates={{ footer: "Admin" }}
      locale="el"
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="Month" />
      </ViewsDirective>

      <Inject services={[Day, Week, Month]} />
    </ScheduleComponent>
  );
};

export default Scheduler;
