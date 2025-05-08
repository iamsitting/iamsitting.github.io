import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import App from './root';

// Handle GitHub Pages 404 redirects
const pathSegmentsToKeep = 0;
const l = window.location;
if (l.pathname.includes('/?/')) {
  const newPath = l.pathname.slice(1).split('/?/')[1].replace(/~and~/g, '&');
  const newSearch = l.search.slice(1).replace(/~and~/g, '&');
  const newUrl = l.pathname.split('/?/')[0] + '/' + newPath + (newSearch ? '?' + newSearch : '') + l.hash;
  window.history.replaceState(null, '', newUrl);
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes
  }
], {
  basename: '/'
});

const root = createRoot(document.getElementById('root')!);
root.render(
  <RouterProvider 
    router={router}
  />
); 