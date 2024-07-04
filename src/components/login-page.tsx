import React from "react"
import supabase from "@/config/supabaseClient"
import {Auth} from "@supabase/auth-ui-react"
import {ThemeSupa} from "@supabase/auth-ui-shared"
import {useNavigate} from "react-router-dom"

function Login() {
    const navigate = useNavigate();

    supabase.auth.onAuthStateChange(async (event) => {
        if (event === "SIGNED_IN") {
            // forward to success url
            navigate("/success") 
        } else {
            // forward to login page
            navigate("/") 
        }
    })

    return(
        <div>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa}}
                theme="dark"
                providers={["discord"]}
            />
        </div>
    )
}

export default Login;

