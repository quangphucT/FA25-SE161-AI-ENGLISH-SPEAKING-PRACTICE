
"use client";
import Image from "next/image";
import Link from "next/link";
import logoWeb from "../../../public/icons/logoWeb.svg"
import imageLandingPage from "../../../public/images/imageLanding.avif"    
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
const features = [
  {
    title: "Luyện nói tiếng Anh với AI",
    desc: "Công nghệ AI giúp bạn luyện nói, sửa phát âm, phản xạ tự nhiên như người bản xứ.",
    img: "/duo_speaking.png",
  },
  {
    title: "Mentor đồng hành",
    desc: "Đăng ký gói premium để được học cùng mentor, nhận feedback cá nhân và lộ trình riêng.",
    img: "/duo_mentor.png",
  },
  {
    title: "Miễn phí. Vui nhộn. Hiệu quả.",
    desc: "Bài học nhỏ gọn, gamification, nhận điểm thưởng, bảng xếp hạng, học mọi lúc mọi nơi.",
    img: "/duo_fun.png",
  },
];

const Page = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-[300px] py-6">
        <div onClick={() => router.push("/")} className="flex items-center gap-2 cursor-pointer">
          <Image src={logoWeb} alt="Logo" width={40} height={40} />
          <span className="text-4xl font-bold text-[#58cc02]">SpeakAI</span>
        </div>
      
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center px-[200px] py-12 gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Học nói tiếng Anh với AI & Mentor
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Nền tảng luyện nói tiếng Anh hiện đại, cá nhân hóa, hiệu quả. Đăng ký gói premium để học cùng mentor, nhận feedback trực tiếp và lộ trình riêng cho bạn.
          </p>
          <div className="flex gap-4">
            <Link href="/sign-up">
              <Button className="bg-[#58cc02] cursor-pointer  text-white font-bold px-8 py-[30px] rounded-xl text-lg shadow hover:bg-[#47b800] transition">Bắt đầu miễn phí</Button>
            </Link>
            <Link href="/sign-in">
              <Button className="bg-white border cursor-pointer border-[#58cc02] text-[#58cc02] font-bold px-8 py-[30px] rounded-xl text-lg shadow hover:bg-[#e6f7d9] transition">Tôi đã có tài khoản</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src={imageLandingPage} alt="Duolingo AI" width={400} height={400} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-16 bg-[#f7f9fa]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#58cc02] mb-10 text-center">Tại sao chọn SpeakAI?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center gap-4">
                <Image src={f.img} alt={f.title} width={120} height={120} />
                <h3 className="text-xl font-bold text-[#58cc02]">{f.title}</h3>
                <p className="text-gray-700 text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#58cc02] mb-8">Gói học & Mentor</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#f7f9fa] rounded-2xl shadow p-8 flex flex-col gap-4">
              <h3 className="text-xl font-bold text-gray-900">Miễn phí</h3>
              <ul className="text-gray-700 text-left list-disc ml-6 mb-4">
                <li>Luyện nói với AI</li>
                <li>Bài học gamification</li>
                <li>Bảng xếp hạng, điểm thưởng</li>
              </ul>
              <Link href="/sign-up">
                <button className="bg-[#58cc02] text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-[#47b800] transition">Bắt đầu miễn phí</button>
              </Link>
            </div>
            <div className="bg-[#e6f7d9] rounded-2xl shadow p-8 flex flex-col gap-4 border border-[#58cc02]">
              <h3 className="text-xl font-bold text-[#58cc02]">Premium + Mentor</h3>
              <ul className="text-gray-700 text-left list-disc ml-6 mb-4">
                <li>Luyện nói với AI & mentor</li>
                <li>Feedback cá nhân, lộ trình riêng</li>
                <li>Học 1-1 với mentor</li>
                <li>Ưu tiên tính năng mới</li>
              </ul>
              <Link href="/sign-up">
                <button className="bg-[#58cc02] text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-[#47b800] transition">Đăng ký Premium</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 bg-[#f7f9fa] text-center text-gray-500 text-sm">
        © 2025 SpeakAI. Dự án luyện nói tiếng Anh với AI & Mentor. Không liên kết với Duolingo.
      </footer>
    </div>
  );
};

export default Page;
