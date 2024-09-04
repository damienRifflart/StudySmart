import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { useState } from "react"
import { Button } from "@/components/ui/button"

function AddHomework() {
  const [subject, setSubject] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [deadline, setDeadline] = useState<Date>();
  const [time, setTime] = useState<number>();

  return(
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un devoir</CardTitle>
        <CardDescription>Précisez une desciption, une date, une matière...</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">

        <Select onValueChange={setSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="matière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="francais">Français</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="description" onChange={(e) => setDescription(e.target.value)}/>
        <DatePicker setDeadline={setDeadline} deadline={deadline}/>
        <Input placeholder="temps requis (mins)" onChange={(e) => setTime(Number(e.target.value))}/>

      </CardContent>

      <CardFooter>
        <Button className="text-xl" disabled={!subject || !deadline || !time || !description}>Ajouter le devoir</Button>
      </CardFooter>
    </Card>
  )
}

export default AddHomework;