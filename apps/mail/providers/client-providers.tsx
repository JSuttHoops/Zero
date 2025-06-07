import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PostHogProvider } from '@/lib/posthog-provider';
import { useSettings } from '@/hooks/use-settings';
import CustomToaster from '@/components/ui/toast';
import { Provider as JotaiProvider } from 'jotai';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import Color from 'color';
import { ThemeProvider } from 'next-themes';

export function ClientProviders({ children }: PropsWithChildren) {
  const { data } = useSettings();

  const theme = data?.settings.colorTheme || 'system';

  useEffect(() => {
    if (!data?.settings) return;
    const { accentColor, backgroundColor } = data.settings;
    if (accentColor) {
      const [h, s, l] = Color(accentColor).hsl().array();
      document.documentElement.style.setProperty('--accent', `${h} ${s}% ${l}%`);
    }
    if (backgroundColor) {
      const [h, s, l] = Color(backgroundColor).hsl().array();
      document.documentElement.style.setProperty('--background', `${h} ${s}% ${l}%`);
    }
  }, [data?.settings?.accentColor, data?.settings?.backgroundColor]);

  return (
    <NuqsAdapter>
      <JotaiProvider>
        <ThemeProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
          defaultTheme={theme}
        >
          <SidebarProvider>
            <PostHogProvider>
              {children}
              <CustomToaster />
            </PostHogProvider>
          </SidebarProvider>
        </ThemeProvider>
      </JotaiProvider>
    </NuqsAdapter>
  );
}
