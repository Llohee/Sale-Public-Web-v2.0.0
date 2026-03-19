import koiAxiosClient from "@/libs/KOI-axiosClient";
import { GetAllPaymentMethodResponse } from "./payment.schema";

const paymentApi = {
  getAllPaymentMethod(): Promise<GetAllPaymentMethodResponse> {
    const url = `/payment-methods`;
    return koiAxiosClient.get(url);
  },
};

export default paymentApi;
