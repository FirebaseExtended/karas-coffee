import { useFunctionsMutation } from '@react-query-firebase/functions';
import { functions } from '../firebase';

type RequestData = {
  address: {
    name: string;
    phone?: string;
    addressLine1: string;
    addressLine2?: string;
    cityLocality: string;
    stateProvince: string;
    postalCode: string;
    countryCode: 'US';
  };
};

type ResponseData = {
  validation: {
    status: 'verified' | 'unverified' | 'warning' | 'error';
  };
};

export function useAddressValidation() {
  return useFunctionsMutation<RequestData, ResponseData>(functions, 'ext-validate-address-validateAddressHttps', {
    timeout: 10000,
  });
}
