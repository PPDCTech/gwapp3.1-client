import { Dialog, Typography, Button, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import React from "react";

function AlertModal({ open, onClose, title, content, onConfirm, onCancel }) {
	const [Loading, setLoading] = React.useState(false);
	const handlerFunc = async () => {
		setLoading(true);
		await onConfirm();
		setLoading(false);
	};
	return (
		<Dialog open={open} onClose={() => onClose()} maxWidth="sm">
			<Box
				sx={{
					width: 400,
					bgcolor: "background.paper",
					boxShadow: 24,
					p: 2,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<InfoIcon sx={{ fontSize: 40, color: "primary.main" }} />
				<Typography variant="h6" align="center">
					{title}
				</Typography>
				<Typography variant="body" align="center">
					{content}
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
					<Button
						variant="contained"
						color="primary"
						onClick={()=> handlerFunc()}
						disabled={Loading}
					>
						{Loading ? "Loading..." : "Yes"}
					</Button>
					<Button variant="contained" color="secondary" onClick={() => onClose()}>
						No
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
}

export default AlertModal;
