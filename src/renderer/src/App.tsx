import Welcome from "@/components/welcome"
import AddHomework from "@/components/add-homework"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


function App() {
  const fetchSubjects = () => {
    return null
  }

  const fetchHomeworks = () => {
    return null
  }

  return (
    <>
      <div className="flex flex-col gap-10 ml-10 mt-10">
        <Welcome />

        <Tabs defaultValue="Général">
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="francais">Français</TabsTrigger>
            <TabsTrigger value="done-homeworks">Devoirs finis</TabsTrigger>
          </TabsList>

          <TabsContent value="general">Général</TabsContent>
          <TabsContent value="francais">Français</TabsContent>
          <TabsContent value="done-homeworks">Devoirs finis</TabsContent>
        </Tabs>
      </div>

      <div className="right-10 absolute top-40">
        <AddHomework />
      </div>
    </>
  )
}

export default App
