import React from 'react';
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router';
import Search from '@components/Search';

function useHead() {
  const { asPath } = useRouter();
  const { frontMatter, title } = useConfig();
  const url = `https://marinenationale.github.io${asPath}`;
  const description = frontMatter.description || "Documentation for NEP(s)";

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
    </>
  );
}

function useNextSeoProps() {
  const { asPath } = useRouter();
  const arr = asPath.replace(/[-_]/g, ' ').split('/');
  const category = (arr[1][0] !== '#' && arr[1]) || 'Marine Nationale';
  const rawTitle = arr[arr.length - 1];
  const title = /[a-z]/.test(rawTitle) && /[A-Z]/.test(rawTitle) ? rawTitle : '%s';
  const categoryDisplayName =
    category === 'nsm' ? 'Naval Systems Manager' : category.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

  if (rawTitle === category) {
    return {
      titleTemplate: `Introduction - ${categoryDisplayName}`,
    };
  }

  return {
    titleTemplate: `${title} - ${categoryDisplayName}`,
  };
}

const config: DocsThemeConfig = {
  logo: (
    <div
      style={{
        paddingLeft: '50px',
        lineHeight: '38px',
        background: "url('https://avatars.githubusercontent.com/u/269428020?s=38') no-repeat left",
        backgroundSize: '38px',
        fontWeight: 550,
      }}
    >
      Marine Nationale - Documentation
    </div>
  ),
  project: {
    link: 'https://github.com/marinenationale/Naval-Systems-Manager',
  },
  chat: {
    link: 'https://discord.gg/9JtmUEJEfW',
  },
  docsRepositoryBase: 'https://github.com/marinenationale/marinenationale.github.io/blob/main',
  feedback: {
    content: null,
  },
  editLink: {
    text: null,
  },
  footer: {
    text: 'Marine Nationale - Naval Engineership Products Documentation',
  },
  search: {
    component: <Search />,
  },
  head: useHead,
  primaryHue: { dark: 200, light: 200 },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  toc: {
    backToTop: true,
  },

  useNextSeoProps: useNextSeoProps,
};

export default config;
