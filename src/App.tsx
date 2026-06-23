import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TabNav, type MainTab, type SubTab } from '@/components/TabNav';
import { EncryptText } from '@/components/encrypt/EncryptText';
import { EncryptFile } from '@/components/encrypt/EncryptFile';
import { DecryptText } from '@/components/decrypt/DecryptText';
import { DecryptFile } from '@/components/decrypt/DecryptFile';

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>('encrypt');
  const [subTab, setSubTab] = useState<SubTab>('text');

  const workspaceKey = `${mainTab}-${subTab}`;

  return (
    <div className="sv-app">
      <Header />

      <main className="sv-main">
        <motion.div
          className="sv-container"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <TabNav
            mainTab={mainTab}
            subTab={subTab}
            onMainTabChange={(tab) => {
              setMainTab(tab);
              setSubTab('text');
            }}
            onSubTabChange={setSubTab}
          />

          <div className="sv-workspace-wrapper">
            <AnimatePresence mode="wait">
              {mainTab === 'encrypt' && subTab === 'text' && (
                <EncryptText key={workspaceKey} />
              )}
              {mainTab === 'encrypt' && subTab === 'file' && (
                <EncryptFile key={workspaceKey} />
              )}
              {mainTab === 'decrypt' && subTab === 'text' && (
                <DecryptText key={workspaceKey} />
              )}
              {mainTab === 'decrypt' && subTab === 'file' && (
                <DecryptFile key={workspaceKey} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
