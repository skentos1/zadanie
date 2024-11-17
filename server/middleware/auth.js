import dotenv from "dotenv";
dotenv.config();

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.query.api_key;
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: "Neautorizovany. Chybny api kluc." });
  }
};

export default apiKeyAuth;
