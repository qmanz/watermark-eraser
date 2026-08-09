/**
 * AdSlot.tsx — 谷歌 AdSense 广告位占位组件
 *
 * 预留标准谷歌广告位：
 * - leaderboard: 728x90（桌面端横幅）
 * - medium-rectangle: 300x250（侧边栏矩形）
 * - responsive: 自适应（推荐，适配移动端）
 *
 * 接入方式：
 * 1. 在 index.html <head> 中添加 AdSense 脚本
 * 2. 将 AdSlot 组件放到页面合适位置
 * 3. 广告审核通过后，将 type="placeholder" 改为 type="adsense"
 *    并补充 data-ad-client 和 data-ad-slot
 *
 * data-ad-client: 你的 AdSense 发布商 ID（如 ca-pub-XXXXXXXXXX）
 * data-ad-slot:   每个广告单元的唯一 ID
 */

interface AdSlotProps {
  /** 广告位类型 */
  variant?: 'leaderboard' | 'medium-rectangle' | 'responsive';
  /** 广告发布商 ID（接入 AdSense 后填入） */
  clientId?: string;
  /** 广告单元 ID（接入 AdSense 后填入） */
  slotId?: string;
  /** 是否显示占位边框（接入前显示，接入后可关闭） */
  showPlaceholder?: boolean;
}

/** 各广告位类型的尺寸 */
const AD_SIZES: Record<NonNullable<AdSlotProps['variant']>, { className: string; placeholder: string }> = {
  leaderboard: {
    className: 'w-full max-w-[728px] h-[90px] mx-auto',
    placeholder: '728 × 90',
  },
  'medium-rectangle': {
    className: 'w-[300px] h-[250px] mx-auto',
    placeholder: '300 × 250',
  },
  responsive: {
    className: 'w-full min-h-[90px] max-h-[280px]',
    placeholder: '自适应',
  },
};

export default function AdSlot({
  variant = 'responsive',
  clientId,
  slotId,
  showPlaceholder = true,
}: AdSlotProps) {
  const size = AD_SIZES[variant];

  // 已接入 AdSense：渲染真实广告单元
  if (clientId && slotId) {
    return (
      <div className={size.className}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // 未接入时：显示占位区域
  if (showPlaceholder) {
    return (
      <div className={`${size.className} flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300`}>
        <div className="text-center text-gray-400">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto mb-1 opacity-50"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M8 10h8M8 14h6" />
          </svg>
          <p className="text-xs">
            Google AdSense
            <span className="block text-[10px] opacity-60">{size.placeholder}</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}