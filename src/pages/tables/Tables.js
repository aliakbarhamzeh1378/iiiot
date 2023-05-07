import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";

// data
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NativeSelect from '@mui/material/NativeSelect';
import axios from 'axios'
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  }
}))

export default function Tables() {
  const classes = useStyles();
  const [tabels_data, setTables_data] = useState([{
    Email: "mahdi.yarahmadi3@gmail.com",
    Username: "Mehdi_twen",
    DateJoin: "2023-04-13T12:06:04.227628Z",
    LastLogin: "2023-04-13T12:06:04.227635Z",
    pk: 3,
    Permissions: {
      Access: 3,
      Title: "super admin"
    },
    Slave_id: '001'
  }])

  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [permission, setPermission] = React.useState('');
  const [slave_id, setSlaveId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pk, setPk] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const getUserList = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://178.63.147.27:8001/api/v1/user/',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }


    };
    axios.request(config).then((response) => {
      if (response.data.status == 201) {
        console.log(response.data.data)
        setTables_data(response.data.data)
        // setData(response.data.data)

      }
    })
      .catch((error) => {
        console.log(error);
      });

  }

  const updateUser = () => {
    console.log("username")
    console.log(username)
    console.log("email")
    console.log(email)
    console.log("permission")
    console.log(permission)
    console.log("slave_id")
    console.log(slave_id)
    console.log("password")
    console.log(password)
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: 'http://178.63.147.27:8001/api/v1/user/',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: {
        "user_id": pk,
        "username": username,
        "email": email,
        "slave_id": slave_id,
        "permission": permission,
      }


    };
    axios.request(config).then((response) => {
      if (response.data.status == 201) {

        console.log("response.data.data")
        handleClose()
        // setData(response.data.data)

      }
    })
      .catch((error) => {
        console.log(error);
      });

  }
  useEffect(() => {
    console.log("Executed only once!");
    getUserList();

  }, [""]);

  const handleClose = () => {
    setOpen(false);
  };
  const [userData, setUserData] = useState({
    username: 'ali199',
    email: 'hiii@hiii.com',
    lastLogin: new Date().now,
    permission: 'super admin',
    device_id: "0002",
    id: 1
  })
  var keys = Object.keys(userData).map(i => i.toUpperCase());


  const click = (data) => {
    setUserData(data)
    setUsername(data.Username)
    setEmail(data.Email)
    setPermission(data.Permissions.Access)
    setSlaveId(data.Slave_id)
    setPk(data.pk)
    setPassword("")
    setOpen(true)
  }

  const DeleteUser = (data) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'http://178.63.147.27:8001/api/v1/user/',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: {
        "user_id": pk
      }


    };
    axios.request(config).then((response) => {
      if (response.data.status == 201) {

        console.log("response.data.data")
        handleClose()
        // setData(response.data.data)

      }
    })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <PageTitle title="User Managment" />
      <Grid container spacing={4}>

        <Grid item xs={12}>
          <Widget title="User List" noBodyPadding bodyClass={classes.tableOverflow}>
            {/* <Table data={table} /> */}
            <Table className="mb-0">
              <TableHead>
                <TableRow>
                  <TableCell key={"Username"}>{"Username"}</TableCell>
                  <TableCell key={"Email"}>{"Email"}</TableCell>
                  <TableCell key={"LastLogin"}>{"Last Login"}</TableCell>
                  <TableCell key={"permission"}>{"Permission"}</TableCell>
                  <TableCell key={"device_id"}>{"Device Id"}</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>

                {tabels_data.map(data => {
                  console.log(data)
                  return (
                    <TableRow key={data.pk} hover={true} onClick={e => click(data)}>
                      <TableCell >{data.Username}</TableCell>
                      <TableCell>{data.Email}</TableCell>

                      <TableCell>{data.LastLogin}</TableCell>

                      {data.Permissions.Access == 0 && <TableCell>User</TableCell>}
                      {data.Permissions.Access == 1 && <TableCell>User</TableCell>}
                      {data.Permissions.Access == 2 && <TableCell>Admin</TableCell>}
                      {data.Permissions.Access == 3 && <TableCell>Super Admin</TableCell>}
                      <TableCell>{data.Slave_id == null ? 'not setted' : data.Slave_id}</TableCell>

                    </TableRow>
                  )
                })}
              </TableBody>

            </Table>
          </Widget>
        </Grid>
        <Dialog open={open} onClose={handleClose}>

          <DialogTitle>{userData.username}</DialogTitle>
          <DialogContent>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="user name"
              type="text"
              fullWidth
              variant="standard"
              value={username}
              onChange={e => setUsername(e.target.value)}

            />


            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={e => setEmail(e.target.value)}

            />


            <TextField
              autoFocus
              margin="dense"
              id="device_id"
              label="Device id"
              type="text"
              fullWidth
              variant="standard"
              value={slave_id}
              onChange={e => setSlaveId(e.target.value)}

            />

            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password (left empty for don't chaghe)"
              type="password"
              fullWidth
              variant="standard"
              value={""}
              onChange={e => setPassword(e.target.value)}

            />


            <NativeSelect
              defaultValue={userData.Permissions == undefined ? 0 : userData.Permissions.Access}
              fullWidth
              style={{ marginTop: 20 }}
              inputProps={{
                name: 'Permission',
                id: 'uncontrolled-native',
              }}
              onChange={event => { setPermission(event.target.value) }}
            >
              {/* <option value={0}>User</option> */}
              <option value={1}>User</option>
              <option value={2}>Admin</option>
              <option value={3}>Super Admin</option>
            </NativeSelect>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={e => updateUser()}>Save</Button>
            <Button onClick={e => DeleteUser()}>Delete User</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
