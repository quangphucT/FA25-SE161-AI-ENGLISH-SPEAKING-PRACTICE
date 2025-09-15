import { Button } from "./ui/button";
import googleIcon from "../public/icons/googleIcon.png"
import Image from "next/image";
export function GoogleLoginButton({onClick}: {onClick?: () => void}) {
    return (
         <>
         <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-[#22313c]" />
              <span className="mx-4 text-[#2ed7ff] font-bold">HOẶC</span>
              <div className="flex-grow h-px bg-[#22313c]" />
            </div>
           <div className="flex gap-4">
              <Button
                type="button"
                
                onClick={onClick}
                className="flex-1 flex items-center justify-center gap-2 bg-[#22313c] border-[#2c3e50] text-white rounded-xl py-[23px] text-lg cursor-pointer"
              >
                <Image
                  src={googleIcon}
                  alt="Google"
                  className="w-6 h-6"
                />
                GOOGLE
              </Button>
            </div>
            </>
    )
}