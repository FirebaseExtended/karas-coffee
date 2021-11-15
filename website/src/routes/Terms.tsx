import React from 'react';
import { Heading } from '../components/Heading';

export function Terms() {
  return (
    <section className="mt-24 max-w-3xl mx-auto px-4 lg:px-0">
      <Heading>Terms & Conditions</Heading>
      <div className="prose max-w-none mt-12">
        <p>
          These general Terms and Conditions (Terms) are an agreement (Agreement) between you and Invertase and cover
          your use of the information, software, products and services made available through this website (the
          Website). By using the website, you agree to be bound by these Terms, as well as our Privacy Policy.
        </p>
        <p>
          You are responsible for making all arrangements necessary for you to have access to the Website and for
          ensuring any contact details you provide us with are correct and up to date. You are also responsible for
          ensuring that all persons who access the Website through your internet connection are aware of these Terms and
          that they comply with them.
        </p>
        <p>
          The Website is offered to you conditional upon your acceptance of these Terms and any notices contained in
          these Terms and the Website itself. Please read these Terms carefully before you start using the Website. By
          using the Website, you agree to these Terms.
        </p>
        <p>
          Please note that the statements set forth under the headings are provided as a courtesy solely for your
          convenience and are not legally binding or otherwise intended to modify these Terms in any way.
        </p>
        <p>
          You must be the legal age of majority in your country of residence in order to use the Website. In no event is
          use of the Website permitted by those under the age of 18.
        </p>
      </div>
    </section>
  );
}
