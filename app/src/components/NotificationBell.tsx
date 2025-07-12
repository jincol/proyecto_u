import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationBell({ count }: { count: number }) {
  return (
    <IconButton color="inherit">
      <Badge badgeContent={count} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
}