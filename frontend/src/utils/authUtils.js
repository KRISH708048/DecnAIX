function isTokenExpired() {
    const expiry = localStorage.getItem("tokenExpiry");
    return !expiry || Date.now() > parseInt(expiry, 10);
  }
  
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
}

export {isTokenExpired, logoutUser};
  