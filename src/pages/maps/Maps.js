import React, { useState, useEffect } from "react";
import Mapbox, { Marker, Layer, Feature } from "react-mapbox-gl";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import axios from 'axios'

// styles
import useStyles from "./styles";
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  Assessment as ReportIcon,
  Group as UsersIcon,
  Map as MapIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";

function nmeaParser(str) {
  const KNOTS_IN_MS = 1.9438
  const nmea = str.split(',')
  // console.log(nmea)
  function parseLatitude() {
    // console.log(nmea[3])
    // console.log(nmea[4])
    const degrees = Number(nmea[3].substring(0, 2))
    const seconds = Number(nmea[3].substring(2))
    const negate = nmea[4].toUpperCase() == 'S'
    return (degrees + seconds / 60) * (negate ? -1 : 1)
  }
  function parseLongitude() {
    //console.log(nmea[5])
    //console.log(nmea[6])
    const degrees = Number(nmea[5].substring(0, 3))
    const seconds = Number(nmea[5].substring(3))
    const negate = nmea[6].toUpperCase() == 'W'
    return (degrees + seconds / 60) * (negate ? -1 : 1)
  }
  return {
    lat: parseLatitude(),
    lng: parseLongitude()
  }
}

export default function Maps(props) {
  
  const classes = useStyles();
  const containerStyle = {
    width: '100',
    height: '100%'
  };
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [data, setData] = useState([])


  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get("http://178.63.147.27:8001/api/v1/admin_map/", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((response) => {
          if (response.data.status == 200) {
            setData(response.data.data)

          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 3000); // Send request every 1000 milliseconds (1 second)

    return () => clearInterval(intervalId);
  }, []);
  let changePage =(slave_id)=>{
    localStorage.setItem('slave_id', slave_id)
    props.history.push('/app/dashboard')
  }
  
  return (
    <div className={classes.mapContainer}>

      <LoadScript
        googleMapsApiKey="AIzaSyDp1ZiVY7cxsmnzYXGaGiecQmq7o8j_bp0"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={map => {
            const bounds = new window.google.maps.LatLngBounds();
            map.fitBounds(bounds);
          }}

          zoom={10}
        >

          {data.map((item, key) => {
            console.log(item)
            console.log(key)
            var l1 = 0
            l1 = nmeaParser("$GPGGA,123519,A," + item.la + "," + item.sn + "," + item.lo + "," + item.ew + ",022.4,084.4,230394,003.1,W*6A")
            console.log(l1)
            return (
              <MarkerF key={key}
                position={{
                  lat: l1.lat,
                  lng: l1.lng
                }}
              />
            )
          })}


        </GoogleMap>
      </LoadScript>
      <div style={{ position: 'absolute', width: '200px', height: '300px', backgroundColor: '#e9e9e966', bottom: '0', overflowY: 'scroll', textAlign: '-webkit-center' }}>
        <h4 style={{ marginBottom: '20px' }}>Sensors List</h4>
        {
          data.map((item, key) => {
            return (
              <div>
                <span key={key} onClick={e => changePage(item.slave_id)} style={{ fontSize: '20px', cursor: 'pointer' }}>
                  {item.slave_id}
                </span>
                <br></br>
              </div>

            )
          })
        }
      </div>
    </div>
  );
}
