"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { frCH } from 'date-fns/locale'; 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ setDeadline, deadline }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-start text-left font-normal text-md bg-bg-start-color border border-gray-800 text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
          {deadline ? format(deadline, "PPP") : <span className="text-gray-400">Choisis la date limite</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 border-0">
        <Calendar
          locale={frCH}
          mode="single"
          selected={deadline}
          onSelect={setDeadline}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
