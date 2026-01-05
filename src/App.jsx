export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white shadow rounded-2xl p-6">
        <h1 className="text-2xl font-bold">اختبار اتجاه الصفحة</h1>

        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-gray-900 text-white">
            زر 1
          </button>
          <button className="px-4 py-2 rounded-xl border">زر 2</button>
        </div>

        <p className="mt-4 text-gray-700">
          لو الصفحة RTL، الأزرار هتبدأ من اليمين، والنص هيبقى محاذي لليمين.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-gray-100">
          <div>يمين</div>
          <div>شمال</div>
        </div>
      </div>
    </div>
  );
}
