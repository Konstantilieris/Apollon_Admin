"use client";

import { useExpensesStore } from "@/hooks/expenses-store";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteMultipleExpenses } from "@/lib/actions/expenses.action";

const DeleteExpenses = () => {
  const { toast } = useToast();
  const { toDeleteExpenses, resetStore, onClose } = useExpensesStore();

  const handleDelete = async () => {
    try {
      // 1) Get an array of expense IDs
      const ids = toDeleteExpenses
        .map((expense) => expense._id)
        .filter((id): id is string => id !== undefined);
      // 2) Call server action
      const res = await deleteMultipleExpenses(ids);
      // 3) Check result
      if (res.success) {
        toast({
          title: "Έξοδα διαγράφηκαν",
          description: `${toDeleteExpenses.length} έξοδα διαγράφηκαν.`,
        });
        // 4) Reset store and close modal
        resetStore();
        onClose();
      } else {
        toast({
          title: "Σφάλμα",
          description: "Η διαγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting expenses:", error);
      toast({
        title: "Σφάλμα",
        description: "Η διαγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά.",
        variant: "destructive",
      });
    }
  };

  if (toDeleteExpenses.length === 0) {
    return null;
  }
  console.log("toDeleteExpenses", toDeleteExpenses);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτά τα έξοδα;
        </h2>
        <p className="text-sm text-muted-foreground">
          Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Τα παρακάτω έξοδα θα
          διαγραφούν οριστικά:
        </p>
      </div>
      <ScrollArea className="h-[200px] rounded-md border">
        <ul className="divide-y">
          {toDeleteExpenses.map((expense) => (
            <li
              key={expense._id}
              className="flex items-center justify-between p-4"
            >
              <span className="text-sm">{expense.description}</span>
              <span className="text-sm font-semibold">
                {expense?.totalAmount
                  ? `€${expense.totalAmount.toFixed(2)}`
                  : "€0.00"}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Ακύρωση
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Διαγραφή
        </Button>
      </div>
    </div>
  );
};

export default DeleteExpenses;
