import http from "k6/http";

export default function () {
  http.get("https://pixelism.duckdns.org/api/v1/sprites");
}