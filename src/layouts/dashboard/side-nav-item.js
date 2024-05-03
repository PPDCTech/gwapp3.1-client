import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const SideNavItem = (props) => {
	const { active, disabled, external, icon, path, title } = props;
	const navigate = useNavigate(); // Hook for navigation

	const handleNavigate = () => {
		if (path && !disabled) {
			if (external) {
				window.open(path, "_blank"); // Open in a new tab for external links
			} else {
				navigate(path); // Navigate internally using useNavigate
			}
		}
	};

	return (
		<li>
			<Box
				sx={{
					alignItems: "center",
					borderRadius: 1,
					display: "flex",
					justifyContent: "flex-start",
					pl: "16px",
					pr: "16px",
					py: "6px",
					textAlign: "left",
					width: "100%",
					cursor: "pointer", // Add cursor pointer
					...(active && {
						backgroundColor: "rgba(255, 255, 255, 0.15)",
					}),
					"&:hover": {
						backgroundColor: "rgba(255, 255, 255, 0.04)",
					},
				}}
				onClick={handleNavigate} // Handle click event here
				disabled={disabled}
			>
				{icon && (
					<Box
						component="span"
						sx={{
							alignItems: "center",
							color: "neutral.400",
							display: "inline-flex",
							justifyContent: "center",
							mr: 2,
							...(active && {
								color: "success.main",
							}),
						}}
					>
						{icon}
					</Box>
				)}
				<Box
					component="span"
					sx={{
						color: "neutral.400",
						flexGrow: 1,
						fontFamily: (theme) => theme.typography.fontFamily,
						fontSize: 14,
						fontWeight: 600,
						lineHeight: "24px",
						whiteSpace: "nowrap",
						...(active && {
							color: "common.white",
						}),
						...(disabled && {
							color: "neutral.500",
						}),
					}}
				>
					{title}
				</Box>
			</Box>
		</li>
	);
};

SideNavItem.propTypes = {
	active: PropTypes.bool,
	disabled: PropTypes.bool,
	external: PropTypes.bool,
	icon: PropTypes.node,
	path: PropTypes.string,
	title: PropTypes.string.isRequired,
};
