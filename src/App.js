import React, { useEffect } from 'react';
import AppleLogin from 'react-apple-login';
import AppleSignin from 'react-apple-signin-auth';

import axios from 'axios';

const clientId = "staging.smartsaverzambia.com.sid";
const scope = "name email";
const redirectURI = "https://apple-auth.vercel.app/";
const state = "origin:web";

function App() {
  const handleAppleLogin = async (authorizationCode) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/graphql/',
        {
          query: `
            mutation AppleLogin(
              $authorization_code: String!
              $device_id: String
            ) {
              appleAuth(
                code: $authorization_code,
                deviceId: $device_id
              ) {
                user {
                  id
                  username
                  email
                }
              }
            }
          `,
          variables: {
            authorization_code: authorizationCode,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const user = response.data.data.appleAuth;
      console.log('Logged in user:', user);
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };


  useEffect(() => {
    window.AppleID.auth.init({
      clientId,
      scope,
      redirectURI,
      state,
      usePopup: false
    });

    document.addEventListener("AppleIDSignInOnSuccess", (event) => {
      console.log("Success ", event);
    });

    document.addEventListener("AppleIDSignInOnFailure", (event) => {
      console.log("Error ", event);
    });
  }, []);

  return (
    <div>
      {/* <AppleLogin 
        clientId="staging.smartsaverzambia.com.sid" 
        scope="name email email_verified is_private_email real_user_status transfer_sub" 
        responseType= 'code'
        responseMode= 'query'
        redirectURI="https://apple-auth.vercel.app/"
        callback={(res) => {
          console.log(res);
          if (res.code) {
            handleAppleLogin(res.code);
          }
        }}
      /> */}
      <div className="App">
        <div
          id="appleid-signin"
          className="signin-button"
          data-color="black"
          data-border="true"
          data-type="sign-in"
        ></div>
      </div>
    </div>
  );
}

export default App;
