Using ShipEngine, `addresses` can be `validated`.

In addition, relevant `shipping rates` can be generated for a user to select from.

---

## Configuration

A ShipEngine [API key](https://www.shipengine.com/docs/auth/) is a required field upon installation.

Other configuration includes a named
collection for `addresses` validation and a `schema` to map the data to ShipEngine.

The collection is monitored by the extension for any document updates and checks the address with ShipEngine, an
updated `validation` field will contain a `status` field, this will determine the success of the validation.

To calculate shipping rates a `cloud function` is installed. This will be named following the format
of `ext-calculate-rates-getRatesHttps`.

---

## Building the UI

The first step is to validate the address.

![image](https://user-images.githubusercontent.com/2060661/139263545-9efdab83-5c42-4c89-91a5-409eefddb9f3.png)

Once a validation field has been updated and successful. The address is now available for selection to acquire the
available shipping rates.

![image](https://user-images.githubusercontent.com/2060661/139264860-ce481793-11fa-46d8-8190-b38ff4d3c75c.png)

Using the following hook, we can call the cloud function with the selected address to return a list of shipping rates...

```ts
export function useRatesCalculation() {
  return useFunctionsCall<
    {
      rateOptions: {
        carrierIds: string[];
        serviceCodes: string[];
      };
      shipment: Shipment;
    },
    { rates: ShippingRate[] }
  >(functions, "ext-calculate-rates-getRatesHttps");
}
```

And via

```js
const rates = useRatesCalculation();

shipment.current = {
  shipDate: format(new Date(), "yyyy-MM-dd"),
  shipFrom: {
    name: "Kara's Coffee",
    // .... fill in the rest of the defined schema.
  },
};

rates.mutate({
  rateOptions: {
    carrierIds: ["se-765964", "se-765965", "se-765963"],
    serviceCodes: ["usps_media_mail"],
  },
  shipment: shipment.current,
});
```

The resulting shipping rates will contain data including

- rateId
- serviceType
- carrierDeliveryDays
- shippingAmount
  - amount

![image](https://user-images.githubusercontent.com/2060661/139269702-267ecdca-6ccc-48e0-942b-fa0ccf1a4f4b.png)

Once a successful rate has been selected, this value can then be added to the `checkout` for the user.

```js
const checkoutData = {
  price_data: {
    currency: "USD",
    unit_amount_decimal: (rate.shippingAmount.amount * 100) | 0,
    product_data: {
      name: "Shipping",
      description: `Shipping via ${rate.carrierFriendlyName}`,
    },
  },
  quantity: 1,
};
```

---

## Resources

- [Firebase Cloud Functions](https://cloud.google.com/functions)
- [ShipEngine shipping costs](https://www.shipengine.com/docs/rates/)
