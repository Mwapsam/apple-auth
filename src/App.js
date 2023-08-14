import React from 'react';
import AppleLogin from 'react-apple-login';
import axios from 'axios';
import gql from 'graphql-tag';

const APPLE_LOGIN_MUTATION = gql`
  mutation AppleLogin($authorization_code: String!) {
    appleAuth(authorizationCode: $authorization_code) {
      user {
        id
        username
        # ...
      }
    }
  }
`;

function App() {
  const handleAppleLogin = async (authorizationCode) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/graphql/',
        {
          query: APPLE_LOGIN_MUTATION,
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
