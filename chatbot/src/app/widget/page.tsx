import { ChatWidget } from "@/components/ChatWidget";

export default function WidgetPage() {
  return (
    <main className="min-h-screen bg-transparent p-0 sm:grid sm:place-items-center sm:bg-slate-100 sm:p-4">
      <div className="w-full max-w-[420px]">
        <ChatWidget embedded />
      </div>
    </main>
  );
}
