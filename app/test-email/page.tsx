'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult({
        status: response.status,
        statusText: response.statusText,
        data,
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-12">
        <div className="glass rounded-3xl p-8 border border-white/10">
          <h1 className="text-4xl font-black text-white mb-6">
            Test <span className="gradient-text">Email</span>
          </h1>
          <p className="text-gray-400 mb-8">
            测试邮件发送功能。输入邮箱地址，点击发送测试邮件。
          </p>

          <form onSubmit={handleTest} className="mb-8">
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-300 mb-3">
                测试邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                required
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-primary-500 text-[#0a0a0f] px-6 py-4 rounded-xl hover:bg-primary-400 transition-all font-black glow-green hover:glow-green-strong transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? '发送中...' : '发送测试邮件'}
            </button>
          </form>

          {result && (
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-black text-white mb-4">结果</h2>
              <pre className="bg-[#0a0a0f] p-4 rounded-lg overflow-auto text-sm text-gray-300">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">说明</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• 输入任意邮箱地址进行测试</li>
              <li>• 如果成功，您应该会收到一封测试邮件</li>
              <li>• 检查结果中的错误信息以诊断问题</li>
              <li>• 也可以查看 <a href="https://resend.com/emails" target="_blank" className="text-primary-400 hover:text-primary-300">Resend Dashboard</a> 中的发送记录</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

