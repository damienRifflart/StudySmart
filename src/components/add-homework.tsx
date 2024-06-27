import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import supabase from '@/config/supabaseClient'
import {format} from "date-fns"
import {Calendar as CalendarIcon} from "lucide-react"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import React, {useState} from 'react'

export function AddHomework() {
    const [subject, setSubject] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [deadline, setDeadline] = useState<string | null>(null);

    async function addDB() {
        if (deadline === null) {
            console.error('Deadline is not set.');
            return;
        }

        const today = new Date();
        const deadlineDate = new Date(deadline);
        const deadlineDifference = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const { error } = await supabase
          .from('homeworks')
          .insert(
            {
              created_at: today,
              subject: subject,
              description: description.toString(),
              time: time,
              deadline: deadlineDifference,
              done: false
            },
          )
          .select()

        if (error) {
            console.log(`Error while inserting homework: ${error}`)
        }
    }
    
    return(
        <Card>
            <CardHeader>
            <CardTitle>Ajouter un devoir</CardTitle>
            </CardHeader>
            <CardContent>
            <Select onValueChange={setSubject}>
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choisis une matière" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                    <SelectLabel>Maths</SelectLabel>
                    <SelectItem value="Maths">Maths</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Physique">Physique</SelectItem>
                    <SelectItem value="Histoire">Histoire</SelectItem>
                </SelectGroup>
                </SelectContent>
            </Select>
            <Input className="mt-4" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={`w-[280px] justify-start text-left font-normal mt-4 ${!deadline && "text-muted-foreground"}`}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : <span>Choisis la date limite</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            <Input className="mt-4" placeholder="Temps requis (minutes)" type="number" value={time} onChange={(e) => setTime(e.target.value)} />
            </CardContent>
            <CardFooter>
            <Button className="text-accent-foreground text-xl text-normal" onClick={addDB}>Ajouter</Button>
            </CardFooter>
        </Card>
    )
}