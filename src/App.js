import React from 'react';
import AppleLogin from 'react-apple-login';
import axios from 'axios';

function App() {
  const handleAppleLogin = async (authorizationCode) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/graphql/',
        {
          query: `
            mutation AppleAuthMutation($authorization_code: String!) {
              appleAuth(access_token: $authorization_code) {
                email
                uid
                access_token
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

  return (
    <div>
      <AppleLogin 
        clientId="staging.smartsaverzambia.com.sid" 
        scope="name email" 
        redirectURI="https://apple-auth.vercel.app/"
        callback={(res) => {
          console.log(res);
          if (res.code) {
            handleAppleLogin(res.code);
          }
        }}
      />
    </div>
  );
}

export default App;
