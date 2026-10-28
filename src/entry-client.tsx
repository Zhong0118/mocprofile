import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { content } from '@site-content';
import { App } from './App';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <BrowserRouter>
    <App bundle={content} />
  </BrowserRouter>
);

// Built pages are prerendered and hydrated; the dev server starts from an empty root.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
