import React from 'react';
import axios from 'axios';
import './App.css';
import CityDetails from './components/CityDetails';
import Error from './components/error';
import 'bootstrap/dist/css/bootstrap.min.css';
import Weather from './components/Weather';

const API_KEY = import.meta.env.VITE_API_KEY;


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchQuery: 'Seattle',
      locationData: null,
      mapURL: null,
      errorState: null,
      // weather below
      forecastData: null,
    }
  }

  handleForm = (e) => {
    e.preventDefault();

    console.log('City name provided', this.state.searchQuery); // hide later
    console.log('API Key: ', API_KEY) // hide later

    const urlQuery = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${this.state.searchQuery}&format=json`;
    axios.get(urlQuery) // AXIOS!!!!!!!
    .then(response => {
      const newLocationData = response.data[0];
      this.setState({locationData: newLocationData})

      const mapQueryURL = `https://maps.locationiq.com/v3/staticmap?key=${API_KEY}&center=${newLocationData.lat},${newLocationData.lon}&zoom=9`;
      this.setState({mapURL: mapQueryURL});

      return axios.get(`http://localhost:3001/weather?city=${this.state.searchQuery}&lat={newLocationData.lat}&lon=${newLocationData.lon}`);
    })
    .then(response =>{
      console.log('something happened!', response.data) // hide later
      this.setState({forecastData: response.data})
    })
    .catch(error => {
      console.log('Error: ', error) // error msg to con
      this.setState({errorState: error.message})
    });
}

  handleChange= (e) => {
    const newQuery = e.target.value;
    this.setState({searchQuery: newQuery})
    console.log(e.target.value); // hide later
  }

render () {
  return (
    <>
      <h1>City Explorer</h1>
      <form onSubmit={this.handleForm}>
        <input placeholder="" name="city" value={this.state.searchQuery? this.state.searchQuery : ''} type="text" onChange={this.handleChange} />
        <button type='submit' >
            Explore!
            {/* <Link to="/search">Search!</Link> */}
          </button>
      </form>

      <CityDetails 
        city={this.state.searchQuery}
        lat={this.state.locationData ? this.state.locationData.lat : ''}
        lon={this.state.locationData ? this.state.locationData.lon : ''}
        mapURL={this.state.mapURL ? this.state.mapURL : null}
      />
      {this.state.errorState ? <Error error={this.state.errorState}/> : ''}
      {/* weather below */}
      {this.state.forecastData ? <Weather weatherData={this.state.forecastData}/> : ''}

    </>
    )
  }
}
export default App