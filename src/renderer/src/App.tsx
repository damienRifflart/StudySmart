import {ModeToggle} from "@/components/mode-toggle"
import {HomeworkCard} from "@/components/homework-card"
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {AddHomework} from "@/components/add-homework"
import supabase from '@/config/supabaseClient'
import {useEffect, useState} from 'react'
import {motion} from "framer-motion"

interface Homework {
  created_at: Date,
  subject: string,
  description: string,
  time: string,
  deadline: Number,
  done: boolean
}

function App() {
  const [error, setError] = useState<string | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [workTimeLeft, setWorkTimeLeft] = useState<number>(0);
  const [showAddHomework, setShowAddHomework] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<string[]>([]);

  // Fetches the homeworks data from the database and updates the state with the fetched data.
  useEffect(() => {
    const fetchHomeworks = async (): Promise<void> => {
      // Fetch the data from the database
      const { homeworks, error } = await supabase.from('homeworks').select();

      if (error) {
        // If there was an error, set the error state and log the error
        setError('Could not fetch the homeworks');
        console.error(error);
      } else {
        let totalTime = 0;
        // Iterate over the fetched data and calculate the total time
        homeworks.map((homework: Homework) => { 
          if (!homework.done) {
            totalTime += Number(homework.time);
          }
        });

        const {subjects} = await supabase.from('subjects').select('name');
        console.log(subjects)
        // Update the state with the fetched data and the calculated total time
        setWorkTimeLeft(totalTime);
        setHomeworks(homeworks);
      }
    };

    fetchHomeworks();
  }, [homeworks]);

  const formatDate = (date: Date): string => {
    const monthNames = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const renderHomeworkCard = (activeTab: string) => {
    const filteredHomeworks = homeworks.filter(homework => homework.subject === activeTab);

    return (
      <div className="">
        <div className="flex flex-row flex-wrap max-h-[30rem] overflow-y-auto">
          {activeTab != 'Tout' ? ( 
            filteredHomeworks.map(homework => (
              <motion.div
                initial={{ opacity: 0, y:-20 }}
                animate={{
                  opacity: 1 ,
                  y: 0,
                }}
                transition={{ duration: 0.2 }}
                >
                <HomeworkCard key={homework.created_at} homework={homework} />
              </motion.div>
            ))
          ) : (
            homeworks.map(homework => (
              <motion.div
              initial={{ opacity: 0, y:-20  }}
              animate={{
                opacity: 1 ,
                y: 0,
              }}
              transition={{ duration: 0.2 }}
              >
                <HomeworkCard key={homework.created_at} homework={homework} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Fetches every subjects from the database
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from('subjects').select('subject');
      // Map the fetched data to an array of subjects and add a default subject
      const subjects = [...data.map(({ subject }: { subject: string }) => subject)];

      setSubjects(subjects);
    };

    fetchSubjects();
  }, []);
  
  return (
    <>
      <div className="flex flex-col">
        <div className="top-5 left-5 relative">
          <div className="text-4xl font-semibold w-screen">
            <div className="absolute">
              <ModeToggle />
            </div>
            <div className="ml-[6rem] flex flex-col">
              <h1>Bonjour, <span className='text-primary'>Damien</span></h1>
              <h1>On est le <span>{formatDate(new Date())}</span></h1>
            </div>
          </div>
        </div>

        <div className="relative left-[7rem] top-20">
          <Tabs defaultValue="Tout" className="w-[70rem]">
            <TabsList>
              <TabsTrigger value='Tout'>Tout</TabsTrigger>
                {
                  subjects.map((subject) => (
                    <TabsTrigger key={subject} value={subject}>{subject}</TabsTrigger>
                  ))
                }
            </TabsList>

            <TabsContent value="Tout">
              <div className="w-full max-w-[59rem] relative flex flex-col mt-4">
                {error && <p>{error}</p>}
                {renderHomeworkCard('Tout')}

                <div className="flex flex-row mt-4">
                  <div className="absolute right-5 bottom-0">
                    <Button onClick={() => setShowAddHomework(!showAddHomework)} className="text-accent-foreground text-xl font-normal">
                      Ajouter un devoir
                    </Button>
                  </div>
                  <p className="text-2xl">
                    Il te reste encore
                    <span className="text-primary">{' ' + workTimeLeft.toString()}</span> minutes de travail.
                  </p>
                </div>
              </div>
                
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: showAddHomework ? 1 : 0,
                y: showAddHomework ? 0 : -20,
              }}
              transition={{ duration: 0.2 }}
              className='absolute right-[13rem] top-[5.5rem]'
            >
                <AddHomework />
              </motion.div>
            </TabsContent>

            {
              subjects.map(subject => (
                <TabsContent key={subject} value={subject}>
                  <div className="mt-3">
                    {renderHomeworkCard(subject)}
                  </div>
                </TabsContent>
              ))
            }
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default App