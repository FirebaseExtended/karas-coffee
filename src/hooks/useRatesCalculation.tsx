import { useFunctionsMutation } from "@react-query-firebase/functions";
import { functions } from "../firebase";

export function useRatesCalculation() {
  return useFunctionsMutation<any, { rates: any[] }>(functions, 'ext-calculate-rates-getRatesHttps')
}