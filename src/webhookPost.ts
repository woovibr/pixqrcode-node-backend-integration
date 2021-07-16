import { ParameterizedContext } from "koa";
import { debugConsole } from "./debugConsole";
import Donation, { DONATION_STATUS } from "./modules/donation/DonationModel";
import { Types } from "mongoose";

export type WebhookPostBody = {
  pixQrCode: PixQrCodeItem;
  pix: PixItem;
};
export type PixQrCodeItem = {
  _id: string;
  name: string;
  identifier: string;
  value: number;
  comment: string;
  createdBy: string;
  company: string;
  correlationID: string;
  createdAt: string;
  updatedAt: string;
};
export type PixItem = {
  _id: string;
  pixQrCode: string;
  time: string;
  value: number;
  transactionID: string;
  infoPagador: string;
  raw: Raw;
};
export type Raw = {
  horario: string;
  valor: string;
  endToEndId: string;
  txid: string;
  infoPagador: string;
};

export const webhookSecret = "Do not tell anyone";

export const webhookPost = async (
  ctx: ParameterizedContext<{}, {}, WebhookPostBody>
) => {
  debugConsole({
    body: ctx.request.body,
    params: ctx.params,
    headers: ctx.headers,
  });

  // this make sure this call was made by OpenPix services
  if (ctx.headers.authorization !== webhookSecret) {
    ctx.status = 401;
    ctx.body = {
      error: "unauthorized",
    };
    return;
  }

  // eslint-disable-next-link
  const { pixQrCode, pix } = ctx.request.body;

  // webhook payload of test
  if (!pixQrCode && !pix) {
    ctx.status = 200;
    return;
  }

  const donation = await Donation.findOne({
    identifier: pixQrCode.identifier,
  });

  if (!donation) {
    ctx.body = {};
    ctx.status = 200;
    return;
  }

  if (
    donation.identifier === pixQrCode.identifier &&
    donation.identifier === pix.transactionID
  ) {
    await Donation.updateOne(
      {
        _id: donation._id,
      },
      {
        $set: {
          status: DONATION_STATUS.PAIED,
        },
      }
    );
  }

  // @todo improve this
  // if (pixQrCode.status === "COMPLETED") {
  //   await Donation.updateOne(
  //     {
  //       _id: donation._id,
  //     },
  //     {
  //       $set: {
  //         status: DONATION_STATUS.PAIED,
  //       },
  //     }
  //   );
  // }

  ctx.body = {};
  ctx.status = 200;
};
