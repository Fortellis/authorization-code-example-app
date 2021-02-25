import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

// replace this with the client_id of your fortellis app
const client_id = 'place_holder_client_ID';
// replace this with the redirect url of your fortellis app
const redirect_uri = encodeURIComponent('placeholder_URL');

// the Subscription-Id represents the dealership context of an API call
// in this example, we call the merchandisable vehicles API to get the vehicles available for sale in a given dealership
// the Subscription-Id represents which dealership we are talking about
// 'test' is a special Subscription-Id that represents a sample dealership that provides test data
// when a dealership customer purchases and uses your app, you will need to use their Subscription-Id in your API calls
const subscription_id = 'test';

let token;

let code;

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      vehicles: [],
    };
  }
  componentWillMount() {
    // if the URL contains a token, grab it and hide it from the user
    code =
      window.location.href.match(/code=(.*?)&/) &&
      window.location.href.match(/code=(.*?)&/)[1];

    window.history.replaceState(
      document.title,
      window.location.pathname + window.location.search
    );
  }
  getToken() {
    if (code) {
      axios
        .post(
          `/token/?grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${code}`,
          'This is the body',
          {
            params: {},
            headers: {},
          }
        )
        .then(response => {
          console.log(response);
          token =
            window.location.href.match(/access_token=(.*?)&/) &&
            window.location.href.match(/access_token=(.*?)&/)[1];
          console.log(token);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  getContent() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    } else if (this.state.vehicles.length > 0) {
      // display results of API call
      return (
        <table align="center" cellSpacing="25">
          <tbody>
            {this.state.vehicles.map((row, index) => {
              return (
                <tr key={row.merchandisableVehicleId}>
                  <td>
                    <img
                      src={row.summary.primaryImageLink.href}
                      height="200"
                      width="300"
                      alt="vehicle"
                    />
                  </td>
                  <td>
                    {row.description.description}
                  </td>
                  <td>
                    {row.prices.netPrice}
                    {row.prices.currencyCode}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else if (token) {
      // button to make API call
      return (
        <button onClick={this.getMerchandisableVehicles}>Get Vehicles</button>
      );
    } else {
      // login link to get access token
      return (
        <div>
          <a
            href={`https://identity.fortellis.io/oauth2/aus1p1ixy7YL8cMq02p7/v1/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&nonce=nonce&scope=openid&state=state`}
          >
            Login with Fortellis
          </a>
          <button onClick={this.getToken}>Get Your Token</button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Vehicle Finder</h1>
        </header>
        <br />
        {this.getContent()}
      </div>
    );
  }
}

export default App;
