import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useHistory } from "react-router-dom";
import { clearState } from "../features/cars/carsSlice";
import { clearUser } from "../features/auth/userSlice";
import { useSelector, useDispatch } from "react-redux";
// Array of available pages
const pages = ["home", "signin", "signup"];

// Component for the responsive app bar
function ResponsiveAppBar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Event handler to open the navigation menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // Event handler to open the user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Event handler to close the navigation menu and navigate to the selected page
  const handleCloseNavMenu = (page) => {
    if (page === "home") {
      history.push("/");
    } else {
      history.push(`/${page}`);
    }
    setAnchorElNav(null);
  };

  // Event handler to close the user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOutHandler = () => {
    dispatch(clearState());
    dispatch(clearUser());
    handleCloseUserMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and Home button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            {pages.includes("home") && (
              <Button
                onClick={() => handleCloseNavMenu("home")}
                sx={{ mx: 1, color: "white" }}
              >
                Home
              </Button>
            )}
          </Box>

          {/* Signin, Signup, and Profile menu */}
          <Box sx={{ flexGrow: 1 }} />

          <Box>
            {pages
              .filter((page) => !["home"].includes(page))
              .map((page) => (
                <Button
                  key={page}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{ mx: 1, color: "white" }}
                >
                  {page}
                </Button>
              ))}
            {user.token && (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* Add Sign Out menu item */}
                  <MenuItem onClick={signOutHandler}>Sign Out</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
