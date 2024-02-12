import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";

export const AccountProfile = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={user.photoUrl}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom
variant="h5">
            {user.name}
          </Typography>
          <Typography color="text.secondary"
variant="body2">
            {user.email}
          </Typography>
          <Typography color="text.secondary"
variant="body2">
            {user.role}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth
variant="text"
color="info">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};
