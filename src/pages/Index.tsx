import { useState, useRef, useEffect } from "react"
import Icon from "@/components/ui/icon"

function playPurr() {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  const duration = 3.5

  const osc = ctx.createOscillator()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  const gain = ctx.createGain()

  lfo.frequency.value = 25
  lfoGain.gain.value = 18
  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)

  osc.type = "sawtooth"
  osc.frequency.value = 80

  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.value = 400

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3)
  gain.gain.setValueAtTime(0.12, ctx.currentTime + duration - 0.3)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

  lfo.start(ctx.currentTime)
  osc.start(ctx.currentTime)
  lfo.stop(ctx.currentTime + duration)
  osc.stop(ctx.currentTime + duration)
}

function playSound(type: "meow" | "yay" | "click" | "tick" | "sad" | "fanfare") {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

  const play = (freq: number, start: number, dur: number, vol = 0.3, wave: OscillatorType = "sine") => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = wave
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
    gain.gain.setValueAtTime(0, ctx.currentTime + start)
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
    osc.start(ctx.currentTime + start)
    osc.stop(ctx.currentTime + start + dur + 0.05)
  }

  if (type === "meow") {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = "sine"
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.1)
    osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.45)
  } else if (type === "yay") {
    [0, 0.12, 0.24].forEach((t, i) => play(500 + i * 150, t, 0.18, 0.2))
    play(900, 0.36, 0.4, 0.25)
  } else if (type === "click") {
    play(800, 0, 0.06, 0.15, "square")
    play(1000, 0.05, 0.08, 0.12, "square")
  } else if (type === "tick") {
    play(1200, 0, 0.04, 0.1, "sine")
  } else if (type === "sad") {
    play(500, 0, 0.3, 0.2)
    play(400, 0.25, 0.35, 0.18)
    play(350, 0.5, 0.5, 0.15)
  } else if (type === "fanfare") {
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) => play(f, i * 0.12, 0.2, 0.22))
    play(1047, 0.5, 0.6, 0.28)
    play(784, 0.52, 0.6, 0.2)
    play(523, 0.54, 0.6, 0.15)
  }
}

const CONFETTI_COLORS = ["#f472b6", "#fb923c", "#facc15", "#34d399", "#60a5fa", "#c084fc", "#f9a8d4"]

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 3,
      size: 8 + Math.random() * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotate: Math.random() * 360,
      shape: Math.random() > 0.5 ? "circle" : "rect",
      sway: (Math.random() - 0.5) * 120,
    }))
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.current.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-30px",
            width: p.size,
            height: p.shape === "circle" ? p.size : p.size * 0.5,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in infinite`,
            ["--sway" as string]: `${p.sway}px`,
          }}
        />
      ))}
    </div>
  )
}

const CATS = {
  ask: "https://cdn.poehali.dev/projects/20aa7ced-b5b6-4a89-a004-16993173c9d5/files/d6d2a2cb-ac02-472b-8ce2-31287a960247.jpg",
  happy: "https://cdn.poehali.dev/projects/20aa7ced-b5b6-4a89-a004-16993173c9d5/files/18cd7a76-8a4a-4800-b70f-ffe54355a0fc.jpg",
  writing: "https://cdn.poehali.dev/projects/20aa7ced-b5b6-4a89-a004-16993173c9d5/files/73e2e2b3-4492-4930-b7c4-f22120f598f8.jpg",
  clock: "https://cdn.poehali.dev/projects/20aa7ced-b5b6-4a89-a004-16993173c9d5/files/49650bc7-b1d3-4eff-a351-7d2ad2dca29f.jpg",
  sad: "https://cdn.poehali.dev/projects/20aa7ced-b5b6-4a89-a004-16993173c9d5/files/c8e5f3d2-e3b6-42e1-9cc1-0981002843f7.jpg",
}

const PLACES = [
  { label: "Кино", icon: "Film" },
  { label: "Кафе-мафе, покушать", icon: "UtensilsCrossed" },
  { label: "Цирк", icon: "Drama" },
  { label: "Аттракционы", icon: "FerrisWheel" },
  { label: "Поедим в приют для собак", icon: "Dog" },
]

function RunawayButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const runAway = () => {
    const angle = Math.random() * Math.PI * 2
    const dist = 120 + Math.random() * 80
    setPos({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist })
  }

  return (
    <button
      onMouseEnter={runAway}
      onTouchStart={(e) => {
        e.preventDefault()
        runAway()
      }}
      onClick={(e) => e.preventDefault()}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className={`relative rounded-full px-10 py-4 text-lg font-extrabold transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </button>
  )
}

function CatImage({ src, alt, wiggle = false }: { src: string; alt: string; wiggle?: boolean }) {
  return (
    <div className={`mx-auto mb-6 ${wiggle ? "animate-wiggle" : "animate-float-cat"}`}>
      <img
        src={src}
        alt={alt}
        className="mx-auto h-52 w-52 rounded-[2.5rem] object-cover shadow-[0_20px_50px_-15px_rgba(244,114,182,0.5)] sm:h-64 sm:w-64"
      />
    </div>
  )
}

const PrimaryBtn =
  "rounded-full bg-gradient-to-r from-pink-400 to-rose-400 px-10 py-4 text-lg font-extrabold text-white shadow-lg shadow-pink-300/50 transition-all hover:scale-105 hover:shadow-xl active:scale-95"

export default function Index() {
  const [step, setStep] = useState(1)
  const [place, setPlace] = useState("")
  const [datetime, setDatetime] = useState("")
  const [customPlace, setCustomPlace] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const go = (s: number) => {
    setStep(s)
    containerRef.current?.scrollTo({ top: 0 })
  }

  const goWithSound = (s: number, sound: Parameters<typeof playSound>[0]) => {
    playSound(sound)
    go(s)
  }

  useEffect(() => {
    const timeout = setTimeout(() => playSound("meow"), 600)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* decorative blobs */}
      <div className="pointer-events-none fixed -left-20 -top-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-16 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none fixed left-1/2 top-1/3 h-60 w-60 rounded-full bg-rose-200/30 blur-3xl" />

      <div
        ref={containerRef}
        className="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-10"
      >
        {/* STEP 1 */}
        {step === 1 && (
          <div key="s1" className="w-full max-w-md animate-pop-in text-center">
            <CatImage src={CATS.ask} alt="Милый котик" />
            <h1 className="mb-10 text-3xl font-black leading-snug text-rose-500 sm:text-4xl">
              КАТЁНА! Ты хочешь пойти со мной на свидание?{")))"}
            </h1>
            <div className="relative flex h-24 items-center justify-center gap-6">
              <button onClick={() => goWithSound(2, "yay")} className={PrimaryBtn}>
                ДА
              </button>
              <RunawayButton className="bg-white text-rose-400 shadow-md ring-2 ring-rose-200">
                НЕТ
              </RunawayButton>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div key="s2" className="w-full max-w-md animate-pop-in text-center">
            <CatImage src={CATS.happy} alt="Радостный котик" wiggle />
            <h1 className="mb-10 break-words text-4xl font-black text-rose-500 sm:text-5xl">
              ЕЕЕЕЕЕЕЕЕЕЕЕ{")"}
            </h1>
            <button onClick={() => goWithSound(3, "meow")} className={PrimaryBtn}>
              Дальше
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div key="s3" className="w-full max-w-md animate-pop-in text-center">
            <CatImage src={CATS.writing} alt="Котик записывает" />
            <h1 className="mb-8 text-2xl font-black leading-snug text-rose-500 sm:text-3xl">
              Куда я пойду с самой потрясающей девушкой в мире?
            </h1>
            <div className="grid grid-cols-2 gap-4">
              {PLACES.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setPlace(p.label)
                    setShowCustomInput(false)
                    goWithSound(4, "click")
                  }}
                  className="flex flex-col items-center gap-2 rounded-3xl bg-white/80 py-6 font-extrabold text-rose-500 shadow-md ring-2 ring-pink-100 transition-all hover:scale-105 hover:bg-white hover:shadow-lg active:scale-95"
                >
                  <Icon name={p.icon} size={36} className="text-pink-400" />
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => { setShowCustomInput(true); playSound("click") }}
                className="flex flex-col items-center gap-2 rounded-3xl bg-white/80 py-6 font-extrabold text-rose-500 shadow-md ring-2 ring-pink-100 transition-all hover:scale-105 hover:bg-white hover:shadow-lg active:scale-95"
              >
                <Icon name="Pencil" size={36} className="text-pink-400" />
                Твой вариант
              </button>
            </div>
            {showCustomInput && (
              <div className="mt-4 flex gap-2">
                <input
                  autoFocus
                  value={customPlace}
                  onChange={(e) => setCustomPlace(e.target.value)}
                  placeholder="Напиши свой вариант..."
                  className="flex-1 rounded-2xl border-2 border-pink-200 bg-white/90 px-4 py-3 font-bold text-rose-500 shadow-inner outline-none focus:border-pink-400"
                />
                <button
                  disabled={!customPlace.trim()}
                  onClick={() => {
                    setPlace(customPlace.trim())
                    goWithSound(4, "click")
                  }}
                  className={`${PrimaryBtn} px-6 py-3 text-base ${!customPlace.trim() ? "cursor-not-allowed opacity-40 hover:scale-100" : ""}`}
                >
                  ОК
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div key="s4" className="w-full max-w-md animate-pop-in text-center">
            <CatImage src={CATS.clock} alt="Котик смотрит на часы" />
            <h1 className="mb-8 text-2xl font-black leading-snug text-rose-500 sm:text-3xl">
              Лапушка моя ненаглядная! Когда тебе будет удобно?
            </h1>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="mb-8 w-full rounded-2xl border-2 border-pink-200 bg-white/90 px-5 py-4 text-center text-lg font-bold text-rose-500 shadow-inner outline-none focus:border-pink-400"
            />
            <button
              onClick={() => goWithSound(5, "sad")}
              disabled={!datetime}
              className={`${PrimaryBtn} ${!datetime ? "cursor-not-allowed opacity-40 hover:scale-100" : ""}`}
            >
              Дальше
            </button>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div key="s5" className="w-full max-w-lg animate-pop-in text-center">
            <CatImage src={CATS.sad} alt="Задумчивый котик" />
            <div className="mb-6 space-y-3 rounded-3xl bg-white/80 p-6 text-left shadow-md ring-2 ring-pink-100">
              <div className="flex items-center gap-3">
                <Icon name="MapPin" size={22} className="text-pink-400" />
                <span className="font-extrabold text-rose-500">Место:</span>
                <span className="font-bold text-rose-400">{place}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="CalendarHeart" size={22} className="text-pink-400" />
                <span className="font-extrabold text-rose-500">Когда:</span>
                <span className="font-bold text-rose-400">
                  {datetime ? new Date(datetime).toLocaleString("ru-RU", { dateStyle: "long", timeStyle: "short" }) : ""}
                </span>
              </div>
            </div>
            <p className="mb-8 text-base font-semibold leading-relaxed text-rose-500/90">
              Я не программист, и мне не приходят твои ответы, поэтому просто сфоткай экран и пришли мне. Иначе буду считать, что 40 лет тебя всё ещё не устраивает...
            </p>
            <div className="relative flex h-28 flex-col items-center justify-center gap-4 sm:h-24 sm:flex-row">
              <button onClick={() => goWithSound(6, "fanfare")} className={PrimaryBtn}>
                Я отправила фото
              </button>
              <RunawayButton className="bg-white text-rose-400 shadow-md ring-2 ring-rose-200">
                Я верна своим принципам
              </RunawayButton>
            </div>
          </div>
        )}
        {/* STEP 6 — финал с конфетти */}
        {step === 6 && (
          <>
            <Confetti />
            <div key="s6" className="relative z-10 w-full max-w-md animate-pop-in text-center">
              <CatImage src={CATS.happy} alt="Радостный котик" wiggle />
              <h1 className="animate-yay mb-4 text-6xl font-black text-rose-500 sm:text-7xl">
                УРА!!!!
              </h1>
              <p className="text-xl font-extrabold text-pink-500">
                Подожди пока я приду в себя от счастья и позвоню тебе!) 💕
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}