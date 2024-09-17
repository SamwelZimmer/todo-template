"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiGoogleFill, RiGithubFill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { signIn } from "next-auth/react";
import DefaultTextInput, {
  PasswordInput,
} from "@/components/common/TextInputs";
import { signUpSchema, signInSchema } from "@/lib/schemas";
import { checkUserExistsAndCorrectCredentials } from "@/lib/queries";

export default function EnterPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let validationSchema = isSignUp ? signUpSchema : signInSchema;

    setIsLoading(true);
    try {
      // validate form data and throw an error if it's invalid
      const formData = {
        email,
        password,
        ...(isSignUp ? { repeatPassword: confirmPassword } : {}),
      };
      validationSchema.parse(formData);

      // get existing user from DB
      const validUser = await checkUserExistsAndCorrectCredentials(
        email,
        password
      );

      if (!isSignUp && !validUser) {
        setErrorMessages(["Incorrect credentials"]);
        throw new Error("Incorrect credentials");
      } else if (isSignUp && validUser) {
        setErrorMessages(["This email address already exists"]);
        throw new Error("This email address already exists");
      }

      // sign in with next-auth
      await signIn("credentials", {
        email: email,
        password: password,
      });

      // empty error messages
      setErrorMessages([]);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // handle validation errors
        setErrorMessages(err.errors.map((err) => err.message));
      } else {
        // handle other errors
        console.error("something went wrong", err);
        const error = err as any;
        setErrorMessages([error.message as any as string]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full sm:max-w-md h-screen items-center justify-center flex flex-col gap-4 mx-auto px-4">
      <h1 className="text-4xl text-left w-full mb-4 font-semibold">
        {isSignUp ? "Sign up" : "Log in"}
      </h1>

      <form onSubmit={handleSubmit} className="relative flex flex-col w-full">
        {errorMessages && (
          <motion.span
            layout="position"
            className="absolute -top-7 left-0 text-sm text-red-600"
          >
            {errorMessages[0]}
          </motion.span>
        )}

        <DefaultTextInput
          value={email}
          setValue={setEmail}
          placeholder="Enter email address"
          className="mb-4"
        />

        <div className="mb-4">
          <PasswordInput
            value={password}
            setValue={setPassword}
            placeholder="Enter password..."
          />
        </div>

        <div className="overflow-hidden">
          <AnimatePresence initial={false}>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <PasswordInput
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  placeholder="Confirm password..."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          className="mt-2 rounded-2xl h-11 font-semibold"
          disabled={isLoading}
          variant="default"
        >
          {isSignUp ? "Sign up" : "Log in"}
        </Button>
      </form>

      <div className=" w-[calc(100%-32px)] flex items-center gap-4 my-2">
        <hr className="border-t  w-full" />
        <span className="opacity-50 text-sm">or</span>
        <hr className="border-t  w-full" />
      </div>

      <div className="flex flex-row gap-4 w-full">
        <ProviderButton
          icon={<RiGoogleFill size={20} />}
          onClick={() => signIn("google")}
          variant="outline"
        />
        <ProviderButton
          icon={<RiGithubFill size={20} />}
          onClick={() => signIn("github")}
          variant="outline"
        />
      </div>

      <div>
        <Button
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          className="opacity-50"
        >
          {isSignUp
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </Button>
      </div>
    </main>
  );
}

interface ProviderButtonProps {
  text?: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
}

const ProviderButton = ({
  text,
  icon,
  onClick,
  variant = "default",
}: ProviderButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className="rounded-2xl h-11 flex items-center gap-2 w-full font-semibold relative"
    >
      <div>{icon}</div>
      {text && <span>{text}</span>}
    </Button>
  );
};
