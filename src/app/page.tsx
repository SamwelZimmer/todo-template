import {
  RiGithubLine,
  RiImageCircleLine,
  RiGithubFill,
  RiTwitterXLine,
} from "react-icons/ri";
import Link from "next/link";

import DefaultButton from "@/components/common/Buttons";

export default function Home() {
  return (
    <>
      <main className="min-h-[calc(100vh-56px)] pt-[57px] flex items-center">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 flex flex-col gap-12 items-center md:flex-row md:gap-16 py-8">
          <div className="w-full flex flex-col gap-4">
            <h1 className="text-5xl font-bold text-primary">
              Lorem ipsum dolor sit amet.
            </h1>
            <h2 className="text-muted-foreground">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit dolor sapiente magni consequatur.
            </h2>
            <div className="mt-8 flex gap-4">
              <DefaultButton text="Get Started" className="h-11" />
              <DefaultButton
                text="The Code"
                variant="outline"
                icon={<RiGithubLine size={20} />}
                className="space-x-2 h-11"
              />
            </div>
          </div>
          <div className="rounded-2xl bg-secondary shadow-inner w-full max-w-md aspect-square flex items-center justify-center">
            <RiImageCircleLine size={24} className="opacity-25" />
          </div>
        </div>
      </main>

      <div className="w-full h-14 border-t px-4 sm:px-8 flex items-center justify-between text-muted-foreground text-sm">
        <span className="">Samwel Zimmer</span>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/SamwelZimmer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiGithubFill size={24} />
          </Link>

          <Link
            href="https://x.com/samwelzimmer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiTwitterXLine size={20} />
          </Link>
        </div>
      </div>
    </>
  );
}
