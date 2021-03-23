import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import ErrorMessage from './Error.js';
import Weather from './weather.js'
import Row from 'react-bootstrap/Row';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      location:{},
      searchQuery: '',
      imgSrc: '',
      displayResults: false,
      hasError: false,
      errorMessage: '',
      displayWeather: false,
      weatherArr: []
    }
  }

  getLocationInfo = async(e) => {
    e.preventDefault();
    try {
      const url =`https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATION_KEY}&q=${this.state.searchQuery}&format=json`;
      const location = await axios.get(url);
      const locationArray = location.data;
      const SERVER = 'http://localhost:3001';
   // const SERVER = 'https://city-explorer-backend-api.herokuapp.com';
      const weather = await axios.get(`${SERVER}/weather/${locationArray[0].lat}/${locationArray[0].lon}`);
      console.log(weather);
      const weatherArr = weather.data;
      console.log(weatherArr);
      this.setState({
        location: locationArray[0],
        displayResults: true,
        imgSrc: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATION_KEY}&center=${locationArray[0].lat},${locationArray[0].lon}&zoom=16`,
        hasError: false,
        errorMessage: '',
        displayWeather: true,
        weatherArr: weatherArr
      });      
    } catch(err) {
      console.log(err.message);
      this.setState({
        displayResults: false,
        hasError: true,
        errorMessage : err.message,
        displayWeather: false
      })
    }
  }




  render() { 
    return (
      <>
        <h1>City Explorer</h1>
        <form className="w-50 p3 mx-auto mb-5" onSubmit={this.getLocationInfo} >
          <input className="w-75 p3" onChange={(e) => this.setState({ searchQuery: e.target.value })} placeholder="city"/>
          <button className="w-25 p3" type="submit">Explore!</button>
        </form>
        {this.state.displayResults &&
          <Card className="w-50 p3 mx-auto mb-5" bg="dark" text="light">
            <Card.Img variant="top" alt={this.state.searchQuery} src={this.state.imgSrc} />
            <Card.Body>
              <Card.Title>{this.state.location.display_name}</Card.Title>
              <Card.Text>
                {`Latitude: ${this.state.location.lat}`}
              </Card.Text>
              <Card.Text>
                {`Longitude: ${this.state.location.lon}`}
              </Card.Text>
            </Card.Body>
          </Card>
        }
        {this.state.hasError && 
        <div className="w-50 p3 mx-auto">
          <ErrorMessage errorMessage={this.state.errorMessage}/>
        </div>
        }
        <Row className="w-75 p3 mx-auto">
        {this.state.displayWeather &&
          this.state.weatherArr.map((forecastObj, index) => (
            <Weather 
              key={index}
              index={index}
              date={forecastObj.date}
              description={forecastObj.description}
            />
          ))
        }
        </Row>
      </>
    )}
}

export default App;
