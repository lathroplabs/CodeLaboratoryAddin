import React from "react";
import SignIn from "./Signin";
import Subscription from "./Subscription";
import TestButton from "./Test";

export default function User({ setLoggedIn }) {
  return (
    <div className="centered">
      <hr className="rounded"></hr>
      <SignIn setLoggedIn={setLoggedIn} />
      <hr className="rounded"></hr>
      <Subscription />
      <TestButton />
    </div>
  );
}
