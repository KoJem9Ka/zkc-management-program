import { Button } from '@nextui-org/react';
import { Link, useMatches } from '@tanstack/react-router';
import { Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { IconShield } from '@/components/icons.tsx';
import { $isWalletAndDidConnected } from '@/stores/other.ts';
import { ThemeStore } from '@/stores/theme.store.ts';
import { HeaderUserPanel } from './HeaderUserPanel.tsx';

export function Header(): ReactNode {
  const matches = useMatches();

  // const breadcrumbs = matches.map((match) => {
  //   return {
  //     title: match.context.title,
  //     path: match.pathname,
  //   };
  // });
  // console.log('breadcrumbs', breadcrumbs);

  const title = matches.at(-1)?.context.title;

  return (<>
    <Helmet>
      <title>{`${title} | ZCred App`}</title>
    </Helmet>
    <header className="sticky top-0 backdrop-blur bg-opacity-50 px-4 py-3 md:px-10 flex gap-2 items-center bg-default z-50">
      <Link to={'/'}><IconShield className="w-6 h-6" /></Link>
      <p className="text-2xl">{title}</p>
      <div className="grow" />
      {$isWalletAndDidConnected.value ? (
        <HeaderUserPanel />
      ) : (
        <Button onClick={ThemeStore.toggle} variant="light" radius="full" isIconOnly>{ThemeStore.$isDark.value ? <Sun /> : <Moon />}</Button>
      )}
    </header>
  </>);
}
