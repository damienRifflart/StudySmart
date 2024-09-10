import Welcome from "@/components/welcome"
import AddHomework from "@/components/add-homework"
import fetchData from "@/components/fetchData"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import supabase from "@/config/supabase-client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'


function Success() {
  const [user, setUser] = useState({})
  const navigate = useNavigate()

  // Get user data
  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          setUser(value.data.user)
        }
      })
    }
    getUserData()
  }, [])

  async function signOutUser() {
    const { error } = await supabase.auth.signOut()
    if (error) { console.log(error) }

    navigate("/")
  }

  return (
    <>
      {Object.keys(user).length !== 0 ? (
        <>
          <div className="absolute top-10 right-10">
            <Button onClick={() => signOutUser()}>Déconnexion</Button>
          </div>

          <div className="flex flex-col gap-10 ml-10 mt-10">
            <Welcome />

            <Tabs defaultValue="general">
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
      ) : (
        <div className="flex flex-col gap-5 justify-center items-center w-screen h-screen">
          <h1 className="text-5xl">Vous n'êtes pas connecté. Veuillez créer un compte.</h1>
          <Button onClick={() => navigate('/')}>Créer un compte</Button>
        </div>
      )}
    </>
  );
}


export default Success
