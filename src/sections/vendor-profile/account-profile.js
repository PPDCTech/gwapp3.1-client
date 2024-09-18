import {
	Box,
	Card,
	CardContent,
	Container,
	Typography,
	Divider,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";

const InfoSection = ({ title, data }) => (
	<Card sx={{ mb: 2 }}>
		<CardContent>
			<Typography variant="h6" gutterBottom>
				{title}
			</Typography>
			{data.map(({ label, value }) => (
				<Typography key={label} color="text.secondary" variant="body2">
					{label}: {value || "N/A"}
				</Typography>
			))}
		</CardContent>
		<Divider />
	</Card>
);

const StatusDisplay = ({ status }) => {
	const getColor = (status) => {
		switch (status) {
			case "verified":
				return "green";
			case "rejected":
				return "red";
			default:
				return "orange";
		}
	};

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Status
				</Typography>
				<Typography
					variant="body2"
					color={getColor(status)}
					sx={{ fontWeight: "bold" }}
				>
					{status?.toUpperCase() || "N/A"}
				</Typography>
			</CardContent>
			<Divider />
		</Card>
	);
};

const ActivityLogs = ({ history }) => (
	<Card sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
		<Box
			sx={{
				position: "sticky",
				top: 0,
				backgroundColor: "white",
				zIndex: 1,
			}}
		>
			<Typography variant="h6" gutterBottom sx={{ m: 2 }}>
				Activity Logs
			</Typography>
		</Box>
		<CardContent>
			{history && history?.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No history logs available.
				</Typography>
			) : (
				<List>
					{history?.map((log, index) => (
						<Box key={index} component="span">
							<ListItem alignItems="flex-start">
								<ListItemText
									primary={
										<Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
											Activity: &nbsp;
										</Typography>
									}
									secondary={
										<Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
											{log.activity}
										</Typography>
									}
								/>
							</ListItem>
							{index < history?.length - 1 && <Divider component="li" />}
						</Box>
					))}
				</List>
			)}
		</CardContent>
	</Card>
);

export const VendorAccountProfile = ({ vendor, isViewingOwnProfile }) => {
	const contactPersonInfo = [
		{ label: "Name", value: vendor?.contactPerson?.name },
		{ label: "Email", value: vendor?.contactPerson?.email },
		{ label: "Phone", value: vendor?.contactPerson?.phoneNumber },
	];

	const bankDetailsInfo = [
		{ label: "Bank", value: vendor?.accountDetails?.bankName },
		{ label: "Holder Name", value: vendor?.accountDetails?.holderName },
		{ label: "Account Number", value: vendor?.accountDetails?.number },
	];

	return (
		<Container sx={{ mt: 4 }}>
			{/* Contact Person Section */}
			<InfoSection title="Contact Person" data={contactPersonInfo} />

			{/* Bank Details Section */}
			<InfoSection title="Bank Details" data={bankDetailsInfo} />

			{/* Vendor Status Section */}
			<StatusDisplay status={vendor?.status} />

			{/* Vendor History Logs Section */}
			{!isViewingOwnProfile && <ActivityLogs history={vendor?.history} />}
		</Container>
	);
};
