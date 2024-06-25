import { ModeToggle } from "@/components/mode-toggle"
import { HomeworkCard } from "@/components/HomeworkCard"
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

  return (
    <>
      <div className="top-5 left-5 absolute">
        <ModeToggle></ModeToggle>
      </div>
      <div>
        {fetchError && (<p>{fetchError}</p>)}
        {homeworks && (
          <div>
            {homeworks.map(homework => (
              <HomeworkCard key={homework.id} homework={homework}></HomeworkCard>
            )
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default App
