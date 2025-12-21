"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const coreFeatures = [
  {
    title: "AI luyện nói realtime",
    desc: "AI đóng vai partner hội thoại, gợi ý câu trả lời, sửa phát âm và tốc độ nói theo thời gian thực.",
    chip: "Luyện nói",
  },
  {
    title: "Reviewer chấm bài chuyên sâu",
    desc: "Mỗi bài nói được reviewer đánh giá chi tiết: phát âm, từ vựng, ngữ pháp và độ tự nhiên.",
    chip: "Phản hồi từ Reviewer",
  },
];



const flow = [
  {
    step: "01",
    title: "Test đầu vào & phân level",
    desc: "Learner làm bài test speaking, AI chấm điểm phát âm & fluency, gán level A1–C2.",
  },
  {
    step: "02",
    title: "Luyện nói với AI",
    desc: "Learner luyện theo Course → Chapter → Exercise → Question với trợ lý hội thoại AI.",
  },
  {
    step: "03",
    title: "Gửi bài cho Reviewer",
    desc: "Audio được gửi cho Reviewer để chấm, kèm feedback chi tiết & gợi ý câu nói tự nhiên.",
  },
  {
    step: "04",
    title: "Theo dõi tiến độ & cải thiện",
    desc: "Dashboard hiển thị heatmap luyện tập, xu hướng điểm phát âm và lịch sử đánh giá.",
  },
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 w-full z-50 border-b bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg">
                  <Image
            src="/images/imageLanding2.jpg"
            alt="AESP Logo"
            fill
            className="object-contain p-1 scale-280"
          />

            </div>
            <div className="leading-tight">
              <div className="text-2xl font-extrabold tracking-tight text-slate-900">
                AESP
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Nền tảng Luyện Nói AI
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition">
              Tính năng
            </a>
           
            <a href="#flow" className="hover:text-slate-900 transition">
              Quy trình
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="border-slate-300 cursor-pointer text-slate-700 hover:bg-slate-100 rounded-xl px-5 py-2 text-sm"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r cursor-pointer from-blue-500 to-emerald-400 hover:from-blue-400 hover:to-emerald-300 rounded-xl px-5 py-2 text-sm font-semibold shadow-md">
                Bắt đầu miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="pt-[104px] md:pt-[120px] pb-20 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
             Luyện Nói Tiếng Anh với Trợ Giúp của AI (AESP)
            </div>

            <h1 className="text-[34px] md:text-[44px] lg:text-[50px] font-extrabold leading-tight tracking-tight">
              Nền tảng luyện nói tiếng Anh{" "}
              <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                có sự hỗ trợ của AI
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-700 leading-relaxed max-w-xl">
              AESP giúp người học vượt qua nỗi sợ nói tiếng Anh bằng môi trường
              luyện tập không phán xét, có AI hỗ trợ và Reviewer chấm bài chi tiết.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold px-8 py-6 rounded-2xl text-base shadow-md">
                  Bắt đầu trải nghiệm
                </Button>
              </Link>
              <a
                href="#features"
                className="text-sm md:text-base text-slate-600 flex items-center gap-2 hover:text-slate-900 transition"
              >
                Xem chi tiết tính năng
                <span className="text-lg">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE FEATURES ================= */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Chức năng nòng cốt của{" "}
              <span className="text-emerald-600">AESP</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreFeatures.map((f, i) => (
              <div
                key={i}
                className="rounded-3xl border bg-white p-7 flex flex-col gap-4 shadow-md hover:-translate-y-1 transition"
              >
                <div className="text-xs font-semibold text-emerald-700">
                  {f.chip}
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      {/* ================= FLOW ================= */}
      <section id="flow" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {flow.map((step, i) => (
          <div
  key={i}
  className={`rounded-3xl p-6 flex flex-col gap-3 shadow-md border transition
    ${i === 0 && "bg-blue-50 border-blue-200"}
    ${i === 1 && "bg-emerald-50 border-emerald-200"}
    ${i === 2 && "bg-violet-50 border-violet-200"}
    ${i === 3 && "bg-amber-50 border-amber-200"}
  `}
>

<div
className={`text-sm md:text-base font-sans font-bold
    ${i === 0 && "text-blue-600"}
    ${i === 1 && "text-emerald-600"}
    ${i === 2 && "text-violet-600"}
    ${i === 3 && "text-amber-600"}
  `}
>
                BƯỚC {step.step}
              </div>
              <div className="text-base font-semibold">
                {step.title}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-slate-100 border-t">
        <div className="max-w-5xl mx-auto text-center px-6 md:px-10 space-y-6">
         

          <div className="flex justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold px-10 py-6 rounded-2xl shadow-md">
                Trải nghiệm với vai trò Learner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 bg-white border-t text-center text-xs text-slate-500">
        © 2025 AESP – Nền tảng luyện nói tiếng Anh với sự hỗ trợ của AI.
      </footer>
    </div>
  );
}
