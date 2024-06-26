import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
	SvgIcon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";
import { Scrollbar } from "../../components/scrollbar";
import { SeverityPill } from "../../components/severity-pill";
import { shortenString } from "../../utils/format-strings";
import { formatAmount, getCurrencySign } from "../../utils/format-currency";
import { formatDate } from "../../utils/format-date";
import { STATUS_COLOR_TYPE } from "../../services/constants";

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
										<TableCell sx={{ width: "20%" }}>Type</TableCell>
										<TableCell sx={{ width: "15%" }}>Amount</TableCell>
										<TableCell sortDirection="desc" sx={{ width: "15%" }}>
											Date
										</TableCell>
										<TableCell sx={{ width: "10%" }}>Status</TableCell>
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
												<TableCell>{req.type}</TableCell>
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
						<Link to="/requisitions">
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
