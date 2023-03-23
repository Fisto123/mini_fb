import jwt from 'jsonwebtoken'
export const auth = (req, res,next) => {
  const authHeader = req.headers.token
  if (authHeader) {
    const token = authHeader.split(" ")[1]; //getting the token
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authentitcated!");
  }
};
export const verifyTokenAndAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.admin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

export const verifyTokenAndSuperadmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.superadmin) {
      next();
    } else {
      res.status(403).json("sorry!!! You are not a superadmin!");
    }
  });
};