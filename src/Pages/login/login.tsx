import React from "react";

function LoginPage() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[25rem] h-[23rem] rounded-md md:rounded-lg shadow border border-gray-300 p-3 lg:p-6 flex flex-col gap-3">
        <h1 className="text-2xl text-orange-600 font-bold py-2 text-center">
          Sign In
        </h1>
        <form action="" className="flex flex-col gap-3 mt-3">
          <input
            type="text"
            placeholder="Email"
            className="w-full px-3 border border-gray-300 text-gray-600 outline-none rounded-md py-1"
          />
          <input
            type="text"
            placeholder="Password"
            className="w-full px-3 border border-gray-300 text-gray-600 outline-none rounded-md py-1"
          />
          <a
            href="#"
            className="flex justify-end items-center underline cursor-pointer opacity-80"
          >
            Forget Password
          </a>

          <button
            type="submit"
            className=" text-white cursor-pointer w-full px-6 py-2 rounded-lg bg-orange-600 flex justify-center items-center"
          >
            Submit
          </button>
        </form>

        <div className="mt-2 text-center">
          You don't have account?{" "}
          <a href="/signup" className="underline text-orange-600 text-center">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
