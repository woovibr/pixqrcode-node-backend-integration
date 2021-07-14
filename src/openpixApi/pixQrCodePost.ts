import { baseUrl, getAuthorization } from "./api";

const url = "/api/openpix/v1/pixQrCode";

const getUrl = () => `${baseUrl}${url}`;

export type PixQrCodePostResponse = {
  pixQrCodeID: string;
  correlationID: string;
  brCode: string;
};

export type PixQrCodePostPayload = {
  name: string;
  correlationID: string;
  value: number;
  comment?: string;
  identifier: string;
  error?: string;
};
export const pixQrCodePost = async (
  payload: PixQrCodePostPayload
): Promise<PixQrCodePostResponse> => {
  const response = await fetch(getUrl(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  const data = await response.json();

  console.log({
    data,
  });

  return data;
};
