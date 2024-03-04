import React, { useState } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

const App = () => {
  const [view, setView] = useState('signIn');

  const switchToSignUp = () => {
    setView('signUp');
  };

  const switchToSignIn = () => {
    setView('signIn');
  };

  return (
    <div>
      {view === 'signIn' ? <SignIn switchToSignUp={switchToSignUp} /> : <SignUp switchToSignIn={switchToSignIn} />}
    </div>
  );
};

export default App;
