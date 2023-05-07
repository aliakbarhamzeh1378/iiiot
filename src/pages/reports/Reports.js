import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

import Lottie from "lottie-react";
import * as Icons from "@material-ui/icons";
import Mapbox from "react-mapbox-gl";
import axios from 'axios'
// styles
import useStyles from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import ApexLineChart from "./../charts/components/ApexLineChart";
import Switch from "react-switch";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateRangePicker } from 'rsuite';

import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import "rsuite/dist/rsuite.css";

// animations
import { GoogleMap, LoadScript, MarkerF, Polyline } from '@react-google-maps/api';

const Map = Mapbox({
  accessToken: "pk.eyJ1IjoiYWxpYWtiYXIxMzc4MTIxMSIsImEiOiJjbDdqNjl2YnUwdjd4M29tbWFtZm8xMDJyIn0.YoQhXZhS3NOapxDcTi0qHQ",
});

export default function Reports(props) {
  var classes = useStyles();
  const [series, setSeries] = useState([])
  const [location, setLocation] = useState([])
  const [categories, setCategories] = useState([])
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const containerStyle = {
    width: '100',
    height: '100%'
  };

  const [humaditySwitch, setHumaditySwitch] = useState(false)
  const [tempSwitch, setTempSwitch] = useState(false)
  const [soilSwitch, setSoilSwitch] = useState(false)
  const [lightSwitch, setLightSwitch] = useState(false)



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
  const sendData = (action) => {
    let data = JSON.stringify({
      "action": action
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://178.63.147.27:8001/api/v1/action/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

  }


  const getData = () => {
    console.log(startDate)
    console.log(startDate)
    let data = ''
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: "http://178.63.147.27:8001/api/v1/report_data?start="+startDate+"&end="+endDate,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        let cat = []

        let locations = []
        let humadity = []
        let temperature = []
        let soil = []
        let light = []

        if (response.data.status == 200) {
          response.data.data.data.map(item => {
            var l1 = 0
            l1 = nmeaParser("$GPGGA,123519,A," + item.la + "," + item.sn + "," + item.lo + "," + item.ew + ",022.4,084.4,230394,003.1,W*6A")
            locations.push({ lat: l1.lat, lng: l1.lng })
            cat.push(item.time)
            if (humaditySwitch) {
              humadity.push(item.humidityValue)
            }
            if (tempSwitch) {
              temperature.push(item.tempValue)
            }
            if (soilSwitch) {
              soil.push(item.soilMoistureValue)
            }
            if (lightSwitch) {
              light.push(item.lightValue)

            }
          })
          console.log(locations)
          setCategories(cat)
          setLocation(locations)
          setSeries([

            { name: "humidity", data: humadity },
            { name: "Temperature", data: temperature },
            { name: "Soil moisture", data: soil },
            { name: "Light", data: light },

          ])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const setDate = (obj) => {
    setStartDate(obj[0].toISOString())
    setEndDate(obj[1].toISOString())
    
  }
  return (
    <>
      <PageTitle title="Reports" />

      <Grid container spacing={4}>

        <Grid item xs={12}>
          <Widget title="Pick Time" >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DemoContainer components={['DateRangePicker']} disableWidgetMenu>
                <DateRangePicker localeText={{ start: 'from', end: 'to' }} value={date}
                  onChange={(newValue) => console.log(newValue)} />
              </DemoContainer> */}
              <DateRangePicker  onOk={e=>(setDate(e))}/>
            </LocalizationProvider>

          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Widget title="Pick sensor" >
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="humidity"
                  control={<Checkbox onChange={e => setHumaditySwitch(e.target.checked)} />}
                  label="humidity"
                  labelPlacement="humidity"
                />
                <FormControlLabel
                  value="Temperature"
                  control={<Checkbox onChange={e => setTempSwitch(e.target.checked)} />}
                  label="Temperature"
                  labelPlacement="Temperature"
                />
                <FormControlLabel
                  value="Soil moisture"
                  control={<Checkbox onChange={e => setSoilSwitch(e.target.checked)} />}
                  label="Soil moisture"
                  labelPlacement="Soil moisture"
                />
                <FormControlLabel
                  value="Light"
                  control={<Checkbox onChange={e => setLightSwitch(e.target.checked)} />}
                  label="Light"
                  labelPlacement="Light"
                />
                <Button variant="contained" onClick={e => getData()}>Load data</Button>

              </FormGroup>
            </FormControl>
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Widget title="Apex Line Chart" upperTitle noBodyPadding disableWidgetMenu>
            <ApexLineChart series={series} categories={categories} />
          </Widget>
        </Grid>


        <Grid item xs={12}>
          <Widget title="Map" upperTitle noBodyPadding disableWidgetMenu>
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
                  
                  // defaulCenter={{'49.83495683333334', '97.15359133333334'}}
                  zoom={10}
                >
                  <Polyline
                    path={location}
                    strokeColor="#0000FF"
                    strokeOpacity={0.8}
                    strokeWeight={2} />

                </GoogleMap>
              </LoadScript>
            </div>
          </Widget>
        </Grid>




      </Grid>
    </>
  );
}

