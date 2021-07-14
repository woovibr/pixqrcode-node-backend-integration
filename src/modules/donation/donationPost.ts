import { ParameterizedContext } from "koa";
import { pixQrCodePost as pixQrCodePostApi } from "../../openpixApi/pixQrCodePost";
import Donation from "./DonationModel";

type PixQrCodePostBody = {
  name: string;
  identifier: string;
  value: number;
  comment: string;
  status: string;
};
export const donationPost = async (
  ctx: ParameterizedContext<{}, {}, PixQrCodePostBody>
) => {
  const { body } = ctx.request;

  const donation = await new Donation({
    name: body.name,
    identifier: body.identifier,
    comment: body.comment,
    value: body.value,
  }).save();

  const payload = {
    name: body.name,
    correlationID: donation._id.toString(),
    identifier: donation.identifier,
    value: body.value,
    comment: body.comment,
  };

  const { brCode, error } = await pixQrCodePostApi(payload);

  if (error) {
    ctx.status = 400;
    ctx.body = {
      error,
    };
    return;
  }

  await Donation.updateOne(
    {
      _id: donation._id,
    },
    {
      $set: {
        brCode,
      },
    }
  );

  ctx.body = {
    name: donation.name,
    identifier: donation.identifier,
    comment: donation.comment,
    value: donation.value,
    status: donation.status,
    id: donation._id.toString(),
    brCode,
  };
  ctx.status = 200;
};
