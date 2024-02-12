import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
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
    title: "Bin",
    path: "/bin",
    icon: (
      <SvgIcon fontSize="small">
        <TrashIcon />
      </SvgIcon>
    ),
  },
  // {
  //   title: "Vendors",
  //   path: "/vendors",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <ShoppingBagIcon />
  //     </SvgIcon>
  //   ),
  // },
];
