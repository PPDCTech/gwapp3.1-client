import React from "react";
import PropTypes from "prop-types";
import { Popover, List, ListItem, ListItemText, Typography, Box } from "@mui/material";

const NotificationDropdown = (props) => {
  const { anchorEl, open, onClose } = props;

  const notifications = [
    // { message: "Notification 1", date: "2022-02-15 10:30 AM" },
    // { message: "Notification 2", date: "2022-02-14 08:45 PM" },
    // { message: "Notification 3", date: "2022-02-14 01:15 PM" },
    // { message: "Notification 4", date: "2022-02-13 11:00 AM" },
  ];

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={open}
      onClose={onClose}
    >
      <Box p={2}>
        <Typography variant="subtitle1" gutterBottom>
          Notifications
        </Typography>
        {notifications.map((notification, index) => (
          <ListItem key={index} disablePadding>
            <ListItemText primary={notification.message} secondary={notification.date} />
          </ListItem>
        ))}
        {notifications.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No new notifications.
          </Typography>
        )}
      </Box>
    </Popover>
  );
};

NotificationDropdown.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationDropdown;
