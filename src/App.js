import React from 'react';
import AppleLogin from 'react-apple-login';
import axios from 'axios';

function App() {
  const handleAppleLogin = async (authorizationCode) => {
    try {
      const response = await axios.post(
        'https://staging.smartsaverzambia.com/graphql/',
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
                customer {
                  id
                  uuid
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

      const user = response.data;
      console.log('Logged in user:', user);
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };


  return (
    <div>
      <AppleLogin 
        clientId="staging.smartsaverzambia.com.sid" 
        scope=""
        nonce='random-nonce'
        redirectURI="https://apple-auth.vercel.app"
        callback={(res) => {
          console.log('response: ', res);
          if (res.code) {
            handleAppleLogin(res.code);
          }
        }}
      />
    </div>
  );
}

export default App;
