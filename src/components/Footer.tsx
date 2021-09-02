import React from 'react';
import { Link } from 'react-router-dom';

const footer = {
  Sitemap: {
    Home: '/',
    Account: '/account',
    Subscription: '/account/subscription',
    Order: '/account/order',
  },
};
export function Footer() {
  return (
    <footer className="w-full pb-16 mt-16 border-t">
      <div className="flex justify-around pt-8 mx-auto flex-center max-w-7xl md:px-6 m-gray-200">
        <div className="flex flex-col space-y-2">
          <div className="pb-2 uppercase border-b border-black">Extensions</div>
          <a href={'https://firebase.google.com/products/extensions/firestore-algolia-search'}>Algolia</a>
          <a href={'https://firebase.google.com/products/extensions/storage-resize-images'}>Resize Images</a>
          <a href={'https://firebase.google.com/products/extensions/firestore-algolia-search'}>
            Firestore Bundle Server
          </a>
          <a href={'https://www.algolia.com/'}>Delete User Data</a>
          <a href={'https://firebase.google.com/products/extensions/mailchimp-firebase-sync'}>Mailchimp</a>
          <a href={'https://firebase.google.com/products/extensions/firestore-stripe-subscriptions'}>Stripe</a>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="pb-2 uppercase border-b border-black">Firebase</div>
          <a href={'https://console.firebase.google.com/'}>Getting started</a>
          <a href={'https://firebase.google.com/products-build'}>Build</a>
          <a href={'https://firebase.google.com/products-release'}>Release & Monitor</a>
          <a href={'https://firebase.google.com/products-engage'}>Engage</a>

          <a href={'https://console.firebase.google.com/project/fir-demo-project/overview'}>Try demo</a>
          <a href={'https://youtu.be/iosNuIdQoy8'}>Watch video</a>
        </div>
      </div>
      <div className="flex justify-center my-16">Social Links?</div>
    </footer>
  );
}
