import ImageModal from "./ImageModal";
import VideoModal from "./VideoModal";

export default function GalleryModal(props) {
  const { memory } = props;

  if (memory.type === "video") {
    return <VideoModal {...props} />;
  }

  return <ImageModal {...props} />;
}