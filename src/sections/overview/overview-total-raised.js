import PropTypes from "prop-types";
import DocumentTextIcon from "@heroicons/react/24/solid/DocumentTextIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const OverviewTotalRaised = (props) => {
  const { positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Total Raised
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>

          <Avatar
            sx={{
              backgroundColor: positive ? "success.main" : "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <DocumentTextIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalRaised.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
