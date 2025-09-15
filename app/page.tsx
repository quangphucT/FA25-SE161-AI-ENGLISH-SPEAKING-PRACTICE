"use client";
import { useUserStore } from "@/store/useStore";
export default function Home() {
  const userOnZustand = useUserStore((state) => state.account);
  console.log("User on Zustand:", userOnZustand);
  return (
     <div>
      hello
     </div>
  );
}
