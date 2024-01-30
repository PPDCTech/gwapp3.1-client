import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { shortenString } from 'src/utils/format-strings';
import { formatAmount, getCurrencySign } from "src/utils/format-currency";
import { formatDate } from "src/utils/format-date";

const statusMap = {
  pending: 'secondary',
  checked: 'info',
  approved: 'success',
  rejected: 'error'
};

export const OverviewLatestRequests = (props) => {
  const { latestReqs = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Latest Requisitions" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Title
                </TableCell>
                <TableCell>
                  Amount
                </TableCell>
                <TableCell sortDirection="desc">
                  Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {latestReqs.map((req) => {
                // const createdAt = format(req.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={latestReqs._id}
                  >
                    <TableCell>
                      {shortenString(req.title, 50)}
                    </TableCell>
                    <TableCell>
                      {getCurrencySign(req?.currency)}
                      {formatAmount(Number(req?.total))}
                    </TableCell>
                    <TableCell>
                      {formatDate(req.date)}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[req.status]}>
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
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Link href="/requisitions">
          <Button
            sx={{ color: 'success.dark'}}
            endIcon={(
              <SvgIcon fontSize="small">
                <ArrowRightIcon />
              </SvgIcon>
            )}
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

OverviewLatestRequests.prototype = {
  latestReqs: PropTypes.array,
  sx: PropTypes.object
};
