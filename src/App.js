import React, { Component } from 'react';
import './App.css';

import Amplify, { PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { withAuthenticator } from 'aws-amplify-react';

/**
 * Put in your values from cognito created by cloudformation template
 */
Amplify.configure({
  Auth: {
    region: "",
    userPoolId: "",
    identityPoolId: "",
    userPoolWebClientId: ""
  }
})


class App extends Component {
  subscribe = () => {
    PubSub.subscribe('myTopic').subscribe({
      next: data => console.log('Message received', data),
      error: error => console.error('Error', error),
      close: () => console.log('Done'),
    });
    console.log('Attempting subscribe...');
  }

  componentDidMount = async() => {
    Auth.currentCredentials().then((info) => {
      console.log('Identity id:', info._identityId);
    });
    Amplify.addPluggable(new AWSIoTProvider({
      aws_pubsub_region: 'us-west-2',
      aws_pubsub_endpoint: 'wss://a3tyns6izotbcq-ats.iot.us-west-2.amazonaws.com/mqtt',
    }));
    this.subscribe();
  }

  publishTopic = () => {
    console.log('Publishing...');
    PubSub.publish('myTopic', 'testing testing...');
  }

  logOut = () => { 
    console.log('Logging out...');
    Auth.signOut();
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.publishTopic}>publish to topic</button>
        <button onClick={this.logOut}>log out</button>
        <button onClick={this.subscribe}>subscribe</button>
      </div>
    );
  }
}

// Uncomment to use WITHOUT auth
export default App;

// Uncomment to use auth
// export default withAuthenticator(App); 