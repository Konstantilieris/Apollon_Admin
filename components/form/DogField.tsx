import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  TypesOfBehavior,
  TypesOfBreed,
  TypesOfFood,
  TypesOfGender,
} from "@/constants";
import { DateInput } from "../shared/DateInput";
import { Input } from "../ui/input";

const DogField = ({ form, index }: any) => {
  const namePrefix = `dogs[${index}]`;
  return (
    <div className="flex flex-col">
      <FormField
        control={form.control}
        name={`${namePrefix}.name`}
        render={({ field }) => (
          <FormItem className="form_item">
            <FormLabel className="form_label">Όνομα</FormLabel>
            <FormControl>
              <Input
                autoComplete="new-password"
                {...field}
                className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input ml-2 max-w-[333px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${namePrefix}.gender`}
        render={({ field }) => (
          <FormItem className=" flex flex-row items-center gap-8">
            <FormLabel className="form_label ">Φύλο</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[265px] rounded-lg p-2 font-noto_sans font-bold">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                {TypesOfGender.map((item) => (
                  <SelectItem
                    className={`hover:bg-sky-blue hover:opacity-50 `}
                    value={item}
                    key={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${namePrefix}.breed`}
        render={({ field }) => (
          <FormItem className=" flex flex-row items-center gap-8">
            <FormLabel className="form_label ">Ράτσα</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[260px] rounded-lg p-2 font-noto_sans font-bold">
                  <SelectValue placeholder="Ράτσα" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                {TypesOfBreed.sort().map((item) => (
                  <SelectItem
                    className={`hover:bg-sky-blue hover:opacity-50 `}
                    value={item}
                    key={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${namePrefix}.behavior`}
        render={({ field }) => (
          <FormItem className=" flex flex-row items-center gap-10">
            <FormLabel className="form_label ">Συμπεριφορά</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[235px] rounded-lg p-2 font-noto_sans font-bold">
                  <SelectValue placeholder="Behavior" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                {TypesOfBehavior.map((item) => (
                  <SelectItem
                    className={`hover:bg-sky-blue hover:opacity-50 `}
                    value={item}
                    key={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />{" "}
      <FormField
        control={form.control}
        name={`${namePrefix}.birthdate`}
        render={({ field }) => (
          <FormItem className=" flex flex-row items-center gap-4 ">
            <FormLabel className="form_label  ">Ημ.Γέννησης</FormLabel>
            <FormControl>
              <DateInput field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${namePrefix}.food`}
        render={({ field }) => (
          <FormItem className=" flex flex-row items-center gap-8">
            <FormLabel className="form_label ">Τύπος Τροφής</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[230px] rounded-lg p-2 font-noto_sans font-bold">
                  <SelectValue placeholder="Επέλεξε τύπο τροφής" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                {TypesOfFood.map((item) => (
                  <SelectItem
                    className={`hover:bg-sky-blue hover:opacity-50 `}
                    value={item}
                    key={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DogField;
