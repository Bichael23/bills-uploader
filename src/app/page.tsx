import BillGenerator from "@/components/BillGenerator";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">
              Utility Bill Generator
            </h1>
            <p className="text-sm text-zinc-500">
              Generate AT&T utility bill PDFs from spreadsheet data
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-10">
        <BillGenerator />
      </div>
    </main>
  );
}
