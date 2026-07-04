import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Github, Instagram, Linkedin, Mail, Link as LinkIcon, Plus, Upload, X, Play } from "lucide-react";

// ---------------------------------------------------------------------------
// KESAV — FUTURE SCIENCE
// A quiet, gallery-like 3D portfolio. Single signature object: a nested
// orbital wireframe (rings + core) — echoes atomic structure without being
// literal or gimmicky. Everything else stays still and disciplined.
// ---------------------------------------------------------------------------

const ACCENT = "#6ee7d0"; // soft desaturated teal — the one accent
const NAV_ITEMS = ["Home", "Myself", "Photos & Videos", "Links"];

function OrbitalCanvas({ activeIndex }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ mouseX: 0, mouseY: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Signature object: core + three tilted rings
    const group = new THREE.Group();

    const coreGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xe9e7e2,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const ringColors = [0xe9e7e2, 0x6ee7d0, 0x8b8b87];
    const rings = [];
    [0, 1, 2].forEach((i) => {
      const ringGeo = new THREE.TorusGeometry(2.2 + i * 0.35, 0.008, 8, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: i === 1 ? 0.55 : 0.28,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = (Math.PI / 3) * i + 0.4;
      ring.rotation.y = (Math.PI / 5) * i;
      group.add(ring);
      rings.push(ring);
    });

    scene.add(group);

    // Particle field — sparse, faint
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8b8b87,
      size: 0.02,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const onMouseMove = (e) => {
      stateRef.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      stateRef.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.06;
      group.rotation.x = Math.sin(t * 0.08) * 0.15;
      rings.forEach((r, i) => {
        r.rotation.z = t * (0.03 + i * 0.015);
      });
      particles.rotation.y = t * 0.01;

      camera.position.x += (stateRef.current.mouseX * 0.6 - camera.position.x) * 0.03;
      camera.position.y += (-stateRef.current.mouseY * 0.4 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      coreGeo.dispose();
      coreMat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        r.material.dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}

function SectionShell({ eyebrow, title, children }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 md:py-32">
      <p
        className="text-[11px] tracking-[0.25em] uppercase mb-4"
        style={{ color: ACCENT }}
      >
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl text-[#e9e7e2] mb-10">
        {title}
      </h2>
      {children}
    </div>
  );
}

function HomeSection() {
  return (
    <div className="h-full w-full flex items-end md:items-center">
      <div className="px-6 md:px-16 pb-16 md:pb-0 max-w-3xl">
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-5 flex items-center gap-2"
          style={{ color: ACCENT }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: ACCENT }}
          />
          Inter 2nd Year Student — Future Science
        </p>
        <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] text-[#e9e7e2]">
          Kesav
        </h1>
        <p className="mt-6 text-[#8b8b87] text-base md:text-lg max-w-md leading-relaxed">
          Exploring where curiosity meets discipline — chemistry, physics,
          and the quiet mechanics that hold the universe together.
        </p>
      </div>
    </div>
  );
}

function MyselfSection() {
  return (
    <SectionShell eyebrow="About" title="Myself">
      <div className="space-y-6 text-[#c9c7c2] leading-relaxed">
        <p>
          I'm Kesav, currently in my Inter 2nd year, majoring toward the
          sciences — MPC. I spend most of my time between textbooks,
          experiments, and small side-curiosities about how things work at a
          fundamental level.
        </p>
        <p>
          I'm drawn to physics and chemistry in equal measure — the kind of
          subjects where a single equation quietly explains something you
          see every day. Long-term, I want to build a path in research and
          applied science.
        </p>
        <p className="text-[#8b8b87] text-sm pt-2 border-t border-white/10">
          Outside of academics — figuring out design, tinkering with small
          web projects like this one, and reading around topics that don't
          show up on the syllabus.
        </p>
      </div>
    </SectionShell>
  );
}

function LinksSection() {
  const [links, setLinks] = useState([
    { label: "Email", url: "mailto:kesav@example.com", icon: "mail" },
  ]);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  const iconFor = (key) => {
    const props = { size: 16, style: { color: ACCENT } };
    switch (key) {
      case "github":
        return <Github {...props} />;
      case "instagram":
        return <Instagram {...props} />;
      case "linkedin":
        return <Linkedin {...props} />;
      case "mail":
        return <Mail {...props} />;
      default:
        return <LinkIcon {...props} />;
    }
  };

  const guessIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes("git")) return "github";
    if (l.includes("insta")) return "instagram";
    if (l.includes("linked")) return "linkedin";
    if (l.includes("mail")) return "mail";
    return "link";
  };

  const addLink = () => {
    if (!draftLabel.trim() || !draftUrl.trim()) return;
    setLinks((prev) => [
      ...prev,
      { label: draftLabel.trim(), url: draftUrl.trim(), icon: guessIcon(draftLabel) },
    ]);
    setDraftLabel("");
    setDraftUrl("");
  };

  const removeLink = (i) => {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <SectionShell eyebrow="Elsewhere" title="Links">
      <div className="space-y-2 mb-10">
        {links.length === 0 && (
          <p className="text-[#8b8b87] text-sm">No links added yet.</p>
        )}
        {links.map((link, i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-white/10 bg-white/[0.02] rounded-md px-4 py-3 group"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-[#e9e7e2] text-sm hover:text-white"
            >
              {iconFor(link.icon)}
              <span>{link.label}</span>
            </a>
            <button
              onClick={() => removeLink(i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8b8b87] hover:text-white"
              aria-label={`Remove ${link.label}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-6">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#8b8b87] mb-3">
          Add a link
        </p>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="Label — e.g. Instagram"
            className="flex-1 bg-transparent border border-white/15 rounded-md px-3 py-2 text-sm text-[#e9e7e2] placeholder-[#65645f] focus:outline-none focus:border-[#6ee7d0]"
          />
          <input
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 bg-transparent border border-white/15 rounded-md px-3 py-2 text-sm text-[#e9e7e2] placeholder-[#65645f] focus:outline-none focus:border-[#6ee7d0]"
          />
          <button
            onClick={addLink}
            className="flex items-center justify-center gap-1.5 border border-white/15 rounded-md px-4 py-2 text-sm text-[#e9e7e2] hover:border-[#6ee7d0] hover:text-[#6ee7d0] transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>
    </SectionShell>
  );
}

function MediaSection() {
  const [items, setItems] = useState([]);
  const inputRef = useRef(null);

  const onFiles = useCallback((fileList) => {
    const files = Array.from(fileList);
    const next = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
    }));
    setItems((prev) => [...next, ...prev]);
  }, []);

  const removeItem = (i) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <SectionShell eyebrow="Gallery" title="Photos & Videos">
      <p className="text-[#8b8b87] text-sm mb-6 leading-relaxed">
        Upload a photo or a short clip. Files stay only in this browser
        session — refreshing the page will clear them.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 border border-white/15 rounded-md px-4 py-2.5 text-sm text-[#e9e7e2] hover:border-[#6ee7d0] hover:text-[#6ee7d0] transition-colors mb-10"
      >
        <Upload size={15} />
        Upload photo or video
      </button>

      {items.length === 0 ? (
        <div className="border border-dashed border-white/15 rounded-md py-16 text-center text-[#65645f] text-sm">
          Nothing here yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-md overflow-hidden border border-white/10 bg-white/[0.02] group"
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                  <Play
                    size={20}
                    className="absolute bottom-2 right-2 text-white/80 pointer-events-none"
                  />
                </div>
              )}
              <button
                onClick={() => removeItem(i)}
                className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState(0);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0b] overflow-hidden font-sans">
      {/* 3D background — persistent across sections */}
      <OrbitalCanvas activeIndex={active} />

      {/* vignette for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 60%, rgba(10,10,11,0.1) 0%, rgba(10,10,11,0.75) 70%, rgba(10,10,11,0.95) 100%)",
        }}
      />

      {/* nav */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-16 py-6 md:py-8">
        <span
          className="font-serif text-sm tracking-wide text-[#e9e7e2]"
        >
          Kesav
        </span>
        <div className="flex gap-5 md:gap-8">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              onClick={() => setActive(i)}
              className="text-[11px] tracking-[0.2em] uppercase transition-colors"
              style={{
                color: active === i ? ACCENT : "#8b8b87",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* content */}
      <main className="relative z-10 h-full overflow-y-auto">
        <div key={active} className="h-full animate-[fadeIn_0.6s_ease]">
          {active === 0 && <HomeSection />}
          {active === 1 && <MyselfSection />}
          {active === 2 && <MediaSection />}
          {active === 3 && <LinksSection />}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
      `}</style>
    </div>
  );
}
