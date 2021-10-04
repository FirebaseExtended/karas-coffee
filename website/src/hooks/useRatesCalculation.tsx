import { useFunctionsMutation } from '@react-query-firebase/functions';
import { functions } from '../firebase';
import { Shipment, ShippingRate } from '../types';

export function useRatesCalculation() {
  return useFunctionsMutation<
    {
      rateOptions: {
        carrierIds: string[];
        serviceCodes: string[];
      };
      shipment: Shipment;
    },
    { rates: ShippingRate[] }
  >(functions, 'ext-calculate-rates-getRatesHttps');
}
