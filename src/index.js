import React, { Suspense, useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const fetchUserProfile = (userId) => {
  return new Promise((resolve) => {
    console.log("fetchUserProfile");
    setTimeout(() => {
      resolve({
        name: userId,
        email: "test@test.com"
      });
    }, 1000);
  });
};

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

const initData = wrapPromise(fetchUserProfile(0));
const SuspensefulUserProfile = ({ userId }) => {
  const [data, setData] = useState(initData);
  useEffect(() => {
    setData(wrapPromise(fetchUserProfile(userId)));
  }, [userId]);
  return (
    // Add fallback
    <UserProfile data={data.read()} />
  );
};

const UserProfile = ({ data }) => {
  return (
    <>
      <h1>{data.name}</h1>
      <h2>{data.email}</h2>
    </>
  );
};
const UserProfileList = () => (
  <Suspense fallback={<h1> Loading </h1>}>
    <SuspensefulUserProfile userId={1} />
    <SuspensefulUserProfile userId={2} />
    <SuspensefulUserProfile userId={3} />
  </Suspense>
);

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(<UserProfileList />);
