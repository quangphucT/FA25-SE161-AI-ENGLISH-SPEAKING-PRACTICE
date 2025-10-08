"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CertStatus = "Pending" | "Accepted" | "Rejected";

type CertificateItem = {
  id: string;
  name: string;
  imageUrl: string;
  status: CertStatus;
};

const initialCertificates: CertificateItem[] = [
  {
    id: "C001",
    name: "IELTS Academic 7.5",
    imageUrl: "/images/bang1.png",
    status: "Pending",
  },
  {
    id: "C002",
    name: "TESOL Certificate",
    imageUrl: "/images/bang1.png",
    status: "Pending",
  },
  {
    id: "C003",
    name: "TOEIC 900+",
    imageUrl: "/images/bang1.png",
    status: "Accepted",
  },
];

const Certificate = () => {
  const [certificates, setCertificates] =
    useState<CertificateItem[]>(initialCertificates);
  const [selected, setSelected] = useState<CertificateItem | null>(null);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [fullScreen, setFullScreen] = useState(false);
  const [scale, setScale] = useState(1);

  const openDetail = (cert: CertificateItem) => {
    setSelected(cert);
    setZoom(false);
    setOffset({ x: 0, y: 0 });
    setScale(1);
    setOpen(true);
  };

  const updateStatus = (status: CertStatus) => {
    if (!selected) return;
    setCertificates((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, status } : c))
    );
    setSelected((prev) =>
      prev ? ({ ...prev, status } as CertificateItem) : prev
    );
  };

  const statusBadge = (status: CertStatus) => {
    if (status === "Accepted") return <Badge variant="default">Accepted</Badge>;
    if (status === "Rejected")
      return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Certificates Management
        </h1>
        <p className="text-sm text-slate-500">
          Review and update certificate statuses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card
            key={cert.id}
            className="overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold line-clamp-1">
                  {cert.name}
                </CardTitle>
                {statusBadge(cert.status)}
              </div>
              <p className="text-xs text-slate-500 mt-1">ID: {cert.id}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => openDetail(cert)}
                >
                  Xem chi tiết
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setCertificates((prev) =>
                        prev.map((c) =>
                          c.id === cert.id ? { ...c, status: "Pending" } : c
                        )
                      )
                    }
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                    onClick={() =>
                      setCertificates((prev) =>
                        prev.map((c) =>
                          c.id === cert.id ? { ...c, status: "Accepted" } : c
                        )
                      )
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() =>
                      setCertificates((prev) =>
                        prev.map((c) =>
                          c.id === cert.id ? { ...c, status: "Rejected" } : c
                        )
                      )
                    }
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {open && selected && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selected.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">ID: {selected.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(selected.status)}
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                >
                  Đóng
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                <div
                  className="relative w-full max-w-3xl touch-pan-y"
                  onMouseDown={(e) => {
                    if (!zoom) return;
                    setIsPanning(true);
                    setPanStart({
                      x: e.clientX - offset.x,
                      y: e.clientY - offset.y,
                    });
                  }}
                  onMouseMove={(e) => {
                    if (!isPanning) return;
                    setOffset({
                      x: e.clientX - panStart.x,
                      y: e.clientY - panStart.y,
                    });
                  }}
                  onMouseUp={() => setIsPanning(false)}
                  onMouseLeave={() => setIsPanning(false)}
                  onWheel={(e) => {
                    e.preventDefault();
                    const delta = -e.deltaY * 0.0015;
                    const next = Math.max(1, Math.min(3, scale + delta));
                    setScale(next);
                    setZoom(next > 1);
                    if (next === 1) setOffset({ x: 0, y: 0 });
                  }}
                  onTouchStart={(e) => {
                    if (!zoom) return;
                    const t = e.changedTouches[0];
                    setIsPanning(true);
                    setPanStart({
                      x: t.clientX - offset.x,
                      y: t.clientY - offset.y,
                    });
                  }}
                  onTouchMove={(e) => {
                    if (!isPanning) return;
                    const t = e.changedTouches[0];
                    setOffset({
                      x: t.clientX - panStart.x,
                      y: t.clientY - panStart.y,
                    });
                  }}
                  onTouchEnd={() => setIsPanning(false)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    onClick={() => setFullScreen(true)}
                    draggable={false}
                    style={{
                      transform: zoom
                        ? `translate(${offset.x}px, ${offset.y}px) scale(${scale})`
                        : undefined,
                      transition: isPanning
                        ? undefined
                        : "transform 200ms ease",
                      cursor: zoom
                        ? isPanning
                          ? "grabbing"
                          : "grab"
                        : "zoom-in",
                    }}
                    className="select-none w-full h-auto"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Click vào hình để phóng to/thu nhỏ
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => updateStatus("Pending")}
                  >
                    Đặt Pending
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                    onClick={() => updateStatus("Accepted")}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => updateStatus("Rejected")}
                  >
                    Từ chối
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {fullScreen && selected && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => {
                const next = !zoom;
                setZoom(next);
                if (!next) setOffset({ x: 0, y: 0 });
              }}
            >
              {zoom ? "Thu nhỏ" : "Phóng to"}
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                setFullScreen(false);
                setZoom(false);
                setOffset({ x: 0, y: 0 });
              }}
            >
              Đóng
            </Button>
          </div>
          <div
            className="relative max-w-[95vw] max-h-[90vh] w-full h-full flex items-center justify-center overflow-hidden"
            onMouseDown={(e) => {
              if (!zoom) return;
              setIsPanning(true);
              setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
            }}
            onMouseMove={(e) => {
              if (!isPanning) return;
              setOffset({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y,
              });
            }}
            onMouseUp={() => setIsPanning(false)}
            onMouseLeave={() => setIsPanning(false)}
            onWheel={(e) => {
              e.preventDefault();
              const delta = -e.deltaY * 0.0015;
              const next = Math.max(1, Math.min(3, scale + delta));
              setScale(next);
              setZoom(next > 1);
              if (next === 1) setOffset({ x: 0, y: 0 });
            }}
            onTouchStart={(e) => {
              if (!zoom) return;
              const t = e.changedTouches[0];
              setIsPanning(true);
              setPanStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
            }}
            onTouchMove={(e) => {
              if (!isPanning) return;
              const t = e.changedTouches[0];
              setOffset({
                x: t.clientX - panStart.x,
                y: t.clientY - panStart.y,
              });
            }}
            onTouchEnd={() => setIsPanning(false)}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setFullScreen(false);
                setZoom(false);
                setOffset({ x: 0, y: 0 });
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.imageUrl}
              alt={selected.name}
              draggable={false}
              onDoubleClick={() => {
                const next = !zoom;
                setZoom(next);
                if (!next) setOffset({ x: 0, y: 0 });
              }}
              style={{
                transform: zoom
                  ? `translate(${offset.x}px, ${offset.y}px) scale(${scale})`
                  : "scale(1)",
                transition: isPanning ? undefined : "transform 200ms ease",
                cursor: zoom ? (isPanning ? "grabbing" : "grab") : "zoom-in",
                maxWidth: "95vw",
                maxHeight: "90vh",
              }}
              className="select-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;
