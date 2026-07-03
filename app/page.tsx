export default function Page() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1B7F4B] to-[#1B7F4B]/80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-8 mx-auto">
          <div className="text-5xl font-bold text-[#1B7F4B]">T</div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">TerraIQ</h1>
        <p className="text-xl text-white/90 mb-8">Intelligence for Every Farm</p>
        <div className="flex gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-[#F4B400] animate-bounce" />
          <div className="w-3 h-3 rounded-full bg-[#F4B400] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 rounded-full bg-[#F4B400] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
