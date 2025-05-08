import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import App from './root';

// Handle GitHub Pages 404 redirects
const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');
  const newPath = redirect.split('/?/')[1]?.replace(/~and~/g, '&');
  if (newPath) {
    window.history.replaceState(null, '', '/' + newPath);
  }
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