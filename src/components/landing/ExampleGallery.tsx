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

const LOOP_END_TRIM_SECONDS = 0.35;
const LOOP_RESTART_AT_SECONDS = 0.06;

const AutoPlayVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const isRestartingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";

    const onPlaying = () => {
      window.setTimeout(() => setShowOverlay(false), 80);
    };

    const tryPlay = () => {
      const p = video.play();
      if (p) {
        p.catch(() => {
          const retry = () => void video.play();
          document.addEventListener("touchstart", retry, { once: true });
          document.addEventListener("click", retry, { once: true });
        });
      }
    };

    const handleTimeUpdate = () => {
      if (!video.duration || isRestartingRef.current) return;

      if (video.currentTime >= video.duration - LOOP_END_TRIM_SECONDS) {
        isRestartingRef.current = true;
        video.currentTime = LOOP_RESTART_AT_SECONDS;

        const restartPromise = video.play();
        if (restartPromise) {
          restartPromise.finally(() => {
            isRestartingRef.current = false;
          });
        } else {
          isRestartingRef.current = false;
        }
      }
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);

    if (video.readyState >= 3) tryPlay();

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-card overflow-hidden">
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        preload="auto"
        className="w-full h-full object-cover pointer-events-none"
        src={src}
      />
      {showOverlay && <div className="absolute inset-0 bg-card pointer-events-none" />}
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
