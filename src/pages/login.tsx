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
       <> 
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-3xl">StudySmart</h1>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa}}
                        theme="dark"
                        providers={[]}
                        localization={{
                            variables: {
                            sign_in: {
                                email_label: 'Votre email',
                                password_label: 'Votre mot de passe',
                                email_input_placeholder: 'entrez un email',
                                password_input_placeholder: 'entrez un mot de passe',
                                button_label: 'Créer un compte',
                                loading_button_label: 'chargement...',
                                social_provider_text: 'Se connecter avec {{provider}}',
                                link_text: "Vous n'avez pas encore de compte? Créer un compte"
                            },
                            },
                        }}
                    />
                </div>
            </div>
            <div className="absolute bottom-4 right-4">
                <p className="text-2xl text-slate-400">v0.2.5</p>
            </div>
        </>
    )
}

export default Login;

