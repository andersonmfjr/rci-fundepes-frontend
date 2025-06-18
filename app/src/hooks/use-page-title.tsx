import { useEffect } from 'react';

interface UsePageTitleOptions {
  title: string;
  defaultTitle?: string;
}

export const usePageTitle = (options: UsePageTitleOptions | string) => {
  useEffect(() => {
    const config = typeof options === 'string' 
      ? { title: options, defaultTitle: 'RCI Manager' }
      : { defaultTitle: 'RCI Manager', ...options };

    const fullTitle = config.title 
      ? `${config.title} - ${config.defaultTitle}`
      : config.defaultTitle;

    document.title = fullTitle;

    // Cleanup function to restore default title when component unmounts
    return () => {
      document.title = config.defaultTitle;
    };
  }, [options]);
};

export default usePageTitle; 