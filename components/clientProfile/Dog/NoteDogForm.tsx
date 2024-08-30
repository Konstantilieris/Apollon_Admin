import React from "react";
import { Textarea } from "@/components/ui/textarea";
interface NoteDogProps {
  note: string;
  setNote: (note: string) => void;
}
const NoteDogForm = ({ note, setNote }: NoteDogProps) => {
  return (
    <div>
      <Textarea
        placeholder="Πληκτρολογήστε την σημείωσή σας εδώ"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[20vh]"
      />
    </div>
  );
};

export default NoteDogForm;
