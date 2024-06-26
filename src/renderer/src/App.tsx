import { ModeToggle } from "@/components/mode-toggle"
import { HomeworkCard } from "@/components/HomeworkCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import supabase from '../../config/supabaseClient'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [homeworks, setHomeworks] = useState<any[] | null>(null)

  useEffect(() => {
    const fetchHomeworks = async () => {
      const { data, error } = await supabase
        .from('homeworks')
        .select()
      
        if (error) {
          setFetchError('Could not fetch the homeworks')
          setHomeworks(null)
          setFetchError(error.toString())
          console.log(error)
        }

        if (data) {
          setHomeworks(data);
          setFetchError(null);
        }
    }
    fetchHomeworks()
  }, [])

  const date = new Date();
  const listMonth = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];
  const day = date.getDate();
  const month = listMonth[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  return (
    <>
    <div className="flex flex-col">
      <div className="top-5 left-5 relative">
          <div className="text-4xl font-semibold w-screen">
            <div className="absolute">
              <ModeToggle></ModeToggle>
            </div>
            <div className="ml-[6rem] flex flex-col">
              <h1>Bonjour, <span className='bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text'>Damien</span></h1>
              <h1>On est le <span>{formattedDate}</span></h1>
            </div>
          </div>
        </div>

        <div className="relative left-[7rem] top-20 bg-red">
          <Tabs defaultValue="Tout" className="w-full">
            <TabsList>
              <TabsTrigger value="Tout">Tout</TabsTrigger>
              <TabsTrigger value="Maths">Maths</TabsTrigger>
              <TabsTrigger value="Français">Français</TabsTrigger>
              <TabsTrigger value="Physique">Physique</TabsTrigger>
              <TabsTrigger value="Histoire">Histoire</TabsTrigger>
            </TabsList>
            <TabsContent value="Tout">
              <p className="text-2xl mb-3">Tous les devoirs:</p>
              {fetchError && (<p>{fetchError}</p>)}
                {homeworks && (
                  <div className="flex flex-row flex-wrap">
                    {homeworks.map(homework => (
                      <HomeworkCard key={homework.id} homework={homework}></HomeworkCard>
                    )
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="Maths">Maths</TabsContent>
            <TabsContent value="Français">Français</TabsContent>
            <TabsContent value="Physique">Physique</TabsContent>
            <TabsContent value="Histoire">Histoire</TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default App
