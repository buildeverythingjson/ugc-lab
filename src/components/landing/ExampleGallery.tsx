import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const examples = [
  { src: "https://files.advideolab.com/assets/library/2026/01/1769813178339-88424ef9.mp4" },
  { src: "https://files.advideolab.com/assets/library/2026/01/1769638080415-8bae04cc.mp4" },
  { src: "https://files.advideolab.com/assets/library/2026/01/1769813210931-2e964f2f.mp4" },
];

const infiniteExamples = [...examples, ...examples];

const AutoPlayVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioningLoop, setIsTransitioningLoop] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = true;
    video.preload = "auto";

    const revealVideo = () => {
      setIsPlaying(true);
      requestAnimationFrame(() => {
        setIsTransitioningLoop(false);
      });
    };

    const hideForLoopTransition = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      if (video.duration - video.currentTime <= 0.18) {
        setIsTransitioningLoop(true);
      }
    };

    const handleSeeking = () => {
      if (video.currentTime <= 0.12) {
        setIsTransitioningLoop(true);
      }
    };

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          const retry = () => void video.play();
          document.addEventListener("touchstart", retry, { once: true });
          document.addEventListener("click", retry, { once: true });
        });
      }
    };

    video.addEventListener("canplay", tryPlay);
    video.addEventListener("playing", revealVideo);
    video.addEventListener("timeupdate", hideForLoopTransition);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeking);

    if (video.readyState >= 3) tryPlay();

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("playing", revealVideo);
      video.removeEventListener("timeupdate", hideForLoopTransition);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", handleSeeking);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-card">
      <video
        ref={videoRef}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        className={`w-full h-full object-cover pointer-events-none ${isPlaying ? "visible" : "invisible"}`}
        src={src}
      />
      <div
        className={`absolute inset-0 bg-card transition-opacity duration-200 pointer-events-none ${
          isPlaying && !isTransitioningLoop ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

const ExampleGallery = () => {
  return (
    <section id="eksempler" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Se hva AI-en kan lage</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Ekte eksempler generert av UGC Lab
          </p>
        </div>

        {/* Mobile: infinite auto-scrolling marquee */}
        <div className="md:hidden overflow-hidden -mx-4">
          <div className="flex gap-4 animate-[marquee_12s_linear_infinite] w-max">
            {infiniteExamples.map((ex, i) => (
              <div key={i} className="flex-shrink-0 w-[60vw] max-w-[250px]">
                <div className="rounded-xl overflow-hidden border border-border bg-card aspect-[9/16]">
                  <AutoPlayVideo src={ex.src} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {examples.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="rounded-xl overflow-hidden border border-border bg-card aspect-[9/16]">
                <AutoPlayVideo src={ex.src} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-12">
          <Link to="/register">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary px-8 h-12 text-base font-semibold">
              Lag din første video
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExampleGallery;
