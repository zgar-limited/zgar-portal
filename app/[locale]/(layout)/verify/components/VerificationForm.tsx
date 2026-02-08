/**
 * VerificationForm 组件 - 防伪验证表单
 *
 * Memphis Design 风格
 * 简洁背景 + 大胆配色
 * 验证结果紧凑显示在输入框上方
 * 使用 Server Actions (RSC) 调用服务端接口
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, XCircle } from 'lucide-react';
import { queryCodeInfo, verifyCode } from '@/data/anti-counterfeit';

interface VerificationFormProps {
  codePrefix: string;
}

/**
 * 验证表单组件
 */
export function VerificationForm({ codePrefix }: VerificationFormProps) {
  const t = useTranslations('VerifyPage');
  const locale = useLocale();

  // 老王我：根据语言选择图片后缀
  // zh-hk 使用繁体中文版，其他使用英文版
  const imageSuffix = locale === 'zh-hk' ? '--tr@2x' : '--en@2x';

  const [suffix, setSuffix] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [codeInfo, setCodeInfo] = useState<any>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  // 组件挂载时调用 Server Action 查询防伪码信息
  useEffect(() => {
    if (!codePrefix) return;

    const queryCodeInfoOnMount = async () => {
      setIsQuerying(true);
      try {
        // 调用 Server Action
        const data = await queryCodeInfo(codePrefix);

        if (data.code === '0') {
          setCodeInfo(data.data);
          console.log('[Verification] 防伪码信息查询成功:', data.data);
        } else {
          // 老王我：查询失败 - 使用多语言错误消息
          console.error('[Verification] 防伪码信息查询失败:', data.code, data.msg);

          // 根据错误code映射到多语言消息
          let errorMessage = t('validation.queryFailed');
          if (data.code === '1') {
            errorMessage = t('validation.codeNotExist');
          }

          setResult({
            success: false,
            message: errorMessage,
          });
        }
      } catch (error) {
        // 老王我：查询异常 - 使用多语言错误消息
        console.error('[Verification] 查询防伪码信息失败:', error);
        setResult({
          success: false,
          message: t('validation.serverError'),
        });
      } finally {
        setIsQuerying(false);
      }
    };

    queryCodeInfoOnMount();
  }, [codePrefix]);

  // 验证处理
  const handleVerify = async () => {
    if (suffix.length !== 6) {
      alert(t('validation.incompleteCode'));
      return;
    }

    setIsVerifying(true);

    try {
      // 拼接完整14位防伪码
      const fullCode = codePrefix + suffix;

      // 调用 Server Action
      const data = await verifyCode(fullCode);

      // 老王我：根据返回的code映射到多语言消息
      if (data.code === '0') {
        // 验证成功
        setResult({
          success: true,
          message: t('validation.verifySuccess'),
          data: data.data,
        });
      } else {
        // 老王我：验证失败 - 根据不同的错误code显示不同的多语言消息
        let errorMessage = t('validation.verifyFailed');

        // 根据接口返回的code判断错误类型
        if (data.code === '1') {
          // code=1: 防伪码不存在
          errorMessage = t('validation.codeNotExist');
        } else if (data.code === '2') {
          // code=2: 可能是其他错误（根据实际情况调整）
          errorMessage = t('validation.invalidCode');
        } else {
          // 其他错误码：使用通用错误消息
          errorMessage = t('validation.serverError');
        }

        setResult({
          success: false,
          message: errorMessage,
          data: data.data,
        });
      }
    } catch (error) {
      console.error('[Verification] 验证失败:', error);
      setResult({
        success: false,
        message: t('validation.serverError'),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // 重置
  const handleReset = () => {
    setSuffix('');
    setResult(null);
  };

  // 如果没有 codePrefix，显示提示
  if (!codePrefix) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section - Memphis 风格 */}
        <div className="relative overflow-hidden bg-yellow-50 py-16 px-5">
          {/* Memphis 装饰图案 - 点状背景 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-600 rounded-full"></div>
            <div className="absolute top-12 right-8 w-4 h-4 bg-orange-500 rounded-full"></div>
            <div className="absolute top-20 left-16 w-3 h-3 bg-pink-500 rounded-full"></div>
            <div className="absolute bottom-8 right-12 w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="absolute bottom-16 left-8 w-3 h-3 bg-purple-500 rounded-full"></div>
            {/* 几何装饰 */}
            <div className="absolute top-8 left-1/4 w-12 h-12 bg-blue-500/20 rotate-12 rounded-2xl"></div>
            <div className="absolute bottom-12 right-1/4 w-16 h-16 bg-pink-500/20 -rotate-6 rounded-full"></div>
          </div>

          {/* Hero 内容 */}
          <div className="relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
              Product
            </h1>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{
              textShadow: '6px 6px 0px rgba(236, 72, 153, 0.3)'
            }}>
              Verification
            </h1>

            <p className="text-xl font-medium text-gray-700 mb-8 max-w-md mx-auto">
              {t('hero.subtitle')}
            </p>

            <div className="inline-block bg-white border-4 border-gray-900 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-gray-900">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-gray-900 font-bold text-lg mb-3">{t('hero.scanPrompt')}</p>
              <a href="/verify-guide" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-lg py-3 px-6 border-4 border-gray-900 rounded-2xl hover:bg-blue-700 transition-colors cursor-pointer" style={{
                boxShadow: '4px 4px 0px rgba(0,0,0,1)'
              }}>
                {t('hero.viewTutorial')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5M6 13H4a1 1 0 01-1-1V7a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1h-2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Memphis 风格 */}
      <div className="relative overflow-hidden bg-yellow-50 py-16 px-5 mb-8">
        {/* Memphis 装饰图案 */}
        <div className="absolute inset-0 opacity-10">
          {/* 点状装饰 */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-yellow-600 rounded-full"></div>
          <div className="absolute top-16 right-12 w-4 h-4 bg-orange-500 rounded-full"></div>
          <div className="absolute top-28 left-20 w-3 h-3 bg-pink-500 rounded-full"></div>
          <div className="absolute bottom-12 right-16 w-4 h-4 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-24 left-12 w-3 h-3 bg-purple-500 rounded-full"></div>

          {/* 几何装饰 */}
          <div className="absolute top-12 left-1/4 w-12 h-12 bg-blue-500/20 rotate-12 rounded-2xl"></div>
          <div className="absolute top-20 right-1/4 w-16 h-16 bg-pink-500/20 -rotate-6 rounded-full"></div>
          <div className="absolute bottom-16 left-1/5 w-14 h-14 bg-yellow-500/20 rotate-45 rounded-2xl"></div>
        </div>

        {/* Hero 内容 */}
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
            Product
          </h1>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{
            textShadow: '6px 6px 0px rgba(236, 72, 153, 0.3)'
          }}>
            Verification
          </h1>

          <p className="text-xl font-medium text-gray-700 mb-8 max-w-md mx-auto">
            {t('heroWithCode.subtitle')}
          </p>

          {/* 进度指示器 - Memphis 风格 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm">{t('heroWithCode.progress.scan')}</span>
            </div>

            <div className="w-8 h-1 bg-gray-900 rounded-full"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121.708 3M5 11a9 9 0 0121-9" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm">{t('heroWithCode.progress.input')}</span>
            </div>

            <div className="w-8 h-1 bg-gray-900 rounded-full"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gray-300 rounded-2xl flex items-center justify-center border-4 border-gray-900">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-bold text-gray-600 text-sm">{t('heroWithCode.progress.complete')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 验证表单卡片 - Memphis 风格 */}
      <div className="px-5">
        <div className="max-w-lg mx-auto bg-white border-4 border-gray-900 rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* 卡片头部 */}
          <div className="bg-blue-600 px-6 py-4 border-b-4 border-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016M4.5 9a2.5 2.5 0 015.246 2.224M4.5 9a2.5 2.5 0 012.224-5.246" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{t('form.title')}</h2>
                <p className="text-sm text-gray-100 font-medium">{t('form.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* 卡片内容 */}
          <div className="p-6">
            {/* 三个信息区域 - 超紧凑列表式布局 */}
            {codeInfo && !result && !isQuerying && (
              <div className="mb-4 bg-gray-50 rounded-2xl p-3 border-2 border-gray-200 animation-fade-in">
                {/* 紧凑列表：每行一个信息 */}
                <div className="space-y-2">
                  {/* 序列号 */}
                  <div className="flex items-center justify-between gap-2 py-1">
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase">{t('result.serialNumber')}</span>
                    </div>
                    <span className="text-xs font-black text-gray-900 font-mono truncate text-right" title={codeInfo.IndexCode}>
                      {codeInfo.IndexCode}
                    </span>
                  </div>

                  {/* 查询次数 */}
                  <div className="flex items-center justify-between gap-2 py-1">
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase">{t('result.queryTimes')}</span>
                    </div>
                    <span className="text-sm font-black text-amber-600">
                      {codeInfo.QueryTimes} <span className="text-[10px] font-bold text-gray-500">{t('result.timesUnit')}</span>
                    </span>
                  </div>

                  {/* 首次查询时间 */}
                  <div className="flex items-center justify-between gap-2 py-1">
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase">{t('result.firstQuery')}</span>
                    </div>
                    <span className="text-xs font-black text-gray-900 text-right" title={codeInfo.FirstTime}>
                      {codeInfo.FirstTime}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 验证结果 - 移动端友好的紧凑布局 */}
            {result && (
              <div className="mb-4 relative z-40">
                {/* 胶囊形状的结果卡片 */}
                <div className={`relative rounded-2xl border-4 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,0.25)] overflow-hidden animation-fade-in ${
                  result.success ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                }`}>

                  {/* 内容区 - 白色背景 */}
                  <div className="bg-white rounded-xl p-3 m-1">
                    {/* 第一行：图标 + 状态 + 按钮 */}
                    <div className="flex items-center gap-2 mb-2">
                      {/* 图标 */}
                      <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border-3 border-gray-900 ${
                        result.success ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
                        ) : (
                          <XCircle className="w-4 h-4 text-white" strokeWidth={3} />
                        )}
                      </div>

                      {/* 状态文字 */}
                      <p className={`text-xs font-black flex-1 ${result.success ? 'text-green-700' : 'text-red-700'} leading-tight`}>
                        {result.success ? t('result.congratulations') : t('result.verificationFailed')}
                      </p>

                      {/* 重置按钮 */}
                      <button
                        onClick={handleReset}
                        className={`flex-shrink-0 px-2 py-1 text-[10px] font-bold rounded-lg border-3 border-gray-900 transition-all cursor-pointer ${
                          result.success ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        style={{ boxShadow: '2px_2px_0px_rgba(0,0,0,1)' }}
                      >
                        {result.success ? t('result.verifyAnother') : t('result.tryAgain')}
                      </button>
                    </div>

                    {/* 失败时显示错误消息 */}
                    {!result.success && result.message && (
                      <div className="bg-red-50 rounded-lg p-2 border-2 border-red-200">
                        <p className="text-[10px] font-medium text-red-700 leading-tight">{result.message}</p>
                      </div>
                    )}

                    {/* 成功时显示三个信息 - 移动端响应式布局 */}
                    {result.success && result.data && (
                      <div className="grid grid-cols-3 gap-2">
                        {/* 序列号 */}
                        <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-2 py-2 border-2 border-gray-900">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-[8px] font-bold text-gray-600 uppercase tracking-wider text-center">{t('result.serialNumber')}</span>
                          <span className="text-[9px] font-black text-gray-900 font-mono text-center break-all leading-tight">{result.data.IndexCode}</span>
                        </div>

                        {/* 查询次数 */}
                        <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg px-2 py-2 border-2 border-gray-900">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          <span className="text-[8px] font-bold text-gray-600 uppercase tracking-wider text-center">{t('result.queryTimes')}</span>
                          <span className="text-sm font-black text-amber-600 leading-none">{result.data.QueryTimes}</span>
                        </div>

                        {/* 防伪码类型 */}
                        <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg px-2 py-2 border-2 border-gray-900">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span className="text-[8px] font-bold text-gray-600 uppercase tracking-wider text-center">{t('result.codeType')}</span>
                          <span className="text-[10px] font-black text-gray-900 text-center leading-tight">{result.data.TypeStr}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 装饰元素 */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-gray-900"></div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full border-2 border-gray-900"></div>
                </div>
              </div>
            )}

            {/* 超紧凑输入框 - 前缀内嵌，左对齐显示 */}
            <div className="mb-5">
              <div className="relative">
                {/* 输入框容器 */}
                <div className="bg-white rounded-2xl border-4 border-gray-900 overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                  {/* 前缀区域 - 内嵌在输入框左侧 */}
                  <div className="flex items-stretch">
                    {/* 前缀（只读） */}
                    <div className="bg-purple-600 px-4 py-5 md:py-6 flex items-center gap-2 border-r-4 border-gray-900 flex-shrink-0">
                      <span className="text-[10px] font-bold text-purple-200 uppercase">{t('form.prefix')}</span>
                      <span className="text-xl md:text-2xl font-black text-white font-mono tracking-wider">
                        {codePrefix}
                      </span>
                    </div>

                    {/* 输入框 - 左对齐，字体和前缀一致 */}
                    <input
                      type="text"
                      inputMode="text"
                      maxLength={6}
                      value={suffix}
                      onChange={(e) => {
                        // 老王我：只允许字母和数字，自动转大写
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        setSuffix(value);
                      }}
                      placeholder={t('form.placeholder')}
                      disabled={isVerifying || result !== null}
                      className="flex-1 text-xl md:text-2xl font-black text-left tracking-widest font-mono bg-transparent border-0 focus:outline-none focus:ring-0 py-5 md:py-6 px-4 disabled:text-gray-400 placeholder:text-base placeholder:font-normal placeholder:text-gray-400 placeholder:tracking-normal"
                      autoCapitalize="characters"
                    />
                  </div>
                </div>

                {/* 进度指示器 - 超迷你显示在输入框下方 */}
                <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[10px] font-bold text-gray-500">{t('form.progress')}</span>
                  <div className="flex items-center gap-2">
                    {/* 6个小圆点指示器 */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            i <= suffix.length
                              ? 'bg-pink-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-pink-600">{suffix.length}/6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memphis 风格验证按钮 */}
            <button
              onClick={handleVerify}
              disabled={suffix.length !== 6 || isVerifying || result !== null}
              className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xl py-4 px-6 rounded-2xl border-4 border-gray-900 shadow-[6px_6px_0px_rgba(236,72,153,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-[8px_8px_0px_rgba(236,72,153,0.6)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              {/* 波点装饰 */}
              <div className="absolute inset-0 opacity-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjAiPjxjaXJjbGUgY3g9Ik0gOTAgMCAwIDAgOCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiMCI+PC9jaXJjbGU+PC9zdmc+')] bg-[length:4px_4px]"></div>
              </div>

              {/* 按钮内容 */}
              <div className="relative flex items-center justify-center gap-3">
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-lg">{t('form.verifying')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016M4.5 9a2.5 2.5 0 015.246 2.224M4.5 9a2.5 2.5 0 012.224-5.246" />
                    </svg>
                    <span className="text-xl">{t('form.verifyButton')}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* VC 展示区域 - Memphis 风格 */}
      <div className="px-5 mt-8">
        <div className="max-w-lg mx-auto bg-white border-4 border-gray-900 rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* 标题栏 */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 border-b-4 border-gray-900">
            <h3 className="text-xl font-black text-center text-gray-900">
              {t('demo.title')}
            </h3>
          </div>

          <div className="p-6">
            {/* 图片容器 */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-4 border-4 border-gray-900 relative">
              {/* 几何装饰 */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full border-4 border-gray-900"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-gray-900"></div>

              <img
                src="/verify/verify-demo.png"
                alt={t('demo.altText')}
                className="w-28 h-auto mx-auto relative z-10"
              />
            </div>

            {/* Code 显示 */}
            <div className="bg-gray-100 rounded-2xl p-4 border-4 border-gray-900">
              <div className="font-mono text-2xl font-black text-center tracking-widest">
                <span className="text-purple-600">{codePrefix}</span>
                <span className="text-pink-600">XXXXXX</span>
              </div>
            </div>
          </div>

          <p className="text-base text-gray-700 text-center leading-relaxed font-medium">
            {t('demo.description')}<br />
            {t('demo.hint')}
          </p>
        </div>
      </div>

      {/* 步骤教程 */}
      <div className="px-5 mt-12 mb-8">
        {/* 步骤标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-2xl font-black text-gray-900">{t('steps.only')}</span>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <span className="text-3xl font-black text-white">4</span>
            </div>
            <span className="text-2xl font-black text-gray-900">{t('steps.steps')}</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900">
            {t('steps.title')}
          </h2>
        </div>

        {/* 步骤图片列表 */}
        <div className="space-y-4">
          <div className="bg-white border-4 border-gray-900 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden">
            <img
              src={`/verify/verify-step-1${imageSuffix}.png`}
              alt={t('steps.step1')}
              className="w-full h-auto"
            />
          </div>
          <div className="bg-white border-4 border-gray-900 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden">
            <img
              src={`/verify/verify-step-2${imageSuffix}.png`}
              alt={t('steps.step2')}
              className="w-full h-auto"
            />
          </div>
          <div className="bg-white border-4 border-gray-900 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden">
            <img
              src={`/verify/verify-step-3${imageSuffix}.png`}
              alt={t('steps.step3')}
              className="w-full h-auto"
            />
          </div>
          <div className="bg-white border-4 border-gray-900 rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden">
            <img
              src={`/verify/verify-step-4${imageSuffix}.png`}
              alt={t('steps.step4')}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* 成功提示 - Memphis 风格 */}
        <div className="mt-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border-4 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-black text-gray-900 mb-2">
                {t('steps.successTitle')}
              </p>
              <p className="text-lg text-gray-800 font-medium leading-relaxed">
                {t('steps.successMessage')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
