import CogIcon from "@heroicons/react/24/solid/CogIcon";
// import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
// import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
// import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import { SvgIcon } from "@mui/material";
import { AccountTreeSharp, Analytics, Summarize } from "@mui/icons-material";
import { TrashIcon } from "@heroicons/react/24/outline";

export const items = [
	{
		title: "Overview",
		path: "/",
		icon: (
			<SvgIcon fontSize="small">
				<ChartBarIcon />
			</SvgIcon>
		),
	},
	{
		title: "Requisitions",
		path: "/requisitions",
		icon: (
			<SvgIcon fontSize="small">
				<DocumentDuplicateIcon />
			</SvgIcon>
		),
	},
	{
		title: "Retirements",
		path: "/retirements",
		icon: (
			<SvgIcon fontSize="small">
				<Analytics />
			</SvgIcon>
		),
	},
	{
		title: "Members",
		path: "/members",
		icon: (
			<SvgIcon fontSize="small">
				<UsersIcon />
			</SvgIcon>
		),
	},
	{
		title: "Projects & Codes",
		path: "/projects",
		icon: (
			<SvgIcon fontSize="small">
				<Summarize />
			</SvgIcon>
		),
	},
	{
		title: "Accounts",
		path: "/accounts",
		icon: (
			<SvgIcon fontSize="small">
				<AccountTreeSharp />
			</SvgIcon>
		),
	},
	{
		title: "Profile",
		path: "/profile",
		icon: (
			<SvgIcon fontSize="small">
				<UserIcon />
			</SvgIcon>
		),
	},
	{
		title: "Vendors",
		path: "/vendor-list",
		icon: (
			<SvgIcon fontSize="small">
				<ShoppingBagIcon />
			</SvgIcon>
		),
	},
	{
		title: "Contracts",
		path: "/contracts",
		icon: (
			<SvgIcon fontSize="small">
				<DocumentTextIcon />
			</SvgIcon>
		),
	},
	{
		title: "Bin",
		path: "/bin",
		icon: (
			<SvgIcon fontSize="small">
				<TrashIcon />
			</SvgIcon>
		),
	},
];
