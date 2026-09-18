import { Redirect } from 'expo-router';
import React from 'react';

/** The tabs layout gates on setup and sign-in; "/" just goes to the counter. */
export default function Index() {
  return <Redirect href="/sell" />;
}
