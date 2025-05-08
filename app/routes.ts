import type { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    index: true,
    async lazy() {
      const { default: Component } = await import('./routes/home');
      return { Component };
    }
  },
  {
    path: 'about',
    async lazy() {
      const { default: Component } = await import('./routes/about');
      return { Component };
    }
  },
  {
    path: 'blog',
    async lazy() {
      const { default: Component } = await import('./routes/blog');
      return { Component };
    }
  },
  {
    path: 'post/*',
    async lazy() {
      const { default: Component } = await import('./routes/post');
      return { Component };
    }
  }
];

export default routes;
