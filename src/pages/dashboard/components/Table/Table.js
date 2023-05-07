import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip
} from "@material-ui/core";
import useStyles from "../../styles";

const states = {
  normal: "success",
  low: "warning",
  high: "secondary",
};

export default function TableComponent({ data }) {
  const classes = useStyles();
  var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  keys.shift(); // delete "id" key

  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
          {keys.map(key => (
            <TableCell key={key}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ id, username, email, last_login, permission, device_id }) => (
          <TableRow key={id}>
            <TableCell >{username}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>{device_id}</TableCell>

            <TableCell>{last_login}</TableCell>
            {permission ==0 &&             <TableCell>User</TableCell>}
            {permission ==1 &&             <TableCell>Admin</TableCell>}
            {permission ==2 &&             <TableCell>Super Admin</TableCell>}

          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
