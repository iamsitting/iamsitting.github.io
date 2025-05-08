import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import App from './root';

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