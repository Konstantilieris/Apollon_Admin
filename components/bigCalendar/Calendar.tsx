"use client";

import React from "react";

import {
  Week,
  Day,
  Month,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Inject,
  TimelineMonth,
} from "@syncfusion/ej2-react-schedule";
import { registerLicense, L10n, loadCldr } from "@syncfusion/ej2-base";

import * as greekLocale from "cldr-data/main/el/ca-gregorian.json"; // Greek CLDR data
import * as greekNumbers from "cldr-data/main/el/numbers.json";
import * as greekTime from "cldr-data/main/el/timeZoneNames.json";
import { cn } from "@/lib/utils";
import "./calendar.css";

import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/actions/event.action";
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
  const eventTemplate = (props: any) => {
    return (
      <div
        className={cn(
          "font-noto_sans pb-4  w-full text-white  font-semibold   items-center flex justify-center min-h-[50px] gap-2"
        )}
        style={{ backgroundColor: props.Color ? props.Color : "transparent" }}
      >
        {" "}
        {props.Subject}
      </div>
    );
  };

  const onActionComplete = async (args: any) => {
    if (args.requestType === "eventCreated") {
      await createEvent({ event: args.addedRecords[0] });
      window.location.reload();
    } else if (args.requestType === "eventChanged") {
      await updateEvent({ event: args.changedRecords[0] });
      window.location.reload();
    } else if (args.requestType === "eventRemoved") {
      await deleteEvent({ event: args.deletedRecords[0] });
      window.location.reload();
    }
  };

  return (
    <ScheduleComponent
      className=" w-full rounded-lg"
      height={"88%"}
      width={"100%"}
      startHour="07:00"
      endHour="23:30"
      eventSettings={{
        dataSource: appointments,
        fields: {
          isReadonly: "IsReadonly",
        },

        template: eventTemplate,
      }}
      actionComplete={onActionComplete}
      selectedDate={new Date()}
      locale="el"
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="Month" />
        <ViewDirective option="TimelineMonth" />
      </ViewsDirective>

      <Inject services={[Day, Week, Month, TimelineMonth]} />
    </ScheduleComponent>
  );
};

export default Scheduler;
