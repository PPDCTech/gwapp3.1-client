import { useState, useEffect, useCallback } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Drawer, Stack, Divider, useMediaQuery, Typography } from "@mui/material";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import { useAuth } from "src/hooks/use-auth";

export const SideNav = (props) => {
  const { open, onClose, key } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const { user } = useAuth();

  const [sidebarItems, setSidebarItems] = useState([]);

  useEffect(() => {
    if (pathname) {
      const filteredItems = items.filter((item) => {
        switch (user?.accessLevel) {
          case "tech":
            return true;
          case "superUser":
            return item.path !== "/retirements";
          case "budgetHolder":
            return item.path !== "/retirements" && item.path !== "/accounts";
          case "finance":
          case "financeReviewer":
            return item.path !== "/retirements";
          case "user":
            return item.path !== "/accounts" && item.path !== "/projects" && item.path !== "/bin";
          default:
            return false;
        }
      });
      setSidebarItems(filteredItems);
    }
  }, [user, pathname]); 

  const content = (
    <Scrollbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "neutral.100",
        }}
      >
        <Box sx={{ p: 3 }}>
          <NextLink href="/" passHref>
            <Box
              component="a"
              sx={{
                display: "inline-flex",
                height: 32,
                width: 32,
              }}
            >
              <Logo />
            </Box>
          </NextLink>
          <Box
            sx={{
              alignItems: "center",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 1,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              p: "12px",
            }}
          >
            <div>
              <Typography color="inherit" variant="Logo">
                GWAPP
              </Typography>
            </div>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {sidebarItems.map((item) => (
              <SideNavItem
                active={pathname === item.path}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
              />
            ))}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
