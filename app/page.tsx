"use client";
import ThreeScene from "@/components/ThreeScene";
import { useUserStore } from "@/store/useStore";
export default function Home() {
  const userOnZustand = useUserStore((state) => state.account);
  console.log("User on Zustand:", userOnZustand);
  return (
     <div>
      <ThreeScene/>
     </div>
  );
}
