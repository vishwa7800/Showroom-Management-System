declare module 'tailwindcss' {
  export interface Config {
    darkMode?: string | string[];
    content?: string[];
    theme?: Record<string, any>;
    plugins?: any[];
    [key: string]: any;
  }
}

declare module 'tailwindcss-animate';
