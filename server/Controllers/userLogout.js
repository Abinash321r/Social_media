const getLogoutStatus = async (req, res) => {
  res.clearCookie("usertoken", {
    httpOnly: true,
    sameSite: "none",
    secure: true, // change to true in production with HTTPS
  });

  return res.status(200).json({
    message: "Logged out successfully"
  });
};

export default getLogoutStatus;