"use client";
import useUser from "@/hooks/useUser";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { use, useEffect, useRef } from "react";

const Room = ({ params }: { params: Promise<{ roomid: string }> }) => {
  const { fullName } = useUser();
  const resolvedParams = use(params);
  const roomID = resolvedParams.roomid;
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!),
      process.env.NEXT_PUBLIC_ZEGO_APP_SIGN!,
      roomID,
      fullName || "mentor" + Date.now(),
      fullName || "mentor" + Date.now()
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: container.current!,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  }, [roomID]);
  return <div ref={container} style={{ width: '100vw', height: '100vh' }}></div>;
};

export default Room;
