import PropTypes from "prop-types";
import BanknotesIcon from "@heroicons/react/24/solid/BanknotesIcon";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Stack,
    SvgIcon,
    Typography,
} from "@mui/material";
import { success } from "../../theme/colors";
import { shortenAmount } from "../../services/helpers";

export const OverviewTotalApproved = (props) => {
    const { sx, amounts, totalApproved } = props;

    return (
        <Card sx={sx}>
            <CardContent>
                <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                >
                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="overline">
                            Total Approved
                        </Typography>
                        <Box>
                            <Typography variant="h4">
                                {totalApproved}
                            </Typography>
                            {/* <Stack
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: success.light }}
                                >
                                    ₦
                                    {shortenAmount(amounts ? amounts.naira : 0)}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: success.light }}
                                >
                                    $
                                    {shortenAmount(
                                        amounts ? amounts.dollars : 0
                                    )}
                                </Typography>
                            </Stack> */}
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
