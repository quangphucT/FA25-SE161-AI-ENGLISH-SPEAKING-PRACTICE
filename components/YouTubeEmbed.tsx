interface YouTubeEmbedProps {
  url: string;
  width?: number;
  height?: number;
}

export default function YouTubeEmbed({ url, width = 720, height = 400 }: YouTubeEmbedProps) {
    const videoId = url
    .replace("https://youtu.be/", "")
    .replace("https://www.youtube.com/watch?v=", "")
    .split("&")[0]; // loại param phụ
    return (
    <div className="w-full flex justify-center">
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-lg"
      />
    </div>  
  );
}

