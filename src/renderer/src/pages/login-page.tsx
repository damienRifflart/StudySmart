import { useEffect } from 'react';
import supabase from "@/config/supabase-client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/success");

        try {
          const { data, error } = await supabase
            .from('users')
            .insert([
              {
                created_at: new Date().toISOString(),
                user_id: session.user.id
              }
            ])
            .select();

          if (error) {
            console.error('Error inserting user:', error);
          } else {
            console.log('User inserted successfully:', data);
          }

        } catch (error) {
          console.error('Error inserting user:', error);
        }

      } else if (event === "SIGNED_OUT") {
        console.log('Signed out');
        navigate("/");
      }
    };

    supabase.auth.onAuthStateChange(handleAuthChange);

  }, [navigate]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-1/4">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["github"]}
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email',
                password_label: 'Créer un mot de passe',
                email_input_placeholder: 'Votre adresse email',
                password_input_placeholder: 'Votre mot de passe',
                button_label: 'S\'inscrire',
                loading_button_label: 'Inscription en cours ...',
                social_provider_text: 'S\'inscrire avec {{provider}}',
                link_text: 'Vous n\'avez pas de compte ? Inscrivez-vous',
                confirmation_text: 'Vérifiez votre email pour le lien de confirmation'
              },

              sign_in: {
                email_label: 'Email',
                password_label: 'Votre mot de passe',
                email_input_placeholder: 'Votre adresse email',
                password_input_placeholder: 'Votre mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours ...',
                social_provider_text: 'Se connecter avec {{provider}}',
                link_text: 'Vous avez déjà un compte ? Connectez-vous'
              },

              magic_link: {
                email_input_label: 'Email',
                email_input_placeholder: 'Votre adresse email',
                button_label: 'Envoyer le lien magique',
                loading_button_label: 'Envoi du lien magique ...',
                link_text: 'Envoyer un email avec un lien magique',
                confirmation_text: 'Vérifiez votre email pour le lien magique'
              },

              forgotten_password: {
                email_label: 'Email',
                password_label: 'Votre mot de passe',
                email_input_placeholder: 'Votre adresse email',
                button_label: 'Envoyer le lien de réinitialisation du mot de passe',
                loading_button_label: 'Envoi des instructions de réinitialisation ...',
                link_text: 'Mot de passe oublié ?',
                confirmation_text: 'Vérifiez votre email pour le lien de réinitialisation du mot de passe'
              },

              update_password: {
                password_label: 'Nouveau mot de passe',
                password_input_placeholder: 'Votre nouveau mot de passe',
                button_label: 'Mettre à jour le mot de passe',
                loading_button_label: 'Mise à jour du mot de passe ...',
                confirmation_text: 'Votre mot de passe a été mis à jour'
              },

              verify_otp: {
                email_input_label: 'Email',
                email_input_placeholder: 'Votre adresse email',
                phone_input_label: 'Numéro de téléphone',
                phone_input_placeholder: 'Votre numéro de téléphone',
                token_input_label: 'Jeton',
                token_input_placeholder: 'Votre jeton OTP',
                button_label: 'Vérifier le jeton',
                loading_button_label: 'Connexion en cours ...'
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default Login
