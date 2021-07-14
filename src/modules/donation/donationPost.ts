import { ParameterizedContext } from "koa";
import { pixQrCodePost as pixQrCodePostApi } from "../../openpixApi/pixQrCodePost";
import Donation from "./DonationModel";

type PixQrCodePostBody = {
  name: string;
  identifier: number;
  value: number;
  comment: number;
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
    comment: donation.comment,
    value: donation.value,
    id: donation._id.toString(),
    status: donation.status,
    brCode,
  };
  ctx.status = 200;
};
