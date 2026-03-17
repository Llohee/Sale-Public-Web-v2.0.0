import axiosClient from "@/libs/axiosClient"
import { GetAllPaymentMethodResponse } from "./payment.schema"

const paymentApi = {
  getAllPaymentMethod(): Promise<GetAllPaymentMethodResponse> {
    const url = `/payment-methods`
    return axiosClient.get(url)
  },
}

export default paymentApi