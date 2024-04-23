import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { shortenString } from "src/utils/format-strings";
import { formatAmount, getCurrencySign } from "src/utils/format-currency";
import { formatDate } from "src/utils/format-date";
import { STATUS_COLOR_TYPE } from "src/services/constants";

export const OverviewLatestRequests = (props) => {
  const { latestReqs = [], sx, loading } = props;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress color="success" />
        <Box sx={{ mt: 2 }}>Relax while we load your data...</Box>
      </Box>
    );
  }

  return (
    <Card sx={sx}>
      <CardHeader title="Recent highlight" />
      <Container>
        {latestReqs.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box sx={{ mt: 2 }}>No requisitions found</Box>
          </Box>
        )}
      </Container>
      {latestReqs.length > 0 && (
        <>
          <Scrollbar sx={{ flexGrow: 1 }}>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "40%" }}>Title</TableCell>
                    <TableCell sx={{ width: "20%" }}>Amount</TableCell>
                    <TableCell sortDirection="desc" sx={{ width: "20%" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestReqs.map((req) => {
                    return (
                      <TableRow hover key={req._id}>
                        <TableCell>
                          <Tooltip title={`${req.title}`}>
                            <>{shortenString(req.title, 50)}</>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {getCurrencySign(req?.currency)}
                          {formatAmount(Number(req?.total))}
                        </TableCell>
                        <TableCell>{formatDate(req.date)}</TableCell>
                        <TableCell>
                          <SeverityPill color={STATUS_COLOR_TYPE[req.status]}>
                            {req.status}
                          </SeverityPill>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Link href="/requisitions">
              <Button
                sx={{ color: "success.dark" }}
                endIcon={
                  <SvgIcon fontSize="small">
                    <ArrowRightIcon />
                  </SvgIcon>
                }
                size="small"
                variant="text"
              >
                View all
              </Button>
            </Link>
          </CardActions>
        </>
      )}
    </Card>
  );
};

OverviewLatestRequests.prototype = {
  latestReqs: PropTypes.array,
  sx: PropTypes.object,
};
