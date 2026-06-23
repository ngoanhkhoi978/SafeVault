import { motion } from 'framer-motion';

export type MainTab = 'encrypt' | 'decrypt';
export type SubTab = 'text' | 'file';

interface TabNavProps {
  mainTab: MainTab;
  subTab: SubTab;
  onMainTabChange: (tab: MainTab) => void;
  onSubTabChange: (tab: SubTab) => void;
}

const mainTabs: { key: MainTab; label: string }[] = [
  { key: 'encrypt', label: 'Encrypt' },
  { key: 'decrypt', label: 'Decrypt' },
];

const subTabs: { key: SubTab; label: string }[] = [
  { key: 'text', label: 'Text' },
  { key: 'file', label: 'File' },
];

export function TabNav({ mainTab, subTab, onMainTabChange, onSubTabChange }: TabNavProps) {
  return (
    <div className="sv-tabs-container">
      {/* Main Tabs */}
      <div className="sv-tabs-main">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            className={`sv-tab-main ${mainTab === tab.key ? 'sv-tab-main-active' : ''}`}
            onClick={() => onMainTabChange(tab.key)}
          >
            {tab.label}
            {mainTab === tab.key && (
              <motion.div
                className="sv-tab-indicator"
                layoutId="mainTabIndicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Sub Tabs */}
      <div className="sv-tabs-sub">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            className={`sv-tab-sub ${subTab === tab.key ? 'sv-tab-sub-active' : ''}`}
            onClick={() => onSubTabChange(tab.key)}
          >
            {tab.label}
            {subTab === tab.key && (
              <motion.div
                className="sv-tab-sub-indicator"
                layoutId="subTabIndicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
