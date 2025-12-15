import React from "react";
import Logo from "@/assets/Logo2.png";
import Image from "next/image";
import TextType from "@/components/TextType";
const Layout = () => {
  return (
    <div className="">
     <div className="relative">
  <Image
    src={Logo}
    alt="ResolveCore Logo"
   className="animate-fade-in-float filter brightness-105"
    priority
  />
</div>

      {/* <div className="flex items-center justify-center p-10">
        <div className="max-w-lg">
          <TextType
            text={[
              "ResolveCore – AI-Powered Support",
              "Submit and track tickets instantly with an intelligent workflow.",
              "AI delivers real-time solutions so your team resolves issues faster.",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>
      </div> */}
    </div>
  );
};
export default Layout;
