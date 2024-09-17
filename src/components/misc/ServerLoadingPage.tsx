export default function ServerLoadingPage() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-background dark">
      <span className="font-black text-5xl text-zinc-600 animate-bounce">
        {" Loading..."}
      </span>
    </div>
  );
}
