import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { leaveDemo, isDemoDb } from '../db/index';
import { TabBar } from '../ui/TabBar';
import { BannerButton, TopBanner } from '../ui/Misc';
import { applyTheme } from './theme';
import { useProfile } from './data';
import { UpdateBanner } from './UpdateBanner';
import styles from './App.module.css';

const SEM_ABAS = ['/registro'];

export function Shell() {
  const location = useLocation();
  const profile = useProfile();
  const demo = isDemoDb();
  const hideTabs = SEM_ABAS.some(
    (p) => location.pathname === p || location.pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    if (profile) applyTheme(profile.theme);
  }, [profile]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a href="#conteudo" className={styles.pular}>
        Pular para o conteúdo
      </a>
      {demo ? (
        <TopBanner
          action={
            <BannerButton
              onClick={() => {
                leaveDemo();
                window.location.assign('/?demo=0');
              }}
            >
              Sair da demonstração
            </BannerButton>
          }
        >
          Modo demonstração
        </TopBanner>
      ) : null}
      <UpdateBanner />
      <Outlet />
      {hideTabs ? null : <TabBar />}
    </>
  );
}
