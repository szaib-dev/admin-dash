import { useState, type ChangeEvent } from "react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { useMutation } from "@tanstack/react-query";
import { FiAlertCircle, FiCheck, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import type { CredentialType } from "../../../types";
import { AuthLogin } from "../../../http/api";
import { getRequestErrorMessage, loginSchema } from "../../../validation/auth";
import useMainStore from "../../../store/MainStore";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const {fetchUserItself, user} = useMainStore()

  const login = async (data: CredentialType) => {
    return AuthLogin(data);
  };
  const { mutate, isPending, isSuccess, isError, error, reset, data } =
    useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: () => {
      setShowPassword(false);
      fetchUserItself()
    },
  });

  const [form, fields] = useForm({
    constraint: getZodConstraint(loginSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: loginSchema,
      });
    },
    onSubmit(event, { submission }) {
      event.preventDefault();

      if (!submission || submission.status !== "success") {
        return;
      }

      const values = submission.value;

      setFormData(values);
      mutate(values);
      console.log("Sign in values:", values);
    },
  });

  if(isSuccess){
    console.log(user, '--------')
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (isSuccess || isError) {
      reset();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buttonClassName = isSuccess
    ? "bg-green-600 hover:bg-green-600"
    : isPending
      ? "bg-orange-500 hover:bg-orange-500"
      : "bg-orange-600 hover:bg-orange-700";

  const statusMessage =
    data?.data?.message ??
    (isSuccess ? "Signed in successfully." : getRequestErrorMessage(error));

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[25rem] rounded-md md:rounded-lg shadow border border-gray-300 p-3 lg:p-6 flex flex-col gap-3">
        <h1 className="text-2xl text-orange-600 font-bold py-2 text-center">
          Sign In
        </h1>
        <form {...getFormProps(form)} className="flex flex-col gap-3 mt-3">
          <input
            {...getInputProps(fields.email, {
              type: "email",
              value: false,
            })}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 border border-gray-300 text-gray-600 outline-none rounded-md py-2"
          />
          {fields.email.errors?.[0] ? (
            <p id={fields.email.errorId} className="text-sm text-red-600">
              {fields.email.errors[0]}
            </p>
          ) : null}
          <div className="relative">
            <input
              {...getInputProps(fields.password, {
                type: showPassword ? "text" : "password",
                value: false,
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 pr-12 border border-gray-300 text-gray-600 outline-none rounded-md py-2"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer flex h-5 w-5 items-center justify-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {fields.password.errors?.[0] ? (
            <p id={fields.password.errorId} className="text-sm text-red-600">
              {fields.password.errors[0]}
            </p>
          ) : null}
          <a
            href="#"
            className="flex justify-end items-center underline cursor-pointer opacity-80"
          >
            Forget Password
          </a>

          <button
            type="submit"
            disabled={isPending}
            className={`text-white cursor-pointer disabled:cursor-not-allowed w-full px-6 py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 ${buttonClassName}`}
          >
            {isPending ? <FiLoader className="animate-spin" size={18} /> : null}
            {isSuccess ? <FiCheck size={18} /> : null}
            <span>
              {isPending ? "Signing In..." : isSuccess ? "Success" : "Submit"}
            </span>
          </button>
          {isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-start gap-2">
              <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
              <span>{statusMessage}</span>
            </div>
          ) : null}
          {isSuccess ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 flex items-start gap-2">
              <FiCheck className="mt-0.5 shrink-0" size={16} />
              <span>{statusMessage}</span>
            </div>
          ) : null}
        </form>

        <div className="mt-2 text-center">
          You don't have account?{" "}
          <a href="/auth/register" className="underline text-orange-600 text-center">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
