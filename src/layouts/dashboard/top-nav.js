import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BellIcon from "@heroicons/react/24/solid/BellIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "./account-popover";
import { useAuth } from "src/hooks/use-auth";
import { getGreeting } from "src/utils/get-greeting";
import { getFirstName } from "src/utils/get-firstname";
import NotificationDropdown from "src/components/notifications-dropdown";
import { fetchUserMessages } from "src/services/api/message-chat.api";

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { user } = useAuth();
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const accountPopover = usePopover();
  const auth = useAuth();
  const [greeting, setGreeting] = useState(getGreeting());
  const [unreadCount, setUnreadCount] = useState(0);

  const getUnreadNotifications = async () => {
    try {
      const response = await fetchUserMessages(user?._id);
      const { data } = response;
      let count = 0;

      data.forEach((n) => {
        const messages = n?.messages || [];
        messages.forEach((message) => {
          if (!message.read) {
            count++;
          }
        });
      });

      setUnreadCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setGreeting(getGreeting());
    getUnreadNotifications();
  }, []);

  const notificationDropdown = usePopover();

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: "sticky",
          left: {
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
            {`${greeting}, ${getFirstName(auth.user?.name)}`}
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Tooltip title="Notifications">
              <IconButton
                ref={notificationDropdown.anchorRef}
                onClick={notificationDropdown.handleOpen}
              >
                <Badge badgeContent={unreadCount} color="success" variant="dot">
                  <SvgIcon fontSize="small">
                    <BellIcon />
                  </SvgIcon>
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar
              onClick={accountPopover.handleOpen}
              ref={accountPopover.anchorRef}
              sx={{
                cursor: "pointer",
                height: 40,
                width: 40,
              }}
              src={auth.user?.photoUrl || ""}
            />
          </Stack>
        </Stack>
        <NotificationDropdown
          anchorEl={notificationDropdown.anchorRef.current}
          open={notificationDropdown.open}
          onClose={notificationDropdown.handleClose}
        />
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func,
};
