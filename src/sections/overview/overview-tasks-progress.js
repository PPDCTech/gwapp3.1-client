import PropTypes from "prop-types";
import ListBulletIcon from "@heroicons/react/24/solid/ListBulletIcon";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUserUnretiredRequisitions } from "src/services/api/requisition.api";
import { useAuth } from "src/hooks/use-auth";

export const OverviewTasksProgress = (props) => {
  const { totalValue, sx } = props;
  const { user } = useAuth();
  const [unretiredPercentage, setUnretiredPercentage] = useState(0);
  const [avatarColor, setAvatarColor] = useState("success.ppdc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserUnretiredRequisitions(user.email);
        const unretiredCount = response.data.totalCount;
        const totalCount = totalValue;
        const percentage = (unretiredCount / totalCount) * 100;
        setUnretiredPercentage(percentage);
        if (percentage === 0) {
          setAvatarColor("success.ppdc");
        } else if (percentage > 80) {
          setAvatarColor("error.main");
        } else if (percentage > 50) {
          setAvatarColor("warning.main");
        } else if (percentage > 30) {
          setAvatarColor("warning.light");
        } else {
          setAvatarColor("success.lightest");
        }
      } catch (error) {
        console.error("Error fetching unretired requisitions:", error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" gutterBottom variant="overline">
              Retirements
            </Typography>
            <Typography variant="h4">{Number(unretiredPercentage.toFixed(2))}%</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: avatarColor,
              // backgroundColor: 'warning.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <ListBulletIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            value={unretiredPercentage}
            variant="determinate"
            sx={{
              "& .MuiLinearProgress-bar": {
                backgroundColor: avatarColor,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  totalValue: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
