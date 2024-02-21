import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
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
  const { latestReqs = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Latest Requisitions" />
      <Container>{latestReqs.length === 0 && "Loading..."}</Container>
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
                          <Tooltip title={`${req.title}`}>{shortenString(req.title, 50)}</Tooltip>
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
