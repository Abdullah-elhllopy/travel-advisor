import { useState, useEffect } from 'react'
import{CssBaseline  ,Grid} from '@material-ui/core'
import List from './components/List/List'
import Map from './components/Map/Map'
import Header from './components/Header/Header'
import{getPlacesData,getWeatherData } from './api/travelAdvisorAPI';

function App() {
  const [places, setPlaces] = useState([]);
  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const[type,setType]= useState('restaurants')
  const[rating,setRating]= useState('')
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude });
    });
  }, []);
  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);

    setFilteredPlaces(filtered);
  }, [places, rating]);
 
  useEffect(()=>{
    if (bounds) {
      setIsLoading(true);
      getWeatherData(coords.lat, coords.lng)
      .then((data) => setWeatherData(data));

      getPlacesData(type, bounds.sw, bounds.ne)
        .then((data) => {
          setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
          setFilteredPlaces([]);
          setRating('');
          setIsLoading(false);
        });
    }
    
  },[coords, bounds, type])

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
  };
  return (
    < >
      <Header
          onPlaceChanged={onPlaceChanged} onLoad={onLoad} 
      />
      <CssBaseline/>
      <Grid container spacing={3} style={{width:'100%'}}  >
          <Grid item xs={12} md={4}>
              <List 
                isLoading={isLoading}
                childClicked={childClicked}
                places={filteredPlaces.length ? filteredPlaces : places}
                setType ={setType}
                type={type}
                setRating={setRating}
                rating = {rating}
              />
          </Grid>
          <Grid item xs={12} md={8}>
              <Map
                setCoords={setCoords}
                setBounds={setBounds}
                coords={coords}
                places = {filteredPlaces.length ? filteredPlaces : places}
                setChildClicked={setChildClicked}
                weatherData={weatherData}
              />
          </Grid>
      </Grid>
    </>
  );
}

export default App;
