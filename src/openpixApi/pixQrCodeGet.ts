import { baseUrl, getAuthorization } from "./api";

const url = (id: string) => `/api/openpix/v1/pixQrCode/${id}`;

const getUrl = (id: string) => `${baseUrl}${url(id)}`;

export const pixQrCodeGet = async (id: string) => {
  const response = await fetch(getUrl(id), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
  });

  const data = await response.json();

  return data;
};
