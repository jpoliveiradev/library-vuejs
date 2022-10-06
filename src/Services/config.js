import axios from "axios";

export const http = axios.create({
  baseURL: "https://library-dotnet.loca.lt/api/v2/",
  // baseURL: "http://localhost:5000/api/v2/",
  JSON: true,
});
