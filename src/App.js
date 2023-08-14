import React from 'react';
import AppleLogin from 'react-apple-login';
import axios from 'axios';

function App() {
  const handleAppleLogin = async (authorizationCode) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/graphql/',
        {
          query: `mutation AppleLogin($authorization_code: String!) {
            appleAuth(code: $authorization_code) {
              user {
                id
                username
                email
              }
            }
          }`,
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
  
      const user = response.data.data.appleAuth.user;
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
        render={(renderProps) => (
          <button onClick={renderProps.onClick}>Custom Apple Login Button</button>
        )}
        callback={(res) => {
          console.log(res.code);
          if (res.code) {
            handleAppleLogin(res.code);
          }
        }}
      />
    </div>
  );
}

export default App;
