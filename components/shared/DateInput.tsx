"use client"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {  CalendarIcon} from "lucide-react"
import { Calendar } from "../ui/calendar"
import React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export function DateInput({field}:any) {
    const [stringDate, setStringDate] = React.useState<string>("")
    const [date, setDate] = React.useState<Date>()
    const [errorMessage, setErrorMessage] = React.useState<string>("")
    console.log
    return (
      <Popover>
        <div className="relative w-[280px]">
          <Input
            className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
            type="string"
            value={stringDate}
            onChange={(e) => {
              setStringDate(e.target.value)
              field.onChange(e.target.value)
              const parsedDate = new Date(e.target.value)
              if (parsedDate.toString() === "Invalid Date") {
                setErrorMessage("Invalid Date")
                field.onChange('')
              } else {
                setErrorMessage("")
                field.onChange(parsedDate)
                
              }
            }}
          />
          {errorMessage !== "" && (
            <div className="absolute bottom-[-1.75rem] left-0 text-red-400 text-sm">
              {errorMessage}
            </div>
          )}
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "font-normal absolute right-0 translate-y-[-50%] top-[50%] border-none mr-2",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0 background-light900_dark300 text-dark300_light700 font-changa">
          <Calendar
            className="rounded-md border shadow"
            mode="single"
            selected={field.value}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
           
            onSelect={(selectedDate) => {
              if (!selectedDate) return
              
              field.onChange(selectedDate)
              setStringDate(format(selectedDate, "MM/dd/yyyy"))
              setErrorMessage("")
            }}
            defaultMonth={date}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }