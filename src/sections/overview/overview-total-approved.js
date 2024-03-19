import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import BanknotesIcon from "@heroicons/react/24/solid/BanknotesIcon";
import { Avatar, Box, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import { success } from "src/theme/colors";

export const OverviewTotalApproved = (props) => {
  const { difference, positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Total Approved
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h4">{value}</Typography>
              {/* <div>
                <Typography variant="subtitle2" sx={{ color: success.light }}>
                  N123M
                </Typography>
                <Typography variant="subtitle2" sx={{ color: success.light }}>
                  $12M
                </Typography>
              </div> */}
            </Box>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "success.ppdc",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <BanknotesIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalApproved.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
