"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { handleLogout } from "@/utils/auth";
import {
  Loader2,
  Clock,
  ShieldAlert,
  RefreshCw,
  Plus,
  LogOut,
  Mail,
  MessageCircle,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const statusDescriptions: Record<string, { title: string; message: string }> = {
  pending: {
    title: "Your profile is under review",
    message:
      "Thanks for submitting your documents. Verification can take 24–48 business hours. We will email you as soon as it is done.",
  },
  rejected: {
    title: "Your profile needs updates",
    message:
      "Please review your details and upload the required certificates, or contact support for more information.",
  },
  default: {
    title: "Confirming profile status",
    message:
      "We are checking your reviewer account status. Hit refresh if you recently updated any information.",
  },
};

const ReviewerWaitingPage = () => {
  const router = useRouter();
  const { data: meData, isLoading, isFetching, refetch } = useGetMeQuery();
  
  const statusRaw = meData?.reviewerProfile?.status || "";
  const normalizedStatus = statusRaw.trim().toLowerCase();

  const statusInfo =
    statusDescriptions[normalizedStatus as keyof typeof statusDescriptions] ||
    statusDescriptions.default;

  const reviewChecklist = [
    {
      title: "Verify personal details",
      description:
        "Make sure your contact info matches the registration form and is easy to reach.",
      state: "done",
    },
    {
      title: "Review certificates & experience",
      description:
        "Our specialist team is validating your certificates and stated years of experience.",
      state: "progress",
    },
    {
      title: "Activate reviewer role",
      description:
        "As soon as you’re approved, we will notify you via email.",
      state: "upcoming",
    },
  ] as const;

  const supportChannels: Array<{
    title: string;
    description: string;
    helper: string;
    icon: LucideIcon;
  }> = [
    {
      title: "Support email",
      description: "kaizdawson@gmail.com",
      helper: "Replies within 24 business hours",
      icon: Mail,
    },
    {
      title: "Live chat",
      description: "Zalo / Messenger",
      helper: "Available daily from 8:00 — 22:00",
      icon: MessageCircle,
    },
  ];

  const isRejected = normalizedStatus === "rejected";

  useEffect(() => {
    // Only redirect if data is loaded and status is active/approved
    if (!isLoading && meData?.reviewerProfile?.status) {
      const status = meData.reviewerProfile.status.trim().toLowerCase();
      if (status === "approved" || status === "active" || status === "actived") {
        router.replace("/dashboard-reviewer-layout");
      }
    }
  }, [meData, isLoading, router]);

  // Auto refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 600000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading && !meData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1a1f] via-[#18232a] to-[#0f1a1f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#2ed7ff]" />
          <p className="text-gray-300 text-sm">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1217] via-[#18232a] to-[#06090c] px-4 py-12">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-gray-300">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#2ed7ff] font-semibold">
              AESP Review Center
            </p>
            <p className="text-white text-2xl md:text-3xl font-bold mt-1">
              Track the progress of your reviewer profile
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-right">
            <p className="text-xs uppercase tracking-wide text-gray-400">Reviewer name</p>
            <p className="text-white font-semibold">{meData?.fullName || "Updating..."}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
          {/* Overview & steps */}
          <section className="relative overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-br from-[#1f2d38] via-[#151f27] to-[#101820] p-8 shadow-2xl">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute -top-16 -right-6 w-56 h-56 bg-[#2ed7ff]/40 blur-[120px]" />
              <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-blue-500/30 blur-[140px]" />
            </div>
            <div className="relative z-10 space-y-8 text-left">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 text-xs font-semibold text-gray-200">
                  <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10">
                    Status:{" "}
                    <span className="text-white">
                      {statusRaw.toUpperCase() || "UNAVAILABLE"}
                    </span>
                  </span>
                  <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10">
                    Profile • {meData?.fullName || "N/A"}
                  </span>
                </div>
                <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">
                  {statusInfo.title}
                </h1>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
                  {statusInfo.message}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-wide text-gray-400 font-semibold">
                  Current review steps
                </p>
                <div className="space-y-3">
                  {reviewChecklist.map((item, index) => {
                    const badgeClass =
                      item.state === "done"
                        ? "bg-[#2ed7ff]/20 text-[#2ed7ff] border-[#2ed7ff]/30"
                        : item.state === "progress"
                        ? "bg-orange-400/15 text-orange-200 border-orange-300/30"
                        : "bg-white/5 text-gray-300 border-white/10";
                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4"
                      >
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold ${badgeClass}`}
                        >
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-semibold">{item.title}</p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm uppercase tracking-wide text-gray-400 font-semibold">
                  Support channels
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {supportChannels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <div
                        key={channel.title}
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-5 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <Icon className="h-5 w-5 text-[#2ed7ff]" />
                          {channel.title}
                        </div>
                        <p className="text-gray-300 text-sm">{channel.description}</p>
                        <p className="text-xs text-gray-400">{channel.helper}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Action card */}
          <section className="relative rounded-[32px] border border-white/5 bg-[#0f161d]/85 p-8 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#2ed7ff]/40 blur-[110px]" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/30 blur-[130px]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`w-28 h-28 rounded-full border-4 flex items-center justify-center ${
                    isRejected
                      ? "bg-red-500/10 border-red-400/40"
                      : "bg-[#2ed7ff]/10 border-[#2ed7ff]/40 animate-pulse"
                  }`}
                >
                  {isRejected ? (
                    <ShieldAlert className="h-14 w-14 text-red-300" strokeWidth={1.4} />
                  ) : (
                    <Clock className="h-14 w-14 text-[#2ed7ff]" strokeWidth={1.4} />
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#2ed7ff] font-semibold">
                    Profile status
                  </p>
                  <h2 className="text-white text-3xl font-bold mt-2">{statusInfo.title}</h2>
                  <p className="text-gray-300 text-sm mt-2 max-w-sm">{statusInfo.message}</p>
                </div>
              </div>

              {isRejected ? (
                <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-left">
                  <ShieldAlert className="h-5 w-5 text-red-300 mt-1" />
                  <div>
                    <p className="text-white font-semibold">Additional information required</p>
                    <p className="text-gray-300 text-sm">
                      Please upload the requested certificates or contact Support for the exact
                      requirements that need to be fulfilled.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300">Estimated processing time</p>
                      <p className="text-white text-2xl font-bold">24 - 48 hours</p>
                    </div>
                    <Clock className="h-8 w-8 text-[#2ed7ff]" />
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-xs text-gray-400">
                    <Info className="h-4 w-4 text-[#2ed7ff] mt-0.5" />
                    <span>
                      Keep your phone and email reachable so you can confirm activation as soon as
                      the review is done.
                    </span>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="w-full h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Refresh status
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => router.push("/entrance_information")}
                  className="w-full h-14 bg-[#2ed7ff]/90 hover:bg-[#23bfe3] text-[#0b1115] font-semibold rounded-2xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add certificates
                </Button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                The system auto-refreshes every 10 minutes, but you can update manually at any time.
              </p>

              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl"
                onClick={() => handleLogout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReviewerWaitingPage;

